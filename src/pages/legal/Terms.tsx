import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";

const Terms = () => {
  const { language } = useI18n();

  useEffect(() => {
    analytics.track('legal_terms_viewed');
  }, []);

  const lastUpdated = "2024-01-15";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1>
            {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {language === 'en' 
              ? `Last updated: ${lastUpdated}` 
              : `Última actualización: ${lastUpdated}`
            }
          </p>

          <div className="space-y-8">
            <section>
              <h2>1. {language === 'en' ? 'Introduction' : 'Introducción'}</h2>
              <p>
                {language === 'en' 
                  ? 'Livix is a platform that connects students with housing providers in Spain. We are not a real estate agency.'
                  : 'Livix es una plataforma que conecta estudiantes con proveedores de alojamiento en España. No somos una agencia inmobiliaria.'
                }
              </p>
            </section>

            <section>
              <h2>2. {language === 'en' ? 'Eligibility and Accounts' : 'Elegibilidad y Cuentas'}</h2>
              <p>
                {language === 'en' 
                  ? 'Users must be of legal age or have parental permission. All provided information must be accurate and truthful.'
                  : 'Los usuarios deben ser mayores de edad o tener permiso de los padres. Toda la información proporcionada debe ser precisa y veraz.'
                }
              </p>
            </section>

            <section>
              <h2>3. {language === 'en' ? 'Platform Usage' : 'Uso de la Plataforma'}</h2>
              <p>
                {language === 'en' 
                  ? 'Prohibited activities include fraud, spam, impersonation, and unreasonable use of the platform.'
                  : 'Las actividades prohibidas incluyen fraude, spam, suplantación de identidad y uso no razonable de la plataforma.'
                }
              </p>
            </section>

            <section>
              <h2>4. {language === 'en' ? 'Payments and Reservations' : 'Pagos y Reservas'}</h2>
              <p>
                {language === 'en' 
                  ? 'In MVP: reservation payments through Stripe test mode. Demo policies apply.'
                  : 'En MVP: pagos de reserva a través de Stripe en modo test. Se aplican políticas demo.'
                }
              </p>
            </section>

            <section>
              <h2>5. {language === 'en' ? 'Contracts' : 'Contratos'}</h2>
              <p>
                {language === 'en' 
                  ? 'Mock PDF contracts without real e-signature functionality in MVP.'
                  : 'Contratos PDF mock sin funcionalidad de firma electrónica real en MVP.'
                }
              </p>
            </section>

            <section>
              <h2>6. {language === 'en' ? 'Applicable Law' : 'Ley Aplicable'}</h2>
              <p>
                {language === 'en' 
                  ? 'These terms are governed by Spanish law and jurisdiction.'
                  : 'Estos términos se rigen por la ley y jurisdicción española.'
                }
              </p>
            </section>

            <section>
              <h2>7. {language === 'en' ? 'Contact' : 'Contacto'}</h2>
              <p>
                {language === 'en' 
                  ? 'For legal matters: legal@livix.app'
                  : 'Para asuntos legales: legal@livix.app'
                }
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;