import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { BarrioContent } from "@/components/seo/BarrioContent";
import { getBarrio, getBarriosByCity } from "@/data/seo/barrios";
import ListingCard from "@/components/ui/listing-card";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";

const PisosBarrio = () => {
    const { city, barrio } = useParams<{ city: string; barrio: string }>();

    const barrioData = getBarrio(barrio || "");
    const normalizedCity = city?.toLowerCase() || "";

    if (!barrioData || barrioData.city !== normalizedCity) {
        return <Navigate to="/404" replace />;
    }

    const { listings, isLoading } = useListings();

    // Filter listings by barrio for pisos
    const filteredListings = listings.filter(
        l => l.city.toLowerCase() === normalizedCity &&
            (l.property_type === 'apartment' || l.title.toLowerCase().includes('piso') || l.title.toLowerCase().includes('apartamento')) &&
            !l.title.toLowerCase().includes('habitación') &&
            (l.address.toLowerCase().includes(barrioData.name.toLowerCase()) ||
                l.address.toLowerCase().includes(barrioData.slug))
    );

    const title = `Pisos en ${barrioData.name}, ${city?.charAt(0).toUpperCase()}${city?.slice(1)} | Livix`;
    const description = `Alquiler de pisos para estudiantes en ${barrioData.name}. ${barrioData.metaDescription}`;

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
                "@type": "Apartment",
                "name": listing.title,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Zaragoza",
                    "streetAddress": listing.address
                }
            }
        }))
    };

    const otherBarrios = getBarriosByCity(normalizedCity).filter(b => b.slug !== barrio);

    return (
        <Layout>
            <SEOHead
                title={title}
                description={description}
                canonical={`https://livix.es/pisos/${normalizedCity}/${barrio}`}
                structuredData={structuredData}
            />

            <div className="container mx-auto px-4 py-8">
                <BreadcrumbSEO items={[
                    { label: 'Inicio', path: '/' },
                    {
                        label: `Pisos en ${normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1)}`,
                        path: `/pisos/${normalizedCity}`
                    },
                    { label: barrioData.name, path: `/pisos/${normalizedCity}/${barrio}` }
                ]} />

                <BarrioContent barrio={barrioData} />

                <h2 className="text-xl font-semibold mb-6">
                    {filteredListings.length} pisos disponibles en {barrioData.name}
                </h2>

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
                    <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                        <p>No hay pisos completos disponibles en {barrioData.name} ahora mismo.</p>
                        <p className="mt-2">
                            <Link to={`/pisos/${normalizedCity}`} className="text-primary hover:underline font-medium">
                                Ver todos los pisos en {normalizedCity}
                            </Link>
                        </p>
                    </div>
                )}

                {otherBarrios.length > 0 && (
                    <div className="mt-16 pt-8 border-t">
                        <h3 className="font-semibold mb-4">Otros barrios cercanos</h3>
                        <div className="flex flex-wrap gap-2">
                            {otherBarrios.map(b => (
                                <Link
                                    key={b.slug}
                                    to={`/pisos/${normalizedCity}/${b.slug}`}
                                >
                                    <Button variant="ghost" size="sm">
                                        {b.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PisosBarrio;
