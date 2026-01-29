import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import {
  FileText,
  Users,
  Shield,
  CreditCard,
  Home,
  MessageSquare,
  AlertTriangle,
  Scale,
  Ban,
  HelpCircle
} from "lucide-react";

const Terms = () => {
  const { language } = useI18n();

  useEffect(() => {
    analytics.track('legal_terms_viewed');
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="mb-0">
              {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
            </h1>
          </div>

          <p className="text-muted-foreground mb-8">
            {language === 'en'
              ? 'Last updated: January 2025'
              : 'Última actualización: Enero 2025'
            }
          </p>

          <div className="space-y-8">
            {/* 1. Introduction */}
            <section>
              <h2 className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. {language === 'en' ? 'Introduction' : 'Introducción'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Welcome to Livix. These Terms of Service ("Terms") govern your access to and use of the Livix platform, website, and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.'
                  : 'Bienvenido a Livix. Estos Términos de Servicio ("Términos") regulan tu acceso y uso de la plataforma Livix, sitio web y servicios (colectivamente, el "Servicio"). Al acceder o usar nuestro Servicio, aceptas quedar vinculado por estos Términos.'
                }
              </p>
              <p>
                {language === 'en'
                  ? 'Livix is a technology platform that connects students seeking accommodation with property owners and other students looking for roommates in Spain. We are not a real estate agency, property manager, or party to any rental agreement between users.'
                  : 'Livix es una plataforma tecnológica que conecta estudiantes que buscan alojamiento con propietarios de inmuebles y otros estudiantes que buscan compañeros de piso en España. No somos una agencia inmobiliaria, gestora de propiedades, ni parte de ningún contrato de alquiler entre usuarios.'
                }
              </p>
            </section>

            {/* 2. Definitions */}
            <section>
              <h2>2. {language === 'en' ? 'Definitions' : 'Definiciones'}</h2>
              <div className="not-prose mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="font-medium">{language === 'en' ? '"User"' : '"Usuario"'}</dt>
                        <dd className="text-muted-foreground ml-4">
                          {language === 'en'
                            ? 'Any person who accesses or uses the Service, including Students and Landlords.'
                            : 'Cualquier persona que accede o usa el Servicio, incluyendo Estudiantes y Propietarios.'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{language === 'en' ? '"Student"' : '"Estudiante"'}</dt>
                        <dd className="text-muted-foreground ml-4">
                          {language === 'en'
                            ? 'A user seeking accommodation or roommates through the platform.'
                            : 'Un usuario que busca alojamiento o compañeros de piso a través de la plataforma.'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{language === 'en' ? '"Landlord"' : '"Propietario"'}</dt>
                        <dd className="text-muted-foreground ml-4">
                          {language === 'en'
                            ? 'A user who offers accommodation for rent through the platform.'
                            : 'Un usuario que ofrece alojamiento en alquiler a través de la plataforma.'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{language === 'en' ? '"Listing"' : '"Anuncio"'}</dt>
                        <dd className="text-muted-foreground ml-4">
                          {language === 'en'
                            ? 'A property advertisement published on the platform by a Landlord.'
                            : 'Un anuncio de propiedad publicado en la plataforma por un Propietario.'
                          }
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium">{language === 'en' ? '"Reservation"' : '"Reserva"'}</dt>
                        <dd className="text-muted-foreground ml-4">
                          {language === 'en'
                            ? 'A booking request made by a Student for a Listing, subject to Landlord approval.'
                            : 'Una solicitud de reserva realizada por un Estudiante para un Anuncio, sujeta a aprobación del Propietario.'
                          }
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 3. Eligibility */}
            <section>
              <h2 className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. {language === 'en' ? 'Eligibility and Account Registration' : 'Elegibilidad y Registro de Cuenta'}
              </h2>
              <p>
                {language === 'en'
                  ? 'To use Livix, you must:'
                  : 'Para usar Livix, debes:'
                }
              </p>
              <ul>
                <li>
                  {language === 'en'
                    ? 'Be at least 18 years old, or have parental/guardian consent if you are between 16-18 years old'
                    : 'Tener al menos 18 años, o contar con el consentimiento de tus padres/tutores si tienes entre 16-18 años'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Provide accurate, current, and complete information during registration'
                    : 'Proporcionar información precisa, actualizada y completa durante el registro'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Maintain the security of your account credentials'
                    : 'Mantener la seguridad de tus credenciales de cuenta'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Notify us immediately of any unauthorized access to your account'
                    : 'Notificarnos inmediatamente de cualquier acceso no autorizado a tu cuenta'
                  }
                </li>
              </ul>
              <p>
                {language === 'en'
                  ? 'You are responsible for all activities that occur under your account. One person may not maintain multiple accounts.'
                  : 'Eres responsable de todas las actividades que ocurran bajo tu cuenta. Una persona no puede mantener múltiples cuentas.'
                }
              </p>
            </section>

            {/* 4. Platform Usage */}
            <section>
              <h2 className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                4. {language === 'en' ? 'Acceptable Use' : 'Uso Aceptable'}
              </h2>
              <p>
                {language === 'en'
                  ? 'When using Livix, you agree to:'
                  : 'Al usar Livix, aceptas:'
                }
              </p>
              <ul>
                <li>{language === 'en' ? 'Use the Service only for lawful purposes' : 'Usar el Servicio solo para fines legales'}</li>
                <li>{language === 'en' ? 'Provide truthful information in profiles and listings' : 'Proporcionar información veraz en perfiles y anuncios'}</li>
                <li>{language === 'en' ? 'Respect other users and communicate professionally' : 'Respetar a otros usuarios y comunicarte profesionalmente'}</li>
                <li>{language === 'en' ? 'Not discriminate based on race, gender, religion, nationality, disability, or sexual orientation' : 'No discriminar por raza, género, religión, nacionalidad, discapacidad u orientación sexual'}</li>
              </ul>
            </section>

            {/* 5. Prohibited Activities */}
            <section>
              <h2 className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                5. {language === 'en' ? 'Prohibited Activities' : 'Actividades Prohibidas'}
              </h2>
              <p>
                {language === 'en'
                  ? 'The following activities are strictly prohibited:'
                  : 'Las siguientes actividades están estrictamente prohibidas:'
                }
              </p>
              <div className="not-prose grid gap-3 sm:grid-cols-2 mt-4">
                <Card className="border-destructive/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-sm">{language === 'en' ? 'Fraud & Scams' : 'Fraude y Estafas'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'en'
                        ? 'Fake listings, phishing, payment fraud, or any deceptive practices'
                        : 'Anuncios falsos, phishing, fraude de pago o cualquier práctica engañosa'
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-destructive/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-sm">{language === 'en' ? 'Harassment' : 'Acoso'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'en'
                        ? 'Threats, bullying, hate speech, or unwanted contact'
                        : 'Amenazas, bullying, discurso de odio o contacto no deseado'
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-destructive/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-sm">{language === 'en' ? 'Spam' : 'Spam'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'en'
                        ? 'Unsolicited messages, duplicate listings, or automated abuse'
                        : 'Mensajes no solicitados, anuncios duplicados o abuso automatizado'
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-destructive/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-sm">{language === 'en' ? 'Impersonation' : 'Suplantación'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === 'en'
                        ? 'Pretending to be another person or entity'
                        : 'Hacerse pasar por otra persona o entidad'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 6. Listings */}
            <section>
              <h2 className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                6. {language === 'en' ? 'Listings and Properties' : 'Anuncios y Propiedades'}
              </h2>
              <h3>{language === 'en' ? 'For Landlords:' : 'Para Propietarios:'}</h3>
              <ul>
                <li>
                  {language === 'en'
                    ? 'You must have the legal right to rent the property'
                    : 'Debes tener el derecho legal de alquilar la propiedad'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Listings must accurately represent the property with current photos and descriptions'
                    : 'Los anuncios deben representar con precisión la propiedad con fotos y descripciones actuales'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Prices must be transparent and include all mandatory fees'
                    : 'Los precios deben ser transparentes e incluir todas las tarifas obligatorias'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Properties must comply with local housing regulations and safety standards'
                    : 'Las propiedades deben cumplir con las normativas locales de vivienda y estándares de seguridad'
                  }
                </li>
              </ul>
              <h3>{language === 'en' ? 'For Students:' : 'Para Estudiantes:'}</h3>
              <ul>
                <li>
                  {language === 'en'
                    ? 'Verify property details before making any commitments'
                    : 'Verifica los detalles de la propiedad antes de hacer cualquier compromiso'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'We recommend visiting properties in person when possible'
                    : 'Recomendamos visitar las propiedades en persona cuando sea posible'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Never make payments outside the platform during the reservation process'
                    : 'Nunca realices pagos fuera de la plataforma durante el proceso de reserva'
                  }
                </li>
              </ul>
            </section>

            {/* 7. Payments */}
            <section>
              <h2 className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                7. {language === 'en' ? 'Payments and Fees' : 'Pagos y Tarifas'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Livix may facilitate payments between Students and Landlords through secure third-party payment processors. By using our payment features:'
                  : 'Livix puede facilitar pagos entre Estudiantes y Propietarios a través de procesadores de pago de terceros seguros. Al usar nuestras funciones de pago:'
                }
              </p>
              <ul>
                <li>
                  {language === 'en'
                    ? 'You agree to the terms of our payment processor (Stripe)'
                    : 'Aceptas los términos de nuestro procesador de pagos (Stripe)'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Service fees may apply and will be clearly disclosed before payment'
                    : 'Pueden aplicarse tarifas de servicio que se mostrarán claramente antes del pago'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Refund policies are subject to individual listing terms and our cancellation policy'
                    : 'Las políticas de reembolso están sujetas a los términos individuales del anuncio y nuestra política de cancelación'
                  }
                </li>
              </ul>
              <p>
                {language === 'en'
                  ? 'Livix is not responsible for disputes between users regarding rent payments made outside the platform.'
                  : 'Livix no es responsable de disputas entre usuarios respecto a pagos de alquiler realizados fuera de la plataforma.'
                }
              </p>
            </section>

            {/* 8. Roommate Matching */}
            <section>
              <h2 className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                8. {language === 'en' ? 'Roommate Matching' : 'Búsqueda de Compañeros de Piso'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Our roommate matching feature uses algorithmic profiling to suggest compatible students based on preferences you provide. By using this feature:'
                  : 'Nuestra función de búsqueda de compañeros de piso utiliza profiling algorítmico para sugerir estudiantes compatibles basándose en las preferencias que proporciones. Al usar esta función:'
                }
              </p>
              <ul>
                <li>
                  {language === 'en'
                    ? 'You provide explicit consent for profiling as described in our Privacy Policy'
                    : 'Proporcionas consentimiento explícito para el profiling según se describe en nuestra Política de Privacidad'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'Match suggestions are recommendations only - you decide who to contact'
                    : 'Las sugerencias de compatibilidad son solo recomendaciones - tú decides a quién contactar'
                  }
                </li>
                <li>
                  {language === 'en'
                    ? 'We are not responsible for the outcome of any roommate arrangements'
                    : 'No somos responsables del resultado de ningún acuerdo entre compañeros de piso'
                  }
                </li>
              </ul>
            </section>

            {/* 9. Communication */}
            <section>
              <h2 className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                9. {language === 'en' ? 'Communication' : 'Comunicación'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Livix provides in-platform messaging to facilitate communication between users. Messages may be monitored for safety and compliance purposes. By using our messaging features, you agree to:'
                  : 'Livix proporciona mensajería dentro de la plataforma para facilitar la comunicación entre usuarios. Los mensajes pueden ser monitoreados por motivos de seguridad y cumplimiento. Al usar nuestras funciones de mensajería, aceptas:'
                }
              </p>
              <ul>
                <li>{language === 'en' ? 'Communicate respectfully and professionally' : 'Comunicarte de forma respetuosa y profesional'}</li>
                <li>{language === 'en' ? 'Not share personal contact information in initial messages' : 'No compartir información de contacto personal en mensajes iniciales'}</li>
                <li>{language === 'en' ? 'Report suspicious or inappropriate communications' : 'Reportar comunicaciones sospechosas o inapropiadas'}</li>
              </ul>
            </section>

            {/* 10. Intellectual Property */}
            <section>
              <h2>10. {language === 'en' ? 'Intellectual Property' : 'Propiedad Intelectual'}</h2>
              <p>
                {language === 'en'
                  ? 'The Livix platform, including its design, features, and content (excluding user-generated content), is protected by intellectual property rights owned by Livix Technologies S.L.'
                  : 'La plataforma Livix, incluyendo su diseño, funcionalidades y contenido (excluyendo contenido generado por usuarios), está protegida por derechos de propiedad intelectual pertenecientes a Livix Technologies S.L.'
                }
              </p>
              <p>
                {language === 'en'
                  ? 'By posting content on Livix, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with the Service.'
                  : 'Al publicar contenido en Livix, nos otorgas una licencia no exclusiva, mundial y libre de regalías para usar, mostrar y distribuir ese contenido en relación con el Servicio.'
                }
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section>
              <h2 className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                11. {language === 'en' ? 'Limitation of Liability' : 'Limitación de Responsabilidad'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Livix acts as an intermediary platform connecting users. We do not:'
                  : 'Livix actúa como una plataforma intermediaria que conecta usuarios. No:'
                }
              </p>
              <ul>
                <li>{language === 'en' ? 'Own, manage, or control any listed properties' : 'Poseemos, gestionamos o controlamos ninguna propiedad anunciada'}</li>
                <li>{language === 'en' ? 'Guarantee the accuracy of user-provided information' : 'Garantizamos la precisión de la información proporcionada por usuarios'}</li>
                <li>{language === 'en' ? 'Become party to any rental agreement between users' : 'Nos convertimos en parte de ningún contrato de alquiler entre usuarios'}</li>
                <li>{language === 'en' ? 'Assume liability for disputes between users' : 'Asumimos responsabilidad por disputas entre usuarios'}</li>
              </ul>
              <p>
                {language === 'en'
                  ? 'To the maximum extent permitted by law, Livix shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.'
                  : 'En la máxima medida permitida por la ley, Livix no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo derivado de tu uso del Servicio.'
                }
              </p>
            </section>

            {/* 12. Account Termination */}
            <section>
              <h2>12. {language === 'en' ? 'Account Termination' : 'Terminación de Cuenta'}</h2>
              <p>
                {language === 'en'
                  ? 'You may delete your account at any time through your account settings. We reserve the right to suspend or terminate accounts that:'
                  : 'Puedes eliminar tu cuenta en cualquier momento a través de la configuración de tu cuenta. Nos reservamos el derecho de suspender o terminar cuentas que:'
                }
              </p>
              <ul>
                <li>{language === 'en' ? 'Violate these Terms of Service' : 'Violen estos Términos de Servicio'}</li>
                <li>{language === 'en' ? 'Engage in fraudulent or illegal activities' : 'Participen en actividades fraudulentas o ilegales'}</li>
                <li>{language === 'en' ? 'Harm other users or the platform' : 'Perjudiquen a otros usuarios o a la plataforma'}</li>
                <li>{language === 'en' ? 'Remain inactive for an extended period' : 'Permanezcan inactivas por un período prolongado'}</li>
              </ul>
            </section>

            {/* 13. Changes to Terms */}
            <section>
              <h2>13. {language === 'en' ? 'Changes to Terms' : 'Cambios en los Términos'}</h2>
              <p>
                {language === 'en'
                  ? 'We may update these Terms from time to time. We will notify you of significant changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance of the new Terms.'
                  : 'Podemos actualizar estos Términos ocasionalmente. Te notificaremos de cambios significativos por email o notificación en la app. El uso continuado del Servicio después de los cambios constituye aceptación de los nuevos Términos.'
                }
              </p>
            </section>

            {/* 14. Applicable Law */}
            <section>
              <h2 className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                14. {language === 'en' ? 'Applicable Law and Jurisdiction' : 'Ley Aplicable y Jurisdicción'}
              </h2>
              <p>
                {language === 'en'
                  ? 'These Terms are governed by Spanish law. Any disputes shall be submitted to the courts of the city where Livix Technologies S.L. has its registered office, unless otherwise required by mandatory consumer protection laws.'
                  : 'Estos Términos se rigen por la ley española. Cualquier disputa será sometida a los tribunales de la ciudad donde Livix Technologies S.L. tenga su domicilio social, salvo que las leyes de protección al consumidor exijan lo contrario.'
                }
              </p>
            </section>

            {/* 15. Contact */}
            <section>
              <h2 className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                15. {language === 'en' ? 'Contact' : 'Contacto'}
              </h2>
              <p>
                {language === 'en'
                  ? 'For questions about these Terms or the Service, please contact us:'
                  : 'Para preguntas sobre estos Términos o el Servicio, por favor contáctanos:'
                }
              </p>
              <div className="not-prose">
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[80px]">{language === 'en' ? 'Company:' : 'Empresa:'}</dt>
                        <dd>Livix Technologies S.L.</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="font-medium min-w-[80px]">Email:</dt>
                        <dd>
                          <a href="mailto:info@livix.es" className="text-primary hover:underline">
                            info@livix.es
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Links */}
            <section className="not-prose pt-6 border-t">
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/legal/privacy"
                  className="text-primary hover:underline"
                >
                  {language === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
                </Link>
                <Link
                  to="/legal/cookies"
                  className="text-primary hover:underline"
                >
                  {language === 'en' ? 'Cookie Policy' : 'Política de Cookies'}
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

export default Terms;