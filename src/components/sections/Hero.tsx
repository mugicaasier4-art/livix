import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import heroImage from "@/assets/hero-students.jpg";

interface HeroProps {
  city?: string;
}

const Hero = ({ city = "Zaragoza" }: HeroProps) => {
  const [location, setLocation] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    analytics.track('hero_search_used', {
      location,
      accommodationType
    });

    const params = new URLSearchParams();
    if (location.trim()) {
      params.set('location', location.trim());
    }
    if (accommodationType) {
      params.set('type', accommodationType);
    }

    navigate(`/explore?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-system-blue">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-system-blue/80 to-primary/70 animate-gradient" />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Estudiantes en apartamento compartido"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-system-blue/85 to-primary/75" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="flex min-h-[420px] md:min-h-[600px] items-center py-8 md:py-0">
          <div className="max-w-2xl">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="live-dot" aria-hidden="true" />
              <span className="text-sm text-white/90">
                <span className="sr-only">En vivo: </span>+50 pisos nuevos esta semana
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-6xl">
              Tu alojamiento universitario
              <span className="block text-white/90 mt-1 md:mt-2">
                en {city}, resuelto.
              </span>
            </h1>

            <p className="mt-4 md:mt-6 text-base text-white/90 md:text-xl">
              Pisos, habitaciones y residencias verificadas para estudiantes.
              <span className="block mt-1">Busca, compara y reserva tu alojamiento en {city} online.</span>
            </p>

            {/* Search Bar */}
            <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4 rounded-2xl bg-background p-4 md:p-6 shadow-floating md:flex-row">
              <div className="flex flex-1 items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <label htmlFor="hero-location" className="sr-only">Ubicación</label>
                <Input
                  id="hero-location"
                  placeholder="Ej: Delicias, Centro, Campus..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyPress}
                  enterKeyHint="search"
                  className="border-0 bg-transparent text-base focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-1 items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Search className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <label htmlFor="hero-type" className="sr-only">Tipo de alojamiento</label>
                <Select value={accommodationType} onValueChange={setAccommodationType}>
                  <SelectTrigger id="hero-type" className="border-0 bg-transparent text-base focus:ring-0 shadow-none">
                    <SelectValue placeholder="Tipo de alojamiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="habitacion">Habitación</SelectItem>
                    <SelectItem value="piso">Piso completo</SelectItem>
                    <SelectItem value="residencia">Residencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="w-full md:w-auto px-8 glow-on-hover" onClick={handleSearch}>
                Buscar alojamiento
              </Button>
            </div>

            {/* Social proof */}
            <p className="mt-4 text-sm text-white/70">
              Usado por estudiantes de Medicina, Derecho, Ingeniería y +20 facultades
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
