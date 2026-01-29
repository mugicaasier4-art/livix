import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { cities } from "@/data/seo/cities";
import ListingCard from "@/components/ui/listing-card";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";

const ResidenciasCity = () => {
    const { city } = useParams<{ city: string }>();
    const normalizedCity = city?.toLowerCase() || "";

    const cityData = cities[normalizedCity];

    // If city data doesn't exist, redirect to 404 (or handle gracefully)
    if (!cityData) {
        return <Navigate to="/404" replace />;
    }

    const { listings, isLoading } = useListings();

    // Filter for residencias in this city
    const residencias = listings.filter(
        l => l.city.toLowerCase() === normalizedCity &&
            (l.property_type === 'residencia' || l.title.toLowerCase().includes('residencia'))
    );

    const title = `Residencias de Estudiantes en ${cityData.name} | Livix`;
    const description = `Mejores residencias universitarias en ${cityData.name}. Compara precios, servicios y ubicación. Reserva online sin comisiones.`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description,
        "numberOfItems": residencias.length,
        "itemListElement": residencias.slice(0, 10).map((listing, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Residence",
                "name": listing.title,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": cityData.name,
                    "addressCountry": "ES"
                }
            }
        }))
    };

    return (
        <Layout>
            <SEOHead
                title={title}
                description={description}
                canonical={`https://livix.es/residencias/${normalizedCity}`}
                structuredData={structuredData}
                noIndex={!isLoading && residencias.length === 0}
            />

            <div className="container mx-auto px-4 py-8">
                <BreadcrumbSEO items={[
                    { label: 'Inicio', path: '/' },
                    { label: `Residencias en ${cityData.name}`, path: `/residencias/${normalizedCity}` }
                ]} />

                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-4">Residencias de Estudiantes en {cityData.name}</h1>
                    <div
                        className="text-lg text-muted-foreground max-w-2xl prose prose-neutral dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: cityData.longDescription }}
                    />
                </header>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-[400px] bg-muted animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : residencias.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {residencias.map(listing => (
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
                        <h3 className="text-xl font-semibold mb-2">No hemos encontrado residencias disponibles</h3>
                        <p className="text-muted-foreground mb-6">
                            Actualmente no tenemos residencias disponibles en {cityData.name}, pero puedes ver otras opciones.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to={`/habitaciones/${normalizedCity}`}>
                                <Button variant="default">Ver Habitaciones</Button>
                            </Link>
                            <Link to={`/pisos/${normalizedCity}`}>
                                <Button variant="outline">Ver Pisos Completos</Button>
                            </Link>
                        </div>
                    </div>
                )}

                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Universidades en {cityData.name}</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {cityData.universities.map((uni, i) => (
                            <div key={i} className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                <span className="font-medium">{uni}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQs Section */}
                {cityData.faqs.length > 0 && (
                    <section className="mt-16 bg-muted/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes sobre Residencias en {cityData.name}</h2>
                        <div className="space-y-4">
                            {cityData.faqs.map((faq, index) => (
                                <div key={index} className="bg-background rounded-lg p-4 border shadow-sm">
                                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {/* Cross-Linking Section */}
                <div className="bg-primary/5 py-12 my-10 rounded-xl">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">¿Prefieres más independencia?</h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Las residencias ofrecen comodidad, pero si buscas más libertad, un piso compartido puede ser tu opción ideal.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to={`/habitaciones/${normalizedCity}`}>
                                <Button variant="default" size="lg">Ver Habitaciones</Button>
                            </Link>
                            <Link to={`/colegios-mayores/${normalizedCity}`}>
                                <Button variant="outline" size="lg">Ver Colegios Mayores</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ResidenciasCity;
