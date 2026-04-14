import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { City, CITIES, DEFAULT_CITY_ID, getCityById } from "@/data/cities";
import { analytics } from "@/utils/analytics";

const STORAGE_KEY = "livix_selected_city";

interface CityContextType {
  selectedCity: City | null;      // null = usuario no ha elegido ciudad todavía
  setCity: (cityId: string) => void;
  clearCity: () => void;          // para poder cambiar de ciudad
  hasSelectedCity: boolean;       // true cuando ya eligió
}

const CityContext = createContext<CityContextType | null>(null);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(() => {
    // Inicializar desde localStorage al montar
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return getCityById(stored) ?? null;
    } catch {
      // localStorage puede no estar disponible (SSR, incógnito estricto)
    }
    return null;
  });

  const setCity = useCallback((cityId: string) => {
    const city = getCityById(cityId);
    if (!city) return;
    setSelectedCity(city);
    analytics.track('city_selected', { city_id: cityId, city_name: city.name });
    try {
      localStorage.setItem(STORAGE_KEY, cityId);
    } catch {
      // silencioso
    }
  }, []);

  const clearCity = useCallback(() => {
    setSelectedCity(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // silencioso
    }
  }, []);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setCity,
        clearCity,
        hasSelectedCity: selectedCity !== null,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity debe usarse dentro de <CityProvider>");
  return ctx;
};

// Devuelve la ciudad seleccionada o Zaragoza como fallback (nunca null)
export const useCityOrDefault = (): City => {
  const { selectedCity } = useCity();
  return selectedCity ?? (getCityById(DEFAULT_CITY_ID) as City);
};
