import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
// Note: useRef and useCallback are still used for rate limiting below
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Rate limiting: max 5 auth attempts per 5 minutes
const AUTH_RATE_LIMIT = 5;
const AUTH_RATE_WINDOW_MS = 5 * 60 * 1000;

export type UserRole = 'student' | 'landlord' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fetches user profile and role from the database.
 * Single source of truth — used by both auth listener and getSession.
 */
async function fetchUserProfile(userId: string, fallbackEmail: string, fallbackName: string): Promise<User> {
  const [profileResult, roleResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, name')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle(),
  ]);

  const resolvedRole: UserRole = (roleResult.data?.role as UserRole) || 'student';
  const profile = profileResult.data;

  if (profile) {
    return { id: profile.id, email: profile.email, name: profile.name, role: resolvedRole };
  }
  return { id: userId, email: fallbackEmail, name: fallbackName, role: resolvedRole };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Helper: fetch profile and update state
    const hydrateUser = async (s: Session) => {
      try {
        const userData = await fetchUserProfile(
          s.user.id,
          s.user.email ?? '',
          (s.user.user_metadata as any)?.name ?? 'Usuario'
        );
        if (mounted) setUser(userData);
      } catch (error) {
        if (import.meta.env.DEV) console.error('Error fetching profile:', error);
        if (mounted) setUser({
          id: s.user.id,
          email: s.user.email ?? '',
          name: (s.user.user_metadata as any)?.name ?? 'Usuario',
          role: ((s.user.user_metadata as any)?.role as UserRole) || 'student',
        });
      }
    };

    // 1. Check existing session immediately (resolves isLoading)
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) await hydrateUser(s);
      if (mounted) setIsLoading(false);
    });

    // 2. Listen for all future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        if (!mounted) return;
        setSession(s);
        if (s?.user) {
          await hydrateUser(s);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const authAttemptsRef = useRef<number[]>([]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    authAttemptsRef.current = authAttemptsRef.current.filter(
      (t) => now - t < AUTH_RATE_WINDOW_MS
    );
    if (authAttemptsRef.current.length >= AUTH_RATE_LIMIT) {
      return false;
    }
    authAttemptsRef.current.push(now);
    return true;
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    if (!checkRateLimit()) {
      throw new Error('Demasiados intentos. Espera unos minutos antes de intentarlo de nuevo.');
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        // Handle Supabase rate limiting (429)
        if (error.status === 429 || error.message.includes('rate limit')) {
          throw new Error('Demasiados intentos. Espera unos minutos antes de intentarlo de nuevo.');
        }
        // Translate common Supabase errors to user-friendly Spanish messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor confirma tu email antes de iniciar sesión');
        }
        if (error.message.includes('User not found')) {
          throw new Error('No existe una cuenta con este email');
        }
        throw new Error(error.message || 'Error al iniciar sesión');
      }
      
      if (!data.user) throw new Error('No se pudo iniciar sesión');

      // Fetch profile directly (profile created by DB trigger on signup)
      const userData = await fetchUserProfile(
        data.user.id,
        data.user.email ?? '',
        (data.user.user_metadata as any)?.name ?? 'Usuario'
      );

      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al iniciar sesión');
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        // Translate common Supabase errors to user-friendly Spanish messages
        if (error.message.includes('already registered')) {
          throw new Error('Este email ya está registrado. Por favor inicia sesión.');
        }
        if (error.message.includes('invalid email')) {
          throw new Error('El formato del email no es válido.');
        }
        if (error.message.includes('Password')) {
          throw new Error('La contraseña no cumple los requisitos de seguridad.');
        }
        throw new Error(error.message || 'Error al crear la cuenta');
      }
      
      if (!data.user) throw new Error('No se pudo crear la cuenta');

      // If email confirmation is pending, session is null — don't set user state
      if (!data.session) {
        setIsLoading(false);
        throw new Error('CONFIRM_EMAIL');
      }

      const userData = await fetchUserProfile(
        data.user.id,
        data.user.email ?? '',
        name
      );
      setUser(userData);
      setIsLoading(false);
      return userData;
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al crear la cuenta');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local state
      setUser(null);
      setSession(null);
    }
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
  };

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    requestPasswordReset,
    updatePassword,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};