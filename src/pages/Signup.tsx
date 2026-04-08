import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, GraduationCap, Building, CheckCircle2, Users, Shield, Star, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import SocialAuth from '@/components/auth/SocialAuth';

const signupSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  email: z.string()
    .trim()
    .email('Introduce un email válido')
    .max(255, 'Email demasiado largo')
    .toLowerCase(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe incluir al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Debe incluir al menos un carácter especial'),
  confirmAge: z.boolean()
    .refine(val => val === true, 'Debes confirmar que tienes al menos 14 años'),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Debes aceptar los términos y la política de privacidad')
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const validRoles: UserRole[] = ['student', 'landlord'];
  const [role, setRole] = useState<UserRole>(
    typeParam && validRoles.includes(typeParam as UserRole) ? (typeParam as UserRole) : 'student'
  );
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(0);
  const [emailPendingConfirmation, setEmailPendingConfirmation] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
      .then(({ count }) => setStudentCount(count || 0));
  }, []);

  const { register, handleSubmit, formState: { errors }, setError, control, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      confirmAge: false,
      acceptTerms: false
    }
  });

  const passwordValue = watch('password', '');

  const roleOptions = [
    {
      value: 'student' as UserRole,
      label: 'Estudiante',
      description: 'Busco alojamiento universitario',
      icon: GraduationCap
    },
    {
      value: 'landlord' as UserRole,
      label: 'Propietario/Inmobiliaria',
      description: 'Ofrezco alojamiento para estudiantes',
      icon: Building
    }
  ];

  const onSubmit = async (data: SignupForm) => {
    try {
      const user = await signup(data.email, data.password, data.name, role);

      toast.success('¡Cuenta creada exitosamente!', {
        description: 'Bienvenido a Livix',
        duration: 3000,
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      if (user.role === 'landlord') {
        navigate('/ll/onboarding');
      } else {
        navigate('/onboarding/student');
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'CONFIRM_EMAIL') {
        toast.success('¡Revisa tu email!', {
          description: 'Te hemos enviado un enlace de confirmación. Revisa tu bandeja de entrada.',
          duration: 6000,
        });
        navigate('/login');
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Error al crear la cuenta. Por favor, intenta de nuevo.';

      // Caso especial: email pendiente de confirmación
      if (errorMessage === 'NEEDS_EMAIL_CONFIRMATION') {
        setEmailPendingConfirmation((document.getElementById('email') as HTMLInputElement)?.value || 'tu email');
        return;
      }

      setError('root', {
        type: 'manual',
        message: errorMessage
      });

      toast.error('Error al crear cuenta', {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  // Pantalla de confirmación de email pendiente
  if (emailPendingConfirmation) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Confirma tu email</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Hemos enviado un enlace de confirmación a{' '}
                  <span className="font-medium text-foreground">{emailPendingConfirmation}</span>.
                  Abre el email y haz clic en el enlace para activar tu cuenta.
                </p>
                <p className="text-xs text-muted-foreground">
                  ¿No lo ves? Revisa la carpeta de spam o correo no deseado.
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                  Ir a iniciar sesión
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
          {studentCount > 0 && (
            <div className="flex items-center justify-center gap-6 mb-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                <span>{studentCount}+ estudiantes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-green-500" />
                <span>100% verificado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Sin comisiones</span>
              </div>
            </div>
          )}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Crear cuenta</CardTitle>
              <CardDescription>
                Únete a la comunidad de Livix
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <SocialAuth mode="signup" />

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  o regístrate con email
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.root.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    {...register('name')}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    {...register('email')}
                    placeholder="tu-email@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    enterKeyHint="done"
                    {...register('password')}
                    placeholder="Mínimo 8 caracteres"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                  <div className="text-xs text-muted-foreground space-y-1 mt-1">
                    <p className={`flex items-center gap-1 ${passwordValue.length >= 8 && passwordValue.length <= 72 ? 'text-green-600' : ''}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      Entre 8 y 72 caracteres
                    </p>
                    <p className={`flex items-center gap-1 ${/[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue) ? 'text-green-600' : ''}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      Una letra mayúscula y una minúscula
                    </p>
                    <p className={`flex items-center gap-1 ${/\d/.test(passwordValue) ? 'text-green-600' : ''}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      Al menos un número
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Tipo de cuenta</Label>
                  <div className="grid gap-3">
                    {roleOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${role === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                          }`}
                        onClick={() => setRole(option.value)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 p-1 rounded ${role === option.value ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            <option.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                          <div className={`h-4 w-4 rounded-full border-2 ${role === option.value
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                            }`}>
                            {role === option.value && (
                              <div className="h-full w-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GDPR Compliance: Age Verification (14+ per LOPDGDD) */}
                <div className="space-y-4 pt-2 border-t">
                  <div className="flex items-start space-x-3">
                    <Controller
                      name="confirmAge"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="confirmAge"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="confirmAge"
                        className="text-sm font-normal cursor-pointer leading-tight"
                      >
                        Confirmo que tengo al menos 14 años de edad
                      </Label>
                      {errors.confirmAge && (
                        <p className="text-sm text-destructive">{errors.confirmAge.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Controller
                      name="acceptTerms"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="acceptTerms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm font-normal cursor-pointer leading-tight"
                      >
                        Acepto los{' '}
                        <Link to="/legal/terms" className="text-primary hover:underline" target="_blank">
                          Términos de Servicio
                        </Link>{' '}y la{' '}
                        <Link to="/legal/privacy" className="text-primary hover:underline" target="_blank">
                          Política de Privacidad
                        </Link>
                      </Label>
                      {errors.acceptTerms && (
                        <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear cuenta
                </Button>
              </form>

              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Inicia sesión aquí
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

export default Signup;