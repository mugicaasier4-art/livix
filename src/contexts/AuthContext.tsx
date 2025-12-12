import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching with setTimeout
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, email, name')
                .eq('id', session.user.id)
                .maybeSingle();

              // Fetch role separately to avoid missing FK relationships
              let resolvedRole: UserRole = 'student';
              const { data: roleRow } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .maybeSingle();
              if (roleRow?.role) resolvedRole = roleRow.role as UserRole;
              
              if (profile) {
                setUser({
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  role: resolvedRole
                });
              } else {
                // Fallback to auth user data if profile row is not yet created
                setUser({
                  id: session.user.id,
                  email: session.user.email ?? '',
                  name: (session.user.user_metadata as any)?.name ?? 'Usuario',
                  role: resolvedRole
                });
              }
            } catch (error) {
              if (import.meta.env.DEV) {
                console.error('Error fetching profile:', error);
              }
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, email, name')
              .eq('id', session.user.id)
              .maybeSingle();

            let resolvedRole: UserRole = 'student';
            const { data: roleRow } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();
            if (roleRow?.role) resolvedRole = roleRow.role as UserRole;
            
            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: resolvedRole
              });
            } else if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email ?? '',
                name: (session.user.user_metadata as any)?.name ?? 'Usuario',
                role: resolvedRole
              });
            }
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error('Error fetching profile:', error);
            }
          }
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });
      
      if (error) {
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
      
      // Wait a bit for data consistency
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Get profile and role with retry
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, name')
        .eq('id', data.user.id)
        .maybeSingle();
      
      let resolvedRole: UserRole = 'student';
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();
      
      if (roleRow?.role) resolvedRole = roleRow.role as UserRole;
      
      const userData: User = profile ? {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: resolvedRole
      } : {
        id: data.user.id,
        email: data.user.email ?? '',
        name: (data.user.user_metadata as any)?.name ?? 'Usuario',
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