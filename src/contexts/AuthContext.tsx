import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Fetches user profile and role from the database.
 * If the trigger failed and the profile doesn't exist, creates it as fallback.
 */
async function fetchUserProfile(userId: string, fallbackEmail: string, fallbackName: string): Promise<User> {
  const [profileResult, roleResult] = await Promise.all([
    supabase.from('profiles').select('id, email, name').eq('id', userId).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle(),
  ]);

  // Handle pending role from OAuth flow (Google OAuth can't pass metadata, so we store in sessionStorage)
  // IMPORTANT: Only apply for NEW users (no existing role). Never change role of existing users.
  const pendingRole = sessionStorage.getItem('livix_pending_role') as 'student' | 'landlord' | null;
  let resolvedRole: UserRole = (roleResult.data?.role as UserRole) || 'student';

  if (pendingRole) {
    sessionStorage.removeItem('livix_pending_role'); // Always clean up
    if (['student', 'landlord'].includes(pendingRole)) {
      if (!roleResult.data) {
        // Trigger missed — set role directly
        resolvedRole = pendingRole as UserRole;
      } else if (roleResult.data.role === 'student' && pendingRole === 'landlord') {
        // Trigger created 'student' but user chose landlord on signup — upgrade via UPDATE
        const { error: upgradeError } = await supabase
          .from('user_roles')
          .update({ role: 'landlord' })
          .eq('user_id', userId);
        if (!upgradeError) {
          resolvedRole = 'landlord';
        } else {
          console.error('Failed to upgrade role to landlord:', upgradeError);
        }
      }
    }
  }

  if (profileResult.data) {
    return {
      id: profileResult.data.id,
      email: profileResult.data.email,
      name: profileResult.data.name,
      role: resolvedRole,
    };
  }

  // Perfil no existe → el trigger falló. Crearlo desde el frontend como fallback.
  const { data: newProfile, error: upsertError } = await supabase
    .from('profiles')
    .upsert({ id: userId, email: fallbackEmail, name: fallbackName }, { onConflict: 'id' })
    .select('id, email, name')
    .maybeSingle();

  if (upsertError) {
    console.error('Profile fallback upsert failed:', upsertError);
  }

  if (!roleResult.data) {
    await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: resolvedRole }, { onConflict: 'user_id,role' });
  }

  return {
    id: userId,
    email: newProfile?.email ?? fallbackEmail,
    name: newProfile?.name ?? fallbackName,
    role: resolvedRole,
  };
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
        console.error('Error fetching profile:', error);
        if (mounted) toast.error('Error al cargar tu perfil. Recarga la página.');
      }
    };

    // 1. Check existing session immediately (resolves isLoading)
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      try {
        if (s?.user) await hydrateUser(s);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }).catch((error) => {
      console.error('getSession error:', error);
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

  const refreshUser = useCallback(async (): Promise<void> => {
    if (!session?.user) return;
    try {
      const userData = await fetchUserProfile(
        session.user.id,
        session.user.email ?? '',
        (session.user.user_metadata as any)?.name ?? 'Usuario'
      );
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, [session]);

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

      // Sin sesión = confirmación de email requerida
      if (!data.session) {
        setIsLoading(false);
        throw new Error('NEEDS_EMAIL_CONFIRMATION');
      }
      
      // Wait a bit for the trigger to create the profile and role
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the created profile with retry logic
      let profile = null;
      let attempts = 0;
      while (!profile && attempts < 3) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, email, name')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileData) {
          profile = profileData;
        } else {
          await new Promise(resolve => setTimeout(resolve, 300));
          attempts++;
        }
      }
      
      // Get role with retry logic
      let resolvedRole: UserRole = role;
      attempts = 0;
      while (attempts < 3) {
        const { data: roleRow } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();
        
        if (roleRow?.role) {
          resolvedRole = roleRow.role as UserRole;
          break;
        } else {
          await new Promise(resolve => setTimeout(resolve, 300));
          attempts++;
        }
      }
      
      const userData: User = profile ? {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: resolvedRole
      } : {
        id: data.user.id,
        email: data.user.email ?? '',
        name: name,
        role: resolvedRole
      };
      
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
    refreshUser,
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