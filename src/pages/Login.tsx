import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import SocialAuth from '@/components/auth/SocialAuth';

const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Introduce un email válido')
    .max(255, 'Email demasiado largo')
    .toLowerCase(),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .max(255, 'Contraseña demasiado larga')
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const registerWithClear = (name: keyof LoginForm) => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (errors.root) clearErrors('root');
        return onChange(e);
      }
    };
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await login(data.email, data.password);
      
      // Show success message
      toast.success('¡Bienvenido de vuelta!', {
        description: `Hola, ${user.name}`,
        duration: 2000,
      });
      
      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'landlord') {
        navigate('/ll/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      
      setError('root', { 
        type: 'manual', 
        message: errorMessage
      });
      
      toast.error('Error al iniciar sesión', {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta de Livix
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {from !== '/' && (
                <Alert className="bg-primary/5 border-primary/20">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    Inicia sesión para continuar donde lo dejaste
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.root.message}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    {...registerWithClear('email')}
                    placeholder="tu-email@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline py-1"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    enterKeyHint="done"
                    {...registerWithClear('password')}
                    placeholder="Tu contraseña"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar sesión
                </Button>
              </form>
              
              <SocialAuth mode="login" />
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  ¿No tienes cuenta?{' '}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Crear cuenta gratis
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;