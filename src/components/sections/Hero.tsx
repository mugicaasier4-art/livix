import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import heroImage from "@/assets/hero-students.jpg";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Track search event
    analytics.track('hero_search_used', {
      location,
      accommodationType
    });

    // Navigate to explore page with search parameters
    const params = new URLSearchParams();
    if (location.trim()) {
      params.set('location', location.trim());
    }
    if (accommodationType.trim()) {
      params.set('type', accommodationType.trim());
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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Estudiantes en apartamento compartido"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-system-blue/80" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="flex min-h-[600px] items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Tu próximo piso en Zaragoza
              <span className="block text-white/90"> está aquí</span>
            </h1>
            
            <p className="mt-6 text-lg text-white/90 md:text-xl">
              Pisos y habitaciones verificados para estudiantes universitarios. 
              Sin intermediarios, sin sorpresas.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-elevated md:flex-row">
              <div className="flex flex-1 items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Ej: Campus San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent text-base focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-1 items-center space-x-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Piso completo o habitación"
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent text-base focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="px-8" onClick={handleSearch}>
                Explorar pisos
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;