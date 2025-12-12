import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialAuthProps {
  mode: 'login' | 'signup';
}

const SocialAuth = ({ mode }: SocialAuthProps) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al conectar con Google';
      toast.error('Error de autenticación', { description: message });
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      toast.error('Introduce un número de teléfono');
      return;
    }

    // Format phone number (add +34 if no country code)
    const formattedPhone = phone.startsWith('+') ? phone : `+34${phone.replace(/\s/g, '')}`;
    
    setIsPhoneLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      
      if (error) throw error;
      
      setOtpSent(true);
      toast.success('Código enviado', { 
        description: `Hemos enviado un SMS a ${formattedPhone}` 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al enviar el código';
      toast.error('Error', { description: message });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Introduce el código de 6 dígitos');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+34${phone.replace(/\s/g, '')}`;
    
    setIsPhoneLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw error;
      
      toast.success('¡Verificación exitosa!');
      // Auth state change will handle redirect
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Código inválido';
      toast.error('Error', { description: message });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          o continúa con
        </span>
      </div>

      <div className="grid gap-3">
        {/* Google Auth Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Google
        </Button>

        {/* Phone Auth Button/Form */}
        {!showPhoneInput ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowPhoneInput(true)}
          >
            <Phone className="mr-2 h-4 w-4" />
            Teléfono
          </Button>
        ) : (
          <div className="space-y-3 rounded-lg border p-4">
            {!otpSent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de teléfono</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center justify-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                      +34
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="612 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPhoneInput(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    onClick={handlePhoneSubmit}
                    disabled={isPhoneLoading}
                  >
                    {isPhoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar código
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Código de verificación</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    Introduce el código de 6 dígitos enviado a tu teléfono
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                  >
                    Cambiar número
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    onClick={handleOtpVerify}
                    disabled={isPhoneLoading}
                  >
                    {isPhoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verificar
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialAuth;
