import ListingCard from "@/components/ui/listing-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import apartment1 from "@/assets/apartment-1.jpg";
import apartment2 from "@/assets/apartment-2.jpg";
import apartment3 from "@/assets/apartment-3.jpg";

const FeaturedListings = () => {
  const listings = [
    {
      id: 1,
      image: apartment1,
      title: "Habitación luminosa cerca de Universidad de Zaragoza",
      location: "Centro, Zaragoza",
      price: 350,
      roommates: 2,
      distance: "5 min caminando",
      verified: true,
      amenities: ["WiFi", "Cocina", "Lavadora", "Calefacción"]
    },
    {
      id: 2,
      image: apartment2,
      title: "Piso compartido con terraza",
      location: "Delicias, Zaragoza", 
      price: 280,
      roommates: 3,
      distance: "10 min en bus",
      verified: true,
      amenities: ["Terraza", "WiFi", "Parking", "Aire acondicionado"]
    },
    {
      id: 3,
      image: apartment3,
      title: "Habitación individual con escritorio",
      location: "Universidad, Zaragoza",
      price: 400,
      roommates: 1,
      distance: "2 min caminando",
      verified: true,
      amenities: ["Escritorio", "WiFi", "Cocina", "Silencioso"]
    }
  ];

  return (
    <section className="py-16 bg-surface-elevated">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Pisos disponibles ahora
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Verificados y listos para entrar. Publicados esta semana.
          </p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0">
          {listings.map((listing) => (
            <div key={listing.id} className="min-w-[85%] snap-start md:min-w-0">
              <ListingCard {...listing} />
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/explore">
            <Button size="lg" variant="outline" className="group">
              Ver todos los pisos
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;