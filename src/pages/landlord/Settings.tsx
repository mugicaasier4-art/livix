import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LandlordSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    newApplications: true,
    newMessages: true,
    applicationUpdates: true,
    marketingEmails: false
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success('Preferencias actualizadas', {
      description: 'Tus preferencias de notificación se han guardado'
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Configuración de Propietario</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus preferencias y notificaciones
          </p>
        </div>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Elige cómo quieres recibir actualizaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="newApplications" className="text-base font-medium">
                    Nuevas solicitudes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones cuando lleguen nuevas solicitudes
                  </p>
                </div>
              </div>
              <Switch
                id="newApplications"
                checked={notifications.newApplications}
                onCheckedChange={() => handleNotificationChange('newApplications')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="newMessages" className="text-base font-medium">
                    Nuevos mensajes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones de mensajes de estudiantes
                  </p>
                </div>
              </div>
              <Switch
                id="newMessages"
                checked={notifications.newMessages}
                onCheckedChange={() => handleNotificationChange('newMessages')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="applicationUpdates" className="text-base font-medium">
                    Actualizaciones de solicitudes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cambios de estado en las solicitudes
                  </p>
                </div>
              </div>
              <Switch
                id="applicationUpdates"
                checked={notifications.applicationUpdates}
                onCheckedChange={() => handleNotificationChange('applicationUpdates')}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="marketingEmails" className="text-base font-medium">
                    Emails promocionales
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Consejos, noticias y ofertas especiales
                  </p>
                </div>
              </div>
              <Switch
                id="marketingEmails"
                checked={notifications.marketingEmails}
                onCheckedChange={() => handleNotificationChange('marketingEmails')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              Editar perfil
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              Configuración de cuenta
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/ll/dashboard')}
            >
              Ir al dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LandlordSettings;
