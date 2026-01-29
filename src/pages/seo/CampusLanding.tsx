import { useParams, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSEO } from "@/components/seo/BreadcrumbSEO";
import { campuses } from "@/data/seo/campus";
import { getBarrio } from "@/data/seo/barrios";
import ListingCard from "@/components/ui/listing-card";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { MapPin, Bus } from "lucide-react";

const CampusLanding = () => {
    const { campus } = useParams<{ campus: string }>();

    const campusData = campuses[campus || ""];

    if (!campusData) {
        return <Navigate to="/404" replace />;
    }

    const { listings, isLoading } = useListings();

    // Filter listings in nearby barrios
    // We match listing address or description against nearby barrio names
    const nearbyBarrioNames = campusData.nearbyBarrios.map(slug => getBarrio(slug)?.name || slug);

    const filteredListings = listings.filter(l => {
        if (l.city.toLowerCase() !== campusData.city) return false;

        // Check if listing is in one of the nearby barrios
        // Helper to check text presence
        const textToCheck = (l.address + " " + l.description).toLowerCase();
        return nearbyBarrioNames.some(name => textToCheck.includes(name.toLowerCase())) ||
            campusData.nearbyBarrios.some(slug => textToCheck.includes(slug));
    });

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": campusData.h1,
        "description": campusData.metaDescription,
        "numberOfItems": filteredListings.length,
        "itemListElement": filteredListings.slice(0, 10).map((listing, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Accommodation",
                "name": listing.title,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": campusData.city,
                    "streetAddress": listing.address
                }
            }
        }))
    };

    return (
        <Layout>
            <SEOHead
                title={campusData.title}
                description={campusData.metaDescription}
                canonical={`https://livix.es/campus/${campus}`}
                structuredData={structuredData}
            />

            <div className="container mx-auto px-4 py-8">
                <BreadcrumbSEO items={[
                    { label: 'Inicio', path: '/' },
                    { label: campusData.name, path: `/campus/${campus}` }
                ]} />

                <div className="bg-primary/5 rounded-2xl p-8 mb-10">
                    <h1 className="text-3xl font-bold mb-4">{campusData.h1}</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        {campusData.introText}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-3">
                                <MapPin className="h-5 w-5 text-primary" /> Barrios Recomendados
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {campusData.nearbyBarrios.map(slug => {
                                    const b = getBarrio(slug);
                                    return b ? (
                                        <Link key={slug} to={`/habitaciones/${campusData.city}/${slug}`}>
                                            <span className="px-3 py-1 bg-white border rounded-full text-sm hover:border-primary transition-colors cursor-pointer">
                                                {b.name}
                                            </span>
                                        </Link>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-3">
                                <Bus className="h-5 w-5 text-primary" /> Cómo llegar
                            </h3>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                {campusData.transport.map((t, i) => (
                                    <li key={i}>• {t}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">
                    Alojamientos cerca del {campusData.name}
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
                    <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <h3 className="text-xl font-semibold mb-2">No encontramos alojamientos exactos por descripción</h3>
                        <p className="text-muted-foreground mb-6">
                            Te recomendamos buscar por barrios cercanos directamente.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {campusData.nearbyBarrios.map(slug => {
                                const b = getBarrio(slug);
                                return b ? (
                                    <Link key={slug} to={`/habitaciones/${campusData.city}/${slug}`}>
                                        <Button variant="outline">{b.name}</Button>
                                    </Link>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CampusLanding;
