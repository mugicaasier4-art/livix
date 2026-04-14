import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const hasExchanged = useRef(false);

  // Exchange the PKCE code for a session — runs once on mount
  useEffect(() => {
    if (hasExchanged.current) return;
    hasExchanged.current = true;

    const code = searchParams.get('code');
    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('OAuth code exchange failed:', error);
        setExchangeError(error.message);
      }
      setIsDone(true);
    });
  }, []);

  // Once exchange succeeded and AuthContext has hydrated user, redirect
  useEffect(() => {
    if (!isDone || exchangeError) return;
    if (!user) return;

    const returnTo = searchParams.get('returnTo');
    const decoded = returnTo ? decodeURIComponent(returnTo) : null;
    const safeReturn =
      decoded && decoded !== '/login' && decoded !== '/signup' ? decoded : '/';

    if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (user.role === 'landlord') navigate('/ll/dashboard', { replace: true });
    else navigate(safeReturn, { replace: true });
  }, [isDone, user, exchangeError]);

  // Timeout fallback: if user doesn't hydrate within 10s, show error
  useEffect(() => {
    if (!isDone || exchangeError || user) return;
    const timer = setTimeout(() => {
      setExchangeError('No se pudo cargar tu perfil. Intenta de nuevo.');
    }, 10000);
    return () => clearTimeout(timer);
  }, [isDone, exchangeError, user]);

  if (exchangeError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-base font-medium text-destructive">Error al iniciar sesión</p>
        <p className="text-sm text-muted-foreground text-center max-w-sm">{exchangeError}</p>
        <Button asChild variant="outline">
          <Link to="/login">Volver al login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-[#5DB4EE]" />
    </div>
  );
};

export default AuthCallback;
