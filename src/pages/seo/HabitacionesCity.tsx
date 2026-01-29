import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { cities } from "@/data/seo/cities";
import { getBarriosByCity } from "@/data/seo/barrios";
import ListingCard from "@/components/ui/listing-card";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";

const HabitacionesCity = () => {
    const { city } = useParams<{ city: string }>();
    const normalizedCity = city?.toLowerCase() || "";

    const cityData = cities[normalizedCity];

    // Fallback empty array if faqs undefined
    const faqs = cityData?.faqs || [];

    if (!cityData) {
        return <Navigate to="/404" replace />;
    }

    const { listings, isLoading } = useListings();
    const barrios = getBarriosByCity(normalizedCity);

    // Filter for habitaciones
    // Assuming 'room' or implicitly if not 'apartment' whole unit
    const filteredListings = listings.filter(
        l => l.city.toLowerCase() === normalizedCity &&
            (l.property_type === 'room' || l.title.toLowerCase().includes('habitación'))
    );

    const title = `Habitaciones en Alquiler en ${cityData.name} | Estudiantes | Livix`;
    const description = `Busca habitaciones para estudiantes en ${cityData.name}. Pisos compartidos cerca de tu universidad. Reserva segura y 100% online.`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description,
        "numberOfItems": filteredListings.length,
        "itemListElement": filteredListings.slice(0, 10).map((listing, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Accommodation",
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
                canonical={`https://livix.es/habitaciones/${normalizedCity}`}
                structuredData={structuredData}
                noIndex={!isLoading && filteredListings.length === 0}
            />

            <div className="container mx-auto px-4 py-8">
                <BreadcrumbSEO items={[
                    { label: 'Inicio', path: '/' },
                    { label: `Habitaciones en ${cityData.name}`, path: `/habitaciones/${normalizedCity}` }
                ]} />

                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-4">Habitaciones en Alquiler en {cityData.name}</h1>
                    <div
                        className="text-lg text-muted-foreground max-w-2xl prose prose-neutral dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: cityData.longDescription }}
                    />
                </header>

                {/* Barrios Links */}
                {barrios.length > 0 && (
                    <div className="mb-10">
                        <h3 className="font-semibold mb-4">Filtrar por barrio:</h3>
                        <div className="flex flex-wrap gap-2">
                            {barrios.map(barrio => (
                                <Link key={barrio.slug} to={`/habitaciones/${normalizedCity}/${barrio.slug}`}>
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
                        <h3 className="text-xl font-semibold mb-2">No hay habitaciones disponibles ahora mismo</h3>
                        <p className="text-muted-foreground mb-6">
                            Prueba a buscar en otras zonas o mira pisos completos para compartir.
                        </p>
                        <Link to={`/pisos/${normalizedCity}`}>
                            <Button>Ver Pisos Completos</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Cross-Linking Section */}
            <div className="bg-primary/5 py-12 mb-10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        A veces compartir piso no es para todos. Echa un vistazo a nuestra selección de residencias universitarias con servicios incluidos.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to={`/residencias/${normalizedCity}`}>
                            <Button variant="default" size="lg">Ver Residencias</Button>
                        </Link>
                        <Link to={`/pisos/${normalizedCity}`}>
                            <Button variant="outline" size="lg">Ver Pisos Completos</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* FAQs Section */}
            {faqs.length > 0 && (
                <div className="container mx-auto px-4 pb-16">
                    <section className="bg-muted/30 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes sobre Alquiler en {cityData.name}</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-background rounded-lg p-4 border shadow-sm">
                                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </Layout>
    );
};

export default HabitacionesCity;
