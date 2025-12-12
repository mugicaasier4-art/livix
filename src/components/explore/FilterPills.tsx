import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface FilterState {
  priceRange: [number, number];
  verified: boolean;
  amenities: string[];
  roommates: string[];
  distance: number;
}

interface FilterPillsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const FilterPills = ({ filters, onFiltersChange }: FilterPillsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickFilters = [
    { key: 'verified', label: 'Verificado', active: filters.verified },
    { key: 'wifi', label: 'WiFi', active: filters.amenities.includes('WiFi') },
    { key: 'parking', label: 'Parking', active: filters.amenities.includes('Parking') },
    { key: 'terrace', label: 'Terraza', active: filters.amenities.includes('Terraza') },
    { key: 'kitchen', label: 'Cocina', active: filters.amenities.includes('Cocina') },
    { key: 'laundry', label: 'Lavadora', active: filters.amenities.includes('Lavadora') },
  ];

  const amenityOptions = [
    'WiFi', 'Parking', 'Terraza', 'Cocina', 'Lavadora', 'Aire acondicionado',
    'Calefacción', 'Ascensor', 'Jardín', 'Piscina', 'Gimnasio', 'Estudio'
  ];

  const roommateOptions = [
    '0 (Solo)', '1 compañero', '2 compañeros', '3 compañeros', '4+ compañeros'
  ];

  const toggleQuickFilter = (key: string) => {
    if (key === 'verified') {
      onFiltersChange({ ...filters, verified: !filters.verified });
    } else {
      const amenities = filters.amenities.includes(key)
        ? filters.amenities.filter(a => a !== key)
        : [...filters.amenities, key];
      onFiltersChange({ ...filters, amenities });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [200, 800],
      verified: false,
      amenities: [],
      roommates: [],
      distance: 30
    });
  };

  const hasActiveFilters = filters.verified || 
    filters.amenities.length > 0 || 
    filters.roommates.length > 0 ||
    filters.priceRange[0] !== 200 ||
    filters.priceRange[1] !== 800 ||
    filters.distance !== 30;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Quick Filter Pills */}
      {quickFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant={filter.active ? "default" : "outline"}
          className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
          onClick={() => toggleQuickFilter(filter.key)}
        >
          {filter.label}
          {filter.active && <X className="ml-1 h-3 w-3" />}
        </Badge>
      ))}

      {/* Advanced Filters Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Más filtros
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros avanzados</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Precio mensual: €{filters.priceRange[0]} - €{filters.priceRange[1]}
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, priceRange: value as [number, number] })
                }
                min={100}
                max={1000}
                step={50}
                className="py-4"
              />
            </div>

            {/* Distance */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Distancia máxima: {filters.distance} min
              </Label>
              <Slider
                value={[filters.distance]}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, distance: value[0] })
                }
                min={5}
                max={60}
                step={5}
                className="py-4"
              />
            </div>

            {/* Roommates */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Compañeros de piso</Label>
              <div className="space-y-2">
                {roommateOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={filters.roommates.includes(option)}
                      onCheckedChange={(checked) => {
                        const roommates = checked
                          ? [...filters.roommates, option]
                          : filters.roommates.filter(r => r !== option);
                        onFiltersChange({ ...filters, roommates });
                      }}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Comodidades</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const amenities = checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter(a => a !== amenity);
                        onFiltersChange({ ...filters, amenities });
                      }}
                    />
                    <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="w-full"
              >
                Limpiar todos los filtros
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Clear All Badge */}
      {hasActiveFilters && (
        <Badge
          variant="secondary"
          className="cursor-pointer"
          onClick={clearAllFilters}
        >
          Limpiar todo <X className="ml-1 h-3 w-3" />
        </Badge>
      )}
    </div>
  );
};

export default FilterPills;