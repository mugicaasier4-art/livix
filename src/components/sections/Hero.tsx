import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, MapPin, ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";
import heroImage from "@/assets/hero-students.jpg";
import { useCity, useCityOrDefault } from "@/contexts/CityContext";
import { CITIES } from "@/data/cities";
import { cn } from "@/lib/utils";

const Hero = () => {
  const activeCity = useCityOrDefault();
  const { setCity } = useCity();
  const [accommodationType, setAccommodationType] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    analytics.track('hero_search_used', {
      city: activeCity.id,
      accommodationType
    });

    const params = new URLSearchParams();
    if (accommodationType) {
      params.set('type', accommodationType);
    }

    navigate(`/explore?${params.toString()}`);
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
                en {activeCity.name}, resuelto.
              </span>
            </h1>

            <p className="mt-4 md:mt-6 text-base text-white/90 md:text-xl">
              Pisos, habitaciones y residencias verificadas para estudiantes.
              <span className="block mt-1">Busca, compara y reserva tu alojamiento en {activeCity.name} online.</span>
            </p>

            {/* Search Bar */}
            <div className="mt-6 md:mt-8 rounded-2xl bg-background p-3 shadow-floating">
              {/* Mobile: stack vertical / Desktop: fila única */}
              <div className="flex flex-col md:flex-row md:items-center gap-2">

                {/* Ciudad — combobox con búsqueda */}
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-colors md:flex-1 md:min-w-0 w-full text-left",
                        "hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        cityOpen && "bg-muted/40"
                      )}
                      aria-expanded={cityOpen}
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide leading-none mb-1">Ciudad</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-foreground truncate">{activeCity.name}</span>
                          <ChevronsUpDown className="h-3 w-3 text-muted-foreground shrink-0 ml-auto" />
                        </div>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 shadow-lg" align="start" sideOffset={8}>
                    <Command>
                      <div className="flex items-center border-b px-3">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                        <CommandInput
                          placeholder="¿A qué ciudad te mudas?"
                          className="border-0 shadow-none focus-visible:ring-0 h-11 pl-0"
                        />
                      </div>
                      <CommandList className="max-h-60">
                        <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                          Todavía no estamos en esa ciudad.
                        </CommandEmpty>
                        <CommandGroup>
                          {CITIES.map((city) => (
                            <CommandItem
                              key={city.id}
                              value={`${city.name} ${city.region}`}
                              onSelect={() => {
                                setCity(city.id);
                                setCityOpen(false);
                              }}
                              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                            >
                              <span className="text-lg w-6 text-center shrink-0">{city.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-none">{city.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{city.region}</p>
                              </div>
                              {activeCity.id === city.id && (
                                <Check className="h-4 w-4 text-primary shrink-0" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Separador vertical (solo desktop) */}
                <div className="hidden md:block w-px h-10 bg-border shrink-0" />

                {/* Tipo de alojamiento */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/40 transition-colors md:flex-1 md:min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide leading-none mb-1">Tipo</p>
                    <Select value={accommodationType} onValueChange={setAccommodationType}>
                      <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-sm font-medium focus:ring-0 shadow-none w-full">
                        <SelectValue placeholder="Tipo de alojamiento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="habitacion">Habitación</SelectItem>
                        <SelectItem value="piso">Piso completo</SelectItem>
                        <SelectItem value="residencia">Residencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Botón buscar */}
                <Button size="lg" className="w-full md:w-auto px-8 glow-on-hover shrink-0" onClick={handleSearch}>
                  Buscar
                </Button>

              </div>
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
