import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string()
    .trim()
    .email('Introduce un email válido')
    .max(255, 'Email demasiado largo')
    .toLowerCase()
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      setIsSuccess(true);
      toast.success('Email enviado', {
        description: 'Revisa tu bandeja de entrada',
        duration: 4000,
      });
    } catch (err) {
      // Por seguridad, no revelamos si el email existe
      setIsSuccess(true);
      toast.success('Email enviado', {
        description: 'Si el email existe, recibirás instrucciones',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
              <CardDescription>
                {isSuccess 
                  ? 'Revisa tu email para continuar'
                  : 'Te enviaremos un link para restablecer tu contraseña'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSuccess ? (
                <div className="space-y-4">
                  <Alert className="border-green-500 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Si existe una cuenta con ese email, recibirás instrucciones para restablecer tu contraseña.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <p>
                      No olvides revisar tu carpeta de spam.
                    </p>
                    <p>
                      El link expirará en 1 hora.
                    </p>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" asChild>
                      <Link to="/login">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio de sesión
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
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
                      autoComplete="email"
                      {...register('email')}
                      placeholder="tu-email@ejemplo.com"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar link de recuperación
                  </Button>
                  
                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Volver al inicio de sesión
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
