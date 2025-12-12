import { useEffect } from "react";
import { CheckCircle, ArrowLeft, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";

const Success = () => {
  const { t } = useI18n();
  const ticketId = new URLSearchParams(window.location.search).get('id') || 'CR-UNKNOWN';

  useEffect(() => {
    analytics.track('support_success_viewed', { ticket_id: ticketId });
  }, [ticketId]);

  const currentTime = new Date().toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-green-900">
            {t('support.success_title')}
          </h1>
          
          <p className="text-muted-foreground">
            {t('support.success_description')}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Detalles del ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">ID del ticket</p>
                  <p className="text-2xl font-mono font-bold text-primary">#{ticketId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Creado el</p>
                  <p className="text-sm font-medium">{currentTime}</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>✅ Tu consulta fue registrada exitosamente</p>
                <p>📧 Recibirás una confirmación por email</p>
                <p>⏰ Tiempo de respuesta: 24-48 horas hábiles</p>
                <p>🕐 Zona horaria: Europe/Madrid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold mb-4">
            {t('support.what_next')}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                analytics.track('support_success_back_clicked');
                window.location.href = '/support';
              }}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('support.back_to_help')}
            </Button>
            
            <Button 
              onClick={() => {
                analytics.track('support_success_guide_clicked');
                window.location.href = '/erasmus/guide';
              }}
              variant="outline"
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {t('support.erasmus_guide')}
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-900">
              💡 <strong>Tip:</strong> Guarda el ID del ticket #{ticketId} para futuras referencias.
              Te será útil si necesitas hacer seguimiento de tu consulta.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Success;