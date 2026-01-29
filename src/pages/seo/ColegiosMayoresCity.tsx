import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { colegiosMayores } from "@/data/seo/colegiosMayores";
import { cities } from "@/data/seo/cities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Users, CheckCircle } from "lucide-react";

const ColegiosMayoresCity = () => {
    const { city } = useParams<{ city: string }>();
    const normalizedCity = city?.toLowerCase() || "";
    const cityData = cities[normalizedCity];

    if (!cityData) {
        return <Navigate to="/404" replace />;
    }

    const colegios = Object.values(colegiosMayores).filter(c => c.city === normalizedCity);

    const title = `Colegios Mayores en ${cityData.name} | Mejores Opciones | Livix`;
    const description = `Lista de los mejores Colegios Mayores en ${cityData.name}. Compara precios, instalaciones y ambiente. Encuentra tu plaza para el próximo curso.`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description,
        "numberOfItems": colegios.length,
        "itemListElement": colegios.map((cm, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "CollegeOrUniversity",
                "name": cm.name,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": cm.city,
                    "streetAddress": cm.address
                }
            }
        }))
    };

    return (
        <Layout>
            <SEOHead
                title={title}
                description={description}
                canonical={`https://livix.es/colegios-mayores/${normalizedCity}`}
                structuredData={structuredData}
            />

            <div className="container mx-auto px-4 py-8">
                <BreadcrumbSEO items={[
                    { label: 'Inicio', path: '/' },
                    { label: `Colegios Mayores en ${cityData.name}`, path: `/colegios-mayores/${normalizedCity}` }
                ]} />

                <header className="mb-10 text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Colegios Mayores Universitarios en {cityData.name}</h1>
                    <p className="text-lg text-muted-foreground">
                        Una opción clásica para vivir la experiencia universitaria al máximo.
                        Descubre los colegios mayores más destacados de {cityData.name}.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {colegios.map((cm) => (
                        <Card key={cm.slug} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs px-2 py-1 rounded-full ${cm.type === 'Mixto' ? 'bg-purple-100 text-purple-700' :
                                        cm.type === 'Femenino' ? 'bg-pink-100 text-pink-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {cm.type}
                                    </span>
                                </div>
                                <CardTitle className="text-xl mt-2">{cm.name}</CardTitle>
                            </CardHeader>
                            <CardContent >
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>{cm.address}</span>
                                    </div>

                                    <p className="text-sm text-foreground/80">
                                        {cm.description}
                                    </p>

                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" /> Instalaciones
                                        </h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            {cm.facilities.slice(0, 3).map((f, i) => (
                                                <li key={i}>• {f}</li>
                                            ))}
                                            {cm.facilities.length > 3 && (
                                                <li className="text-xs italic">+ {cm.facilities.length - 3} más</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {colegios.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No hay información disponible de Colegios Mayores en esta ciudad todavía.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ColegiosMayoresCity;
