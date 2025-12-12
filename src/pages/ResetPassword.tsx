import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe incluir al menos un carácter especial'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState<boolean | null>(null);

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const password = watch('password');

  // Check if user has a valid recovery token on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setHasValidToken(!!session);
        
        if (!session) {
          toast.error('Link inválido o expirado', {
            description: 'Por favor solicita un nuevo link de recuperación',
            duration: 5000,
          });
        }
      } catch (error) {
        setHasValidToken(false);
        toast.error('Error al verificar el link', {
          description: 'Por favor solicita un nuevo link de recuperación',
          duration: 5000,
        });
      }
    };
    
    checkToken();
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (hasValidToken === false) {
      toast.error('No se puede actualizar la contraseña', {
        description: 'Link inválido o expirado',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(data.password);
      
      toast.success('¡Contraseña actualizada!', {
        description: 'Tu contraseña ha sido actualizada exitosamente',
        duration: 3000,
      });
      
      // Redirigir al login después de 1.5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      
      // Verificar si es un error de token inválido
      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('session')) {
        setError('root', { 
          type: 'manual', 
          message: 'El link de recuperación ha expirado o es inválido. Por favor solicita uno nuevo.'
        });
        toast.error('Link expirado', {
          description: 'Por favor solicita un nuevo link de recuperación',
          duration: 5000,
        });
      } else {
        setError('root', { 
          type: 'manual', 
          message: 'Error al actualizar la contraseña. Por favor intenta nuevamente.'
        });
        toast.error('Error al actualizar contraseña', {
          description: errorMessage || 'Por favor intenta nuevamente',
          duration: 5000,
        });
      }
    }
  };

  // Show loading while checking token
  if (hasValidToken === null) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Verificando link de recuperación...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error if no valid token
  if (hasValidToken === false) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Link inválido</CardTitle>
                <CardDescription>
                  El link de recuperación ha expirado o es inválido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Por favor solicita un nuevo link de recuperación de contraseña.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/forgot-password">
                    Solicitar nuevo link
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Nueva contraseña</CardTitle>
              <CardDescription>
                Ingresa tu nueva contraseña
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.root.message}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...register('password')}
                      placeholder="Mínimo 8 caracteres"
                      disabled={isLoading}
                    />
                    {password && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <CheckCircle2 className={`h-4 w-4 ${password.length >= 8 && password.length <= 72 ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <CheckCircle2 className={`h-4 w-4 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <CheckCircle2 className={`h-4 w-4 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <CheckCircle2 className={`h-4 w-4 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <CheckCircle2 className={`h-4 w-4 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-500' : 'text-muted-foreground'}`} />
                      </div>
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className={`h-3 w-3 ${password?.length >= 8 && password?.length <= 72 ? 'text-green-500' : ''}`} />
                      Entre 8 y 72 caracteres
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className={`h-3 w-3 ${/[A-Z]/.test(password || '') ? 'text-green-500' : ''}`} />
                      Una mayúscula
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className={`h-3 w-3 ${/[a-z]/.test(password || '') ? 'text-green-500' : ''}`} />
                      Una minúscula
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className={`h-3 w-3 ${/[0-9]/.test(password || '') ? 'text-green-500' : ''}`} />
                      Un número
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className={`h-3 w-3 ${/[!@#$%^&*(),.?":{}|<>]/.test(password || '') ? 'text-green-500' : ''}`} />
                      Un carácter especial
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    placeholder="Repite tu contraseña"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Actualizar contraseña
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Asegúrate de usar una contraseña segura que no uses en otros sitios.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
