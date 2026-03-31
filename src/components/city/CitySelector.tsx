import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ChevronRight, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CITIES, findCityByName, City } from "@/data/cities";
import { useCity } from "@/contexts/CityContext";
import { cn } from "@/lib/utils";
import livixLogo from "@/assets/livix-logo.png";

interface CitySelectorProps {
  onClose?: () => void; // si se pasa, es modo "cambiar ciudad" desde el header
}

const CitySelector = ({ onClose }: CitySelectorProps) => {
  const { setCity } = useCity();
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Filtrar ciudades disponibles según el query
  const filteredCities = useMemo(() => {
    if (!query.trim()) return CITIES;
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return CITIES.filter(c => {
      const name = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const region = c.region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return name.includes(q) || region.includes(q);
    });
  }, [query]);

  // Detectar si el usuario escribe una ciudad no disponible
  useEffect(() => {
    if (!query.trim()) {
      setNotFound(false);
      return;
    }
    const timer = setTimeout(() => {
      setNotFound(filteredCities.length === 0);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, filteredCities]);

  const handleSelect = (city: City) => {
    setCity(city.id);
    onClose?.();
  };

  const isChangingMode = !!onClose; // true = modal de cambio de ciudad desde header

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-background px-4 pt-16 pb-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <span className="font-poppins font-bold text-4xl text-primary">LIVIX</span>
        <p className="mt-2 text-muted-foreground text-base">
          {isChangingMode
            ? "Cambia tu ciudad"
            : "¿En qué ciudad buscas alojamiento?"}
        </p>
      </motion.div>

      {/* Buscador */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-lg mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            autoFocus
            placeholder="Busca tu ciudad..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-10 h-12 text-base rounded-xl border-border focus-visible:ring-primary"
          />
        </div>

        {/* Ciudad no encontrada */}
        <AnimatePresence>
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3"
            >
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Todavía no estamos en esa ciudad
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Estamos creciendo. Elige una ciudad disponible y te avisamos cuando lleguemos a la tuya.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Grid de ciudades */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full max-w-lg"
      >
        {!notFound && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredCities.map((city, i) => (
                <motion.button
                  key={city.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  onClick={() => handleSelect(city)}
                  className={cn(
                    "group flex flex-col items-start gap-1 rounded-xl border border-border bg-card",
                    "px-4 py-3 text-left hover:border-primary hover:bg-primary/5",
                    "transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                >
                  <span className="text-2xl">{city.emoji}</span>
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                    {city.name}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-2 leading-tight">
                    {city.description}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredCities.length === 0 && !notFound && null}
      </motion.div>

      {/* Botón cancelar — solo en modo cambio de ciudad */}
      {isChangingMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// Overlay a pantalla completa — se muestra cuando no hay ciudad seleccionada
export const CitySelectorOverlay = () => {
  const { hasSelectedCity } = useCity();

  if (hasSelectedCity) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-background overflow-y-auto"
    >
      <CitySelector />
    </motion.div>
  );
};

export default CitySelector;
