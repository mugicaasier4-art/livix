import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import heroImage from "@/assets/hero-students.jpg";

const rotatingTexts = [
  "Tu próximo piso",
  "Tu futuro roommate",
  "Tu comunidad universitaria"
];

const Hero = () => {
  const [location, setLocation] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Rotating text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsAnimating(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    analytics.track('hero_search_used', {
      location,
      accommodationType
    });

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
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-system-blue/80 to-primary/70 animate-gradient" />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Estudiantes en apartamento compartido"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-system-blue/85 to-primary/75" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="flex min-h-[600px] items-center">
          <div className="max-w-2xl">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="live-dot" />
              <span className="text-sm text-white/90">+50 pisos nuevos esta semana</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              <span
                className={`inline-block transition-all duration-300 ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
              >
                {rotatingTexts[currentTextIndex]}
              </span>
              <span className="block text-white/90 mt-2">
                en Zaragoza <Sparkles className="inline h-8 w-8 md:h-10 md:w-10 animate-pulse-soft" />
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/90 md:text-xl">
              Pisos y habitaciones verificados para estudiantes universitarios.
              Sin intermediarios, sin sorpresas.
            </p>

            {/* Search Bar - Enhanced */}
            <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-floating md:flex-row scale-on-hover">
              <div className="flex flex-1 items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <Input
                  placeholder="Ej: Campus San Francisco"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent text-base focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-1 items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <Input
                  placeholder="Piso completo o habitación"
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent text-base focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="px-8 glow-on-hover" onClick={handleSearch}>
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