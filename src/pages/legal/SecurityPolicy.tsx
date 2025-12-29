import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import {
    Shield,
    Lock,
    Server,
    AlertTriangle,
    Clock,
    FileText,
    CheckCircle2,
    Globe
} from "lucide-react";

const Security = () => {
    const { language } = useI18n();

    useEffect(() => {
        analytics.track('legal_security_viewed');
    }, []);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="h-8 w-8 text-primary" />
                        <h1 className="mb-0">
                            {language === 'en' ? 'Security Policy' : 'Política de Seguridad'}
                        </h1>
                    </div>

                    <p className="text-muted-foreground mb-8">
                        {language === 'en'
                            ? 'Last updated: December 2024'
                            : 'Última actualización: Diciembre 2024'
                        }
                    </p>

                    <div className="space-y-8">
                        {/* Technical Measures */}
                        <section>
                            <h2 className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                1. {language === 'en' ? 'Technical Security Measures' : 'Medidas de Seguridad Técnicas'}
                            </h2>

                            <div className="not-prose grid gap-3 sm:grid-cols-2 mt-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Lock className="h-5 w-5 text-green-600" />
                                            <h4 className="font-medium">{language === 'en' ? 'Encryption in Transit' : 'Cifrado en Tránsito'}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'All data transmitted uses HTTPS/TLS 1.3'
                                                : 'Todos los datos transmitidos usan HTTPS/TLS 1.3'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Server className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-medium">{language === 'en' ? 'Encryption at Rest' : 'Cifrado en Reposo'}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'Sensitive data encrypted with AES-256'
                                                : 'Datos sensibles cifrados con AES-256'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Shield className="h-5 w-5 text-purple-600" />
                                            <h4 className="font-medium">{language === 'en' ? 'Password Security' : 'Seguridad de Contraseñas'}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'Passwords hashed with bcrypt (cost factor 10+)'
                                                : 'Contraseñas hasheadas con bcrypt (factor 10+)'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CheckCircle2 className="h-5 w-5 text-orange-600" />
                                            <h4 className="font-medium">{language === 'en' ? 'Row Level Security' : 'Seguridad a Nivel de Fila'}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'Database-level access control (RLS)'
                                                : 'Control de acceso a nivel de base de datos (RLS)'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Infrastructure */}
                        <section>
                            <h2 className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                2. {language === 'en' ? 'Infrastructure & DPA' : 'Infraestructura y DPA'}
                            </h2>
                            <p>
                                {language === 'en'
                                    ? 'Our infrastructure is hosted by Supabase, a SOC 2 Type II certified provider. Key details:'
                                    : 'Nuestra infraestructura está alojada en Supabase, un proveedor certificado SOC 2 Tipo II. Detalles clave:'
                                }
                            </p>
                            <ul>
                                <li>
                                    <strong>{language === 'en' ? 'Data Processing Agreement (DPA):' : 'Acuerdo de Procesamiento de Datos (DPA):'}</strong>{' '}
                                    {language === 'en'
                                        ? 'Signed with Supabase per GDPR Article 28'
                                        : 'Firmado con Supabase según el Artículo 28 del RGPD'
                                    }
                                </li>
                                <li>
                                    <strong>{language === 'en' ? 'Data Location:' : 'Ubicación de Datos:'}</strong>{' '}
                                    {language === 'en'
                                        ? 'European Union (eu-west region)'
                                        : 'Unión Europea (región eu-west)'
                                    }
                                </li>
                                <li>
                                    <strong>{language === 'en' ? 'Certifications:' : 'Certificaciones:'}</strong>{' '}
                                    SOC 2 Type II, ISO 27001
                                </li>
                                <li>
                                    <strong>{language === 'en' ? 'Backups:' : 'Copias de Seguridad:'}</strong>{' '}
                                    {language === 'en'
                                        ? 'Daily automated backups with 7-day retention'
                                        : 'Copias automáticas diarias con retención de 7 días'
                                    }
                                </li>
                            </ul>
                        </section>

                        {/* Breach Protocol */}
                        <section>
                            <h2 className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                3. {language === 'en' ? 'Security Breach Protocol' : 'Protocolo de Brechas de Seguridad'}
                            </h2>
                            <p>
                                {language === 'en'
                                    ? 'In the event of a security breach affecting personal data, we follow this protocol:'
                                    : 'En caso de una brecha de seguridad que afecte datos personales, seguimos este protocolo:'
                                }
                            </p>

                            <div className="not-prose mt-4">
                                <div className="relative pl-8 border-l-2 border-primary/30 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                            <span className="text-[10px] text-white font-bold">1</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">
                                                    {language === 'en' ? 'Immediate Response (0-24h)' : 'Respuesta Inmediata (0-24h)'}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {language === 'en'
                                                        ? 'Contain the breach, assess scope, preserve evidence'
                                                        : 'Contener la brecha, evaluar alcance, preservar evidencias'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                            <span className="text-[10px] text-white font-bold">2</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">
                                                    {language === 'en' ? 'Authority Notification (72h)' : 'Notificación a Autoridades (72h)'}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {language === 'en'
                                                        ? 'Notify AEPD within 72 hours per GDPR Article 33'
                                                        : 'Notificar a la AEPD en 72 horas según Artículo 33 del RGPD'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                            <span className="text-[10px] text-white font-bold">3</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">
                                                    {language === 'en' ? 'User Notification' : 'Notificación a Usuarios'}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {language === 'en'
                                                        ? 'If high risk, notify affected users directly per GDPR Article 34'
                                                        : 'Si existe alto riesgo, notificar a usuarios afectados según Artículo 34 del RGPD'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                            <span className="text-[10px] text-white font-bold">4</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">
                                                    {language === 'en' ? 'Remediation & Documentation' : 'Remediación y Documentación'}
                                                </h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {language === 'en'
                                                        ? 'Implement fixes, document incident, conduct post-mortem'
                                                        : 'Implementar correcciones, documentar incidente, realizar post-mortem'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Reporting */}
                        <section>
                            <h2>4. {language === 'en' ? 'Report a Vulnerability' : 'Reportar una Vulnerabilidad'}</h2>
                            <p>
                                {language === 'en'
                                    ? 'If you discover a security vulnerability, please report it responsibly to:'
                                    : 'Si descubres una vulnerabilidad de seguridad, por favor repórtala de forma responsable a:'
                                }
                            </p>
                            <p>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:security@livix.app" className="text-primary hover:underline">
                                    security@livix.app
                                </a>
                            </p>
                            <p>
                                {language === 'en'
                                    ? 'We appreciate responsible disclosure and will acknowledge your report within 48 hours.'
                                    : 'Agradecemos la divulgación responsable y responderemos a tu reporte en 48 horas.'
                                }
                            </p>
                        </section>

                        {/* DPO Information */}
                        <section>
                            <h2>5. {language === 'en' ? 'Data Protection Officer' : 'Delegado de Protección de Datos'}</h2>
                            <p>
                                {language === 'en'
                                    ? 'For data protection inquiries, contact our DPO:'
                                    : 'Para consultas sobre protección de datos, contacta a nuestro DPO:'
                                }
                            </p>
                            <p>
                                <strong>Email:</strong>{' '}
                                <a href="mailto:dpo@livix.app" className="text-primary hover:underline">
                                    dpo@livix.app
                                </a>
                            </p>
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
                                    to="/legal/terms"
                                    className="text-primary hover:underline"
                                >
                                    {language === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Security;
