import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";

const Privacy = () => {
  const { language } = useI18n();

  useEffect(() => {
    analytics.track('legal_privacy_viewed');
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1>
            {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {language === 'en' 
              ? 'Last updated: 2024-01-15' 
              : 'Última actualización: 2024-01-15'
            }
          </p>

          <div className="space-y-8">
            <section>
              <h2>1. {language === 'en' ? 'Data Controller' : 'Responsable del Tratamiento'}</h2>
              <p>
                {language === 'en' 
                  ? 'Livix, Spain. DPO contact: dpo@livix.app'
                  : 'Livix, España. Contacto DPO: dpo@livix.app'
                }
              </p>
            </section>

            <section>
              <h2>2. {language === 'en' ? 'Data Categories' : 'Categorías de Datos'}</h2>
              <p>
                {language === 'en' 
                  ? 'We collect account data, profiles, listings, support tickets, test payments, and analytics data.'
                  : 'Recopilamos datos de cuenta, perfiles, anuncios, tickets de soporte, pagos de prueba y datos analíticos.'
                }
              </p>
            </section>

            <section>
              <h2>3. {language === 'en' ? 'Your Rights' : 'Tus Derechos'}</h2>
              <p>
                {language === 'en' 
                  ? 'You have rights to access, rectify, delete, object, limit, and port your data under GDPR.'
                  : 'Tienes derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos bajo GDPR.'
                }
              </p>
              
              <div className="mt-6 flex gap-4">
                <Button 
                  onClick={() => {
                    analytics.track('privacy_dsar_cta_clicked', { type: 'access' });
                    window.location.href = '/support/submit?topic=privacidad&subject=Solicitud%20de%20acceso%20a%20mis%20datos';
                  }}
                  variant="outline"
                >
                  {language === 'en' ? 'Request My Data' : 'Solicitar mis datos'}
                </Button>
                
                <Button 
                  onClick={() => {
                    analytics.track('privacy_dsar_cta_clicked', { type: 'deletion' });
                    window.location.href = '/support/submit?topic=privacidad&subject=Solicitud%20de%20eliminación%20de%20cuenta';
                  }}
                  variant="outline"
                >
                  {language === 'en' ? 'Delete Account' : 'Eliminar cuenta'}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;