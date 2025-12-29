import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { analytics } from "@/utils/analytics";
import { Cookie, Shield, BarChart3, Megaphone, Settings } from "lucide-react";

interface CookieInfo {
    name: string;
    provider: string;
    purpose: string;
    duration: string;
    type: "essential" | "analytics" | "marketing";
}

const cookies: CookieInfo[] = [
    {
        name: "sb-*-auth-token",
        provider: "Supabase",
        purpose: "Mantiene tu sesión iniciada de forma segura",
        duration: "1 año",
        type: "essential"
    },
    {
        name: "cr_consent",
        provider: "Livix",
        purpose: "Guarda tus preferencias de cookies",
        duration: "1 año",
        type: "essential"
    },
    {
        name: "livix_lang",
        provider: "Livix",
        purpose: "Recuerda tu preferencia de idioma",
        duration: "1 año",
        type: "essential"
    },
    {
        name: "livix_theme",
        provider: "Livix",
        purpose: "Recuerda tu preferencia de tema (claro/oscuro)",
        duration: "1 año",
        type: "essential"
    },
    {
        name: "livix_analytics",
        provider: "Livix",
        purpose: "Recopila estadísticas anónimas de uso para mejorar la plataforma",
        duration: "1 año",
        type: "analytics"
    }
];

const Cookies = () => {
    const { language } = useI18n();

    useEffect(() => {
        analytics.track('legal_cookies_viewed');
    }, []);

    const getCookieTypeIcon = (type: CookieInfo["type"]) => {
        switch (type) {
            case "essential":
                return <Shield className="h-4 w-4 text-green-600" />;
            case "analytics":
                return <BarChart3 className="h-4 w-4 text-blue-600" />;
            case "marketing":
                return <Megaphone className="h-4 w-4 text-purple-600" />;
        }
    };

    const getCookieTypeName = (type: CookieInfo["type"]) => {
        switch (type) {
            case "essential":
                return language === 'en' ? "Essential" : "Esencial";
            case "analytics":
                return language === 'en' ? "Analytics" : "Analítica";
            case "marketing":
                return language === 'en' ? "Marketing" : "Marketing";
        }
    };

    const openCookieSettings = () => {
        // Clear consent to show the banner again
        localStorage.removeItem('cr_consent');
        window.location.reload();
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <div className="flex items-center gap-3 mb-6">
                        <Cookie className="h-8 w-8 text-primary" />
                        <h1 className="mb-0">
                            {language === 'en' ? 'Cookie Policy' : 'Política de Cookies'}
                        </h1>
                    </div>

                    <p className="text-muted-foreground mb-8">
                        {language === 'en'
                            ? 'Last updated: December 2024'
                            : 'Última actualización: Diciembre 2024'
                        }
                    </p>

                    <div className="space-y-8">
                        {/* Introduction */}
                        <section>
                            <h2>1. {language === 'en' ? 'What are cookies?' : '¿Qué son las cookies?'}</h2>
                            <p>
                                {language === 'en'
                                    ? 'Cookies are small text files that websites store on your device to remember your preferences and improve your browsing experience. They help us understand how you use Livix so we can make it better for you.'
                                    : 'Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar tus preferencias y mejorar tu experiencia de navegación. Nos ayudan a entender cómo usas Livix para poder mejorarlo para ti.'
                                }
                            </p>
                        </section>

                        {/* Types of cookies */}
                        <section>
                            <h2>2. {language === 'en' ? 'Types of cookies we use' : 'Tipos de cookies que utilizamos'}</h2>

                            <div className="grid gap-4 not-prose mt-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-green-600" />
                                            {language === 'en' ? 'Essential Cookies' : 'Cookies Esenciales'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'Required for the website to function. They enable basic features like page navigation and secure login. You cannot disable these cookies.'
                                                : 'Necesarias para que el sitio web funcione. Permiten funcionalidades básicas como la navegación y el inicio de sesión seguro. No puedes desactivar estas cookies.'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <BarChart3 className="h-5 w-5 text-blue-600" />
                                            {language === 'en' ? 'Analytics Cookies' : 'Cookies Analíticas'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'Help us understand how visitors interact with our website. All data is anonymized and used only to improve our services.'
                                                : 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web. Todos los datos son anónimos y se usan solo para mejorar nuestros servicios.'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Megaphone className="h-5 w-5 text-purple-600" />
                                            {language === 'en' ? 'Marketing Cookies' : 'Cookies de Marketing'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {language === 'en'
                                                ? 'Used to show you relevant ads based on your interests. Currently, we do not use marketing cookies.'
                                                : 'Se utilizan para mostrarte anuncios relevantes según tus intereses. Actualmente, no utilizamos cookies de marketing.'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Cookie table */}
                        <section>
                            <h2>3. {language === 'en' ? 'Cookies in detail' : 'Cookies en detalle'}</h2>

                            <div className="not-prose overflow-x-auto mt-4">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left p-3 font-medium">
                                                {language === 'en' ? 'Name' : 'Nombre'}
                                            </th>
                                            <th className="text-left p-3 font-medium">
                                                {language === 'en' ? 'Provider' : 'Proveedor'}
                                            </th>
                                            <th className="text-left p-3 font-medium">
                                                {language === 'en' ? 'Purpose' : 'Finalidad'}
                                            </th>
                                            <th className="text-left p-3 font-medium">
                                                {language === 'en' ? 'Duration' : 'Duración'}
                                            </th>
                                            <th className="text-left p-3 font-medium">
                                                {language === 'en' ? 'Type' : 'Tipo'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cookies.map((cookie, index) => (
                                            <tr key={cookie.name} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                                <td className="p-3 font-mono text-xs">{cookie.name}</td>
                                                <td className="p-3">{cookie.provider}</td>
                                                <td className="p-3">{cookie.purpose}</td>
                                                <td className="p-3">{cookie.duration}</td>
                                                <td className="p-3">
                                                    <span className="flex items-center gap-1.5">
                                                        {getCookieTypeIcon(cookie.type)}
                                                        {getCookieTypeName(cookie.type)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Manage cookies */}
                        <section>
                            <h2>4. {language === 'en' ? 'How to manage cookies' : 'Cómo gestionar las cookies'}</h2>
                            <p>
                                {language === 'en'
                                    ? 'You can change your cookie preferences at any time using the button below. You can also configure cookies in your browser settings.'
                                    : 'Puedes cambiar tus preferencias de cookies en cualquier momento usando el botón de abajo. También puedes configurar las cookies en los ajustes de tu navegador.'
                                }
                            </p>

                            <div className="not-prose mt-4">
                                <Button onClick={openCookieSettings} variant="outline" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    {language === 'en' ? 'Manage Cookie Preferences' : 'Gestionar Preferencias de Cookies'}
                                </Button>
                            </div>

                            <h3 className="mt-6">{language === 'en' ? 'Browser settings' : 'Configuración del navegador'}</h3>
                            <p>
                                {language === 'en'
                                    ? 'Most browsers allow you to control cookies through their settings. Here are links to instructions for the most popular browsers:'
                                    : 'La mayoría de los navegadores permiten controlar las cookies a través de sus ajustes. Aquí tienes enlaces a las instrucciones para los navegadores más populares:'
                                }
                            </p>
                            <ul>
                                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
                                <li><a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Firefox</a></li>
                                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
                                <li><a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
                            </ul>
                        </section>

                        {/* Contact */}
                        <section>
                            <h2>5. {language === 'en' ? 'Contact' : 'Contacto'}</h2>
                            <p>
                                {language === 'en'
                                    ? 'If you have questions about our use of cookies, please contact us at:'
                                    : 'Si tienes preguntas sobre nuestro uso de cookies, por favor contáctanos en:'
                                }
                            </p>
                            <p>
                                <strong>Email:</strong> privacy@livix.app
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

export default Cookies;
