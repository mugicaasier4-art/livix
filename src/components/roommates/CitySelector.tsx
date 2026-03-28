import { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCitiesList,
  getUniversitiesByCity,
  type University,
} from "@/data/spanishUniversities";

interface CitySelectorProps {
  selectedCity: string;
  selectedUniversity: string;
  onCityChange: (city: string) => void;
  onUniversityChange: (university: string) => void;
  className?: string;
}

const CitySelector = ({
  selectedCity,
  selectedUniversity,
  onCityChange,
  onUniversityChange,
  className = "",
}: CitySelectorProps) => {
  const cities = useMemo(() => getCitiesList(), []);

  const universities: University[] = useMemo(
    () => (selectedCity ? getUniversitiesByCity(selectedCity) : []),
    [selectedCity]
  );

  const handleCityChange = useCallback(
    (city: string) => {
      onCityChange(city);
      onUniversityChange("");
    },
    [onCityChange, onUniversityChange]
  );

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}
    >
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona tu ciudad" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedUniversity}
        onValueChange={onUniversityChange}
        disabled={!selectedCity}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona tu universidad" />
        </SelectTrigger>
        <SelectContent>
          {universities.map((uni) => (
            <SelectItem key={uni.shortName} value={uni.shortName}>
              {uni.shortName} — {uni.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
