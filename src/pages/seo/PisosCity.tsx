import { useParams, Navigate, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { cities } from "@/data/seo/cities";
import { getBarriosByCity } from "@/data/seo/barrios";
import ListingCard from "@/components/ui/listing-card";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";

const PisosCity = () => {
    const { city } = useParams<{ city: string }>();
    const normalizedCity = city?.toLowerCase() || "";

    const cityData = cities[normalizedCity];

    if (!cityData) {
        return <Navigate to="/404" replace />;
    }

    const { listings, isLoading } = useListings();
    const barrios = getBarriosByCity(normalizedCity);

    // Filter for pisos (apartments)
    const filteredListings = listings.filter(
        l => l.city.toLowerCase() === normalizedCity &&
            (l.property_type === 'apartment' || l.title.toLowerCase().includes('piso') || l.title.toLowerCase().includes('apartamento')) &&
            !l.title.toLowerCase().includes('habitación')
    );

    const title = `Alquiler de Pisos en ${cityData.name} para Estudiantes | Livix`;
    const description = `Pisos para estudiantes en ${cityData.name}. Encuentra tu piso compartido ideal cerca de la universidad. Alquiler seguro y sin sorpresas.`;

    const faqs = cityData.faqsPisos || cityData.faqs || [];

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description,
        "numberOfItems": filteredListings.length,
        "itemListElement": filteredListings.slice(0, 10).map((listing, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Apartment",
                "name": listing.title,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": cityData.name,
                    "addressCountry": "ES"
                }
            }
        }))
    };

    const faqSchema = faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    const structuredData = faqSchema ? [itemListSchema, faqSchema] : itemListSchema;

    return (
        <Layout>
            <SEOHead
                title={title}
                description={description}
                canonical={`https://livix.es/pisos/${normalizedCity}`}
                structuredData={structuredData}
            />

            <div className="container mx-auto px-4 py-8">
                <BreadcrumbSEO items={[
                    { label: 'Inicio', path: '/' },
                    { label: 'Pisos', path: '/pisos' },
                    { label: `Pisos en ${cityData.name}`, path: `/pisos/${normalizedCity}` }
                ]} />

                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-4">Alquiler de Pisos para Estudiantes en {cityData.name}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {cityData.introText} Alquila un piso completo para compartir con tus amigos.
                    </p>
                    {cityData.longDescription && (
                        <div
                            className="mt-6 text-muted-foreground max-w-3xl prose prose-neutral dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cityData.longDescription) }}
                        />
                    )}
                </header>

                {/* Barrios Links */}
                {barrios.length > 0 && (
                    <div className="mb-10">
                        <h3 className="font-semibold mb-4">Filtrar por barrio:</h3>
                        <div className="flex flex-wrap gap-2">
                            {barrios.map(barrio => (
                                <Link key={barrio.slug} to={`/pisos/${normalizedCity}/${barrio.slug}`}>
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        {barrio.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-[400px] bg-muted animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : filteredListings.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredListings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                id={listing.id}
                                image={listing.images[0] || "/assets/placeholder.jpg"}
                                title={listing.title}
                                location={listing.address}
                                price={listing.price}
                                roommates={listing.max_occupants || undefined}
                                amenities={[
                                    listing.has_wifi ? "WiFi" : null,
                                    listing.has_ac ? "AC" : null,
                                    listing.has_heating ? "Calefacción" : null
                                ].filter(Boolean) as string[]}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <h3 className="text-xl font-semibold mb-2">No hay pisos completos disponibles</h3>
                        <p className="text-muted-foreground mb-6">
                            Quizás prefieras buscar una habitación individual en un piso compartido.
                        </p>
                        <Link to={`/habitaciones/${normalizedCity}`}>
                            <Button>Ver Habitaciones</Button>
                        </Link>
                    </div>
                )}

                {/* FAQs Section */}
                {faqs.length > 0 && (
                    <section className="mt-12 bg-muted/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes sobre pisos en {cityData.name}</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-background rounded-lg p-4 border shadow-sm">
                                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cross-Linking Section */}
                <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Otras opciones de alojamiento en {cityData.name}</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link to={`/habitaciones/${normalizedCity}`} className="text-primary hover:underline">
                            Habitaciones en {cityData.name}
                        </Link>
                        <span className="text-muted-foreground">&bull;</span>
                        <Link to={`/residencias/${normalizedCity}`} className="text-primary hover:underline">
                            Residencias en {cityData.name}
                        </Link>
                        <span className="text-muted-foreground">&bull;</span>
                        <Link to={`/colegios-mayores/${normalizedCity}`} className="text-primary hover:underline">
                            Colegios Mayores en {cityData.name}
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PisosCity;
