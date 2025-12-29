import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import {
  Shield,
  User,
  Database,
  Clock,
  Globe,
  FileText,
  Download,
  Trash2,
  Eye,
  Ban,
  Edit3,
  ArrowRight
} from "lucide-react";

const Privacy = () => {
  const { language } = useI18n();

  useEffect(() => {
    analytics.track('legal_privacy_viewed');
  }, []);

  const handleDSAR = (type: 'access' | 'deletion' | 'portability' | 'rectification' | 'objection') => {
    analytics.track('privacy_dsar_cta_clicked', { type });
    const subjects: Record<string, string> = {
      access: 'Solicitud de acceso a mis datos',
      deletion: 'Solicitud de eliminación de cuenta',
      portability: 'Solicitud de portabilidad de datos',
      rectification: 'Solicitud de rectificación de datos',
      objection: 'Oposición al tratamiento de datos'
    };
    window.location.href = `/support/submit?topic=privacidad&subject=${encodeURIComponent(subjects[type])}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="mb-0">
              {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
            </h1>
          </div>

          <p className="text-muted-foreground mb-8">
            {language === 'en'
              ? 'Last updated: December 2024'
              : 'Última actualización: Diciembre 2024'
            }
          </p>

          <div className="space-y-8">
            {/* 1. Data Controller */}
            <section>
              <h2 className="flex items-center gap-2">
                <User className="h-5 w-5" />
                1. {language === 'en' ? 'Data Controller' : 'Responsable del Tratamiento'}
              </h2>
              <div className="not-prose">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[120px]">{language === 'en' ? 'Company:' : 'Empresa:'}</dt>
                        <dd>Livix Technologies S.L.</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[120px]">CIF:</dt>
                        <dd>B-XXXXXXXX</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[120px]">{language === 'en' ? 'Address:' : 'Dirección:'}</dt>
                        <dd>España</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[120px]">Email:</dt>
                        <dd>
                          <a href="mailto:privacy@livix.app" className="text-primary hover:underline">
                            privacy@livix.app
                          </a>
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[120px]">{language === 'en' ? 'DPO Contact:' : 'Contacto DPO:'}</dt>
                        <dd>
                          <a href="mailto:dpo@livix.app" className="text-primary hover:underline">
                            dpo@livix.app
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 2. Data Categories */}
            <section>
              <h2 className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                2. {language === 'en' ? 'Data We Collect' : 'Datos que Recopilamos'}
              </h2>

              <div className="not-prose grid gap-3 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Account Data' : 'Datos de Cuenta'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Name, email, password (encrypted), account type (student/landlord)'
                      : 'Nombre, email, contraseña (cifrada), tipo de cuenta (estudiante/propietario)'
                    }
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Profile Data' : 'Datos de Perfil'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Profile photo, university, study year, bio, interests, preferences'
                      : 'Foto de perfil, universidad, año de estudios, biografía, intereses, preferencias'
                    }
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Roommate Matching Data' : 'Datos de Matching de Roommates'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Lifestyle preferences, budget range, location preferences, move-in date. Used for algorithmic matching with explicit consent.'
                      : 'Preferencias de estilo de vida, rango de presupuesto, preferencias de ubicación, fecha de mudanza. Usados para matching algorítmico con consentimiento explícito.'
                    }
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Listing Data' : 'Datos de Anuncios'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Property photos, descriptions, prices, amenities, availability'
                      : 'Fotos de propiedades, descripciones, precios, servicios, disponibilidad'
                    }
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {language === 'en' ? 'Usage Data' : 'Datos de Uso'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Anonymous analytics, page views, feature usage (with consent)'
                      : 'Analíticas anónimas, páginas vistas, uso de funcionalidades (con consentimiento)'
                    }
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 3. Legal Basis */}
            <section>
              <h2 className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                3. {language === 'en' ? 'Legal Basis for Processing' : 'Base Legal del Tratamiento'}
              </h2>

              <div className="not-prose overflow-x-auto mt-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">
                        {language === 'en' ? 'Processing' : 'Tratamiento'}
                      </th>
                      <th className="text-left p-3 font-medium">
                        {language === 'en' ? 'Legal Basis' : 'Base Legal'}
                      </th>
                      <th className="text-left p-3 font-medium">
                        {language === 'en' ? 'GDPR Article' : 'Artículo GDPR'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">{language === 'en' ? 'Account creation and management' : 'Creación y gestión de cuenta'}</td>
                      <td className="p-3">{language === 'en' ? 'Contract execution' : 'Ejecución de contrato'}</td>
                      <td className="p-3">Art. 6.1.b</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="p-3">{language === 'en' ? 'Roommate matching (profiling)' : 'Matching de roommates (profiling)'}</td>
                      <td className="p-3 font-medium text-primary">{language === 'en' ? 'Explicit consent' : 'Consentimiento explícito'}</td>
                      <td className="p-3">Art. 6.1.a + Art. 22</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">{language === 'en' ? 'Analytics' : 'Analíticas'}</td>
                      <td className="p-3">{language === 'en' ? 'Consent' : 'Consentimiento'}</td>
                      <td className="p-3">Art. 6.1.a</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="p-3">{language === 'en' ? 'Commercial communications' : 'Comunicaciones comerciales'}</td>
                      <td className="p-3">{language === 'en' ? 'Consent' : 'Consentimiento'}</td>
                      <td className="p-3">Art. 6.1.a</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">{language === 'en' ? 'Security and fraud prevention' : 'Seguridad y prevención de fraude'}</td>
                      <td className="p-3">{language === 'en' ? 'Legitimate interest' : 'Interés legítimo'}</td>
                      <td className="p-3">Art. 6.1.f</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="p-3">{language === 'en' ? 'Legal compliance' : 'Cumplimiento legal'}</td>
                      <td className="p-3">{language === 'en' ? 'Legal obligation' : 'Obligación legal'}</td>
                      <td className="p-3">Art. 6.1.c</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Retention Periods */}
            <section>
              <h2 className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                4. {language === 'en' ? 'Data Retention' : 'Plazos de Conservación'}
              </h2>

              <div className="not-prose overflow-x-auto mt-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">
                        {language === 'en' ? 'Data Type' : 'Tipo de Dato'}
                      </th>
                      <th className="text-left p-3 font-medium">
                        {language === 'en' ? 'Retention Period' : 'Plazo de Conservación'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">{language === 'en' ? 'Account data' : 'Datos de cuenta'}</td>
                      <td className="p-3">{language === 'en' ? 'Until account deletion + 30 days' : 'Hasta eliminación de cuenta + 30 días'}</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="p-3">{language === 'en' ? 'Listings' : 'Anuncios'}</td>
                      <td className="p-3">{language === 'en' ? 'Until deleted by user' : 'Hasta eliminación por el usuario'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">{language === 'en' ? 'Messages' : 'Mensajes'}</td>
                      <td className="p-3">{language === 'en' ? '2 years after last activity' : '2 años desde última actividad'}</td>
                    </tr>
                    <tr className="border-b bg-muted/30">
                      <td className="p-3">{language === 'en' ? 'Analytics data' : 'Datos analíticos'}</td>
                      <td className="p-3">{language === 'en' ? '26 months (anonymized)' : '26 meses (anonimizados)'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">{language === 'en' ? 'Legal/billing records' : 'Registros legales/facturación'}</td>
                      <td className="p-3">{language === 'en' ? '5 years (legal requirement)' : '5 años (requisito legal)'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. International Transfers */}
            <section>
              <h2 className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                5. {language === 'en' ? 'International Transfers' : 'Transferencias Internacionales'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Your data is stored in the European Union using Supabase (with a signed Data Processing Agreement - DPA). We do not transfer personal data outside the EU unless absolutely necessary and with appropriate safeguards (Standard Contractual Clauses).'
                  : 'Tus datos se almacenan en la Unión Europea usando Supabase (con un Acuerdo de Procesamiento de Datos - DPA firmado). No transferimos datos personales fuera de la UE salvo que sea absolutamente necesario y con las garantías apropiadas (Cláusulas Contractuales Tipo).'
                }
              </p>
            </section>

            {/* 6. Your Rights */}
            <section>
              <h2 className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                6. {language === 'en' ? 'Your Rights (ARCOPOL)' : 'Tus Derechos (ARCOPOL)'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Under GDPR and LOPDGDD, you have the following rights regarding your personal data:'
                  : 'Bajo el GDPR y la LOPDGDD, tienes los siguientes derechos respecto a tus datos personales:'
                }
              </p>

              <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDSAR('access')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">{language === 'en' ? 'Access' : 'Acceso'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Request a copy of your data' : 'Solicitar una copia de tus datos'}
                    </p>
                    <ArrowRight className="h-4 w-4 mt-2 text-primary" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDSAR('rectification')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Edit3 className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">{language === 'en' ? 'Rectification' : 'Rectificación'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Correct inaccurate data' : 'Corregir datos inexactos'}
                    </p>
                    <ArrowRight className="h-4 w-4 mt-2 text-primary" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDSAR('deletion')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Trash2 className="h-5 w-5 text-red-600" />
                      <h4 className="font-medium">{language === 'en' ? 'Deletion' : 'Supresión'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Delete your account and data' : 'Eliminar tu cuenta y datos'}
                    </p>
                    <ArrowRight className="h-4 w-4 mt-2 text-primary" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDSAR('objection')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Ban className="h-5 w-5 text-orange-600" />
                      <h4 className="font-medium">{language === 'en' ? 'Objection' : 'Oposición'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Object to certain processing' : 'Oponerte a ciertos tratamientos'}
                    </p>
                    <ArrowRight className="h-4 w-4 mt-2 text-primary" />
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleDSAR('portability')}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Download className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium">{language === 'en' ? 'Portability' : 'Portabilidad'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Export your data in JSON' : 'Exportar tus datos en JSON'}
                    </p>
                    <ArrowRight className="h-4 w-4 mt-2 text-primary" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium">{language === 'en' ? 'Limitation' : 'Limitación'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Limit how we use your data' : 'Limitar cómo usamos tus datos'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <p className="mt-6">
                {language === 'en'
                  ? 'To exercise any of these rights, click on the cards above or contact us at privacy@livix.app. We will respond within 30 days.'
                  : 'Para ejercer cualquiera de estos derechos, haz clic en las tarjetas de arriba o contáctanos en privacy@livix.app. Responderemos en un plazo de 30 días.'
                }
              </p>

              <p>
                {language === 'en'
                  ? 'You also have the right to lodge a complaint with the Spanish Data Protection Agency (AEPD) at www.aepd.es'
                  : 'También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en www.aepd.es'
                }
              </p>
            </section>

            {/* 7. Automated Decision Making */}
            <section>
              <h2>7. {language === 'en' ? 'Automated Decision Making & Profiling' : 'Decisiones Automatizadas y Profiling'}</h2>
              <p>
                {language === 'en'
                  ? 'Our roommate matching feature uses algorithmic profiling to suggest compatible matches based on your preferences. This processing:'
                  : 'Nuestra función de matching de roommates utiliza profiling algorítmico para sugerir compatibilidades basadas en tus preferencias. Este tratamiento:'
                }
              </p>
              <ul>
                <li>{language === 'en' ? 'Requires your explicit consent before activation' : 'Requiere tu consentimiento explícito antes de activarse'}</li>
                <li>{language === 'en' ? 'Can be disabled at any time in Settings' : 'Puede desactivarse en cualquier momento en Ajustes'}</li>
                <li>{language === 'en' ? 'Does not produce legally binding effects' : 'No produce efectos jurídicamente vinculantes'}</li>
                <li>{language === 'en' ? 'Uses only the data you explicitly provide for matching' : 'Usa solo los datos que proporcionas explícitamente para el matching'}</li>
              </ul>
            </section>

            {/* 8. Security */}
            <section>
              <h2>8. {language === 'en' ? 'Security Measures' : 'Medidas de Seguridad'}</h2>
              <p>
                {language === 'en'
                  ? 'We implement technical and organizational measures to protect your data:'
                  : 'Implementamos medidas técnicas y organizativas para proteger tus datos:'
                }
              </p>
              <ul>
                <li>{language === 'en' ? 'Encryption in transit (HTTPS/TLS)' : 'Cifrado en tránsito (HTTPS/TLS)'}</li>
                <li>{language === 'en' ? 'Encryption at rest for sensitive data' : 'Cifrado en reposo para datos sensibles'}</li>
                <li>{language === 'en' ? 'Secure password hashing (bcrypt)' : 'Hash seguro de contraseñas (bcrypt)'}</li>
                <li>{language === 'en' ? 'Row Level Security (RLS) in database' : 'Seguridad a nivel de fila (RLS) en base de datos'}</li>
                <li>{language === 'en' ? 'Regular security audits' : 'Auditorías de seguridad regulares'}</li>
              </ul>
              <p>
                <Link to="/legal/security" className="text-primary hover:underline">
                  {language === 'en' ? 'Read our full Security Policy →' : 'Lee nuestra Política de Seguridad completa →'}
                </Link>
              </p>
            </section>

            {/* 9. Updates */}
            <section>
              <h2>9. {language === 'en' ? 'Policy Updates' : 'Actualizaciones de la Política'}</h2>
              <p>
                {language === 'en'
                  ? 'We may update this policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or in-app notification.'
                  : 'Podemos actualizar esta política para reflejar cambios en nuestras prácticas o requisitos legales. Te notificaremos de cambios significativos por email o notificación en la app.'
                }
              </p>
            </section>

            {/* Links */}
            <section className="not-prose pt-6 border-t">
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/legal/cookies"
                  className="text-primary hover:underline"
                >
                  {language === 'en' ? 'Cookie Policy' : 'Política de Cookies'}
                </Link>
                <Link
                  to="/legal/terms"
                  className="text-primary hover:underline"
                >
                  {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
                </Link>
                <Link
                  to="/legal/security"
                  className="text-primary hover:underline"
                >
                  {language === 'en' ? 'Security Policy' : 'Política de Seguridad'}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;