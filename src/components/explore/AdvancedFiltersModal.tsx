import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Wifi,
  Wind,
  Flame,
  Building,
  Bed,
  Bath,
  Armchair,
  Lock,
  Sun,
  Users,
  PawPrint,
  Cigarette,
  Heart,
  Utensils,
  Sparkles,
  Phone,
  Dumbbell,
  Waves,
  Film,
  BookOpen,
  Gamepad2,
  TreePine,
  X,
} from 'lucide-react';
import { PropertyFilter } from './PropertyTypeFilter';
import { Filters } from './FiltersSheet';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  propertyFilter: PropertyFilter;
  resultsCount: number;
}

// Icon mapping for amenities
const amenityIcons: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'WiFi 5G': Wifi,
  'Aire acondicionado': Wind,
  'Calefacción': Flame,
  'Ascensor': Building,
  'Escritorio': Armchair,
  'Cerradura': Lock,
  'Ventana': Sun,
  'Parking': Building,
  'Lavadora': Sparkles,
};

const AdvancedFiltersModal = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  propertyFilter,
  resultsCount,
}: AdvancedFiltersModalProps) => {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: [200, 800],
      bedrooms: null,
      bathrooms: null,
      propertyType: [],
      neighborhoods: [],
      erasmusFriendly: false,
      allInclusive: false,
      furnished: false,
      englishContract: false,
      flexibleDeposit: false,
      verifiedOnly: false,
      duration: 'all',
      roommates: null,
      amenities: [],
      faculty: '',
      maxDistance: 30,
      allowsPets: false,
      minRating: null,
      smokingAllowed: false,
      genderPreference: 'any',
    });
  };

  const showApartmentFilters = propertyFilter === 'all' || propertyFilter === 'pisos';
  const showResidenceFilters = propertyFilter === 'all' || propertyFilter === 'residencias';

  // Amenity chip component
  const AmenityChip = ({ 
    label, 
    icon: Icon, 
    selected, 
    onClick 
  }: { 
    label: string; 
    icon?: React.ElementType; 
    selected: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border hover:border-primary/50"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Filtros avanzados</DialogTitle>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Limpiar todo
          </Button>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-8 py-6">
            {/* COMMON FILTERS */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                ✨ Filtros básicos
              </h3>
              
              {/* Price with histogram placeholder */}
              <div className="space-y-4">
                <Label className="font-medium">Precio mensual</Label>
                <div className="px-2">
                  <div className="flex justify-between text-sm font-semibold text-[hsl(210,100%,50%)] mb-3">
                    <span className="bg-[hsl(210,100%,95%)] px-3 py-1 rounded-md">{filters.priceRange[0]}€</span>
                    <span className="bg-[hsl(210,100%,95%)] px-3 py-1 rounded-md">{filters.priceRange[1]}€</span>
                  </div>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                    min={150}
                    max={2000}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>150€</span>
                    <span>2000€</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Basic amenities */}
              <div className="space-y-3">
                <Label className="font-medium">Comodidades básicas</Label>
                <div className="flex flex-wrap gap-2">
                  <AmenityChip
                    label="WiFi"
                    icon={Wifi}
                    selected={filters.amenities.includes('WiFi')}
                    onClick={() => toggleAmenity('WiFi')}
                  />
                  <AmenityChip
                    label="Aire acondicionado"
                    icon={Wind}
                    selected={filters.amenities.includes('Aire acondicionado')}
                    onClick={() => toggleAmenity('Aire acondicionado')}
                  />
                  <AmenityChip
                    label="Calefacción"
                    icon={Flame}
                    selected={filters.amenities.includes('Calefacción')}
                    onClick={() => toggleAmenity('Calefacción')}
                  />
                  <AmenityChip
                    label="Ascensor"
                    icon={Building}
                    selected={filters.amenities.includes('Ascensor')}
                    onClick={() => toggleAmenity('Ascensor')}
                  />
                </div>
              </div>
            </section>

            {/* APARTMENT SPECIFIC FILTERS */}
            {showApartmentFilters && (
              <>
                <Separator />
                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🛏️ La Habitación
                  </h3>
                  
                  {/* Bed type */}
                  <div className="space-y-3 mb-6">
                    <Label className="font-medium">Tipo de cama</Label>
                    <div className="flex gap-2">
                      <AmenityChip
                        label="Individual"
                        icon={Bed}
                        selected={filters.amenities.includes('Cama individual')}
                        onClick={() => toggleAmenity('Cama individual')}
                      />
                      <AmenityChip
                        label="Doble"
                        icon={Bed}
                        selected={filters.amenities.includes('Cama doble')}
                        onClick={() => toggleAmenity('Cama doble')}
                      />
                    </div>
                  </div>

                  {/* Bathroom */}
                  <div className="space-y-3 mb-6">
                    <Label className="font-medium">Baño</Label>
                    <div className="flex gap-2">
                      <AmenityChip
                        label="Privado (Ensuite)"
                        icon={Bath}
                        selected={filters.amenities.includes('Baño privado')}
                        onClick={() => toggleAmenity('Baño privado')}
                      />
                      <AmenityChip
                        label="Compartido"
                        icon={Bath}
                        selected={filters.amenities.includes('Baño compartido')}
                        onClick={() => toggleAmenity('Baño compartido')}
                      />
                    </div>
                  </div>

                  {/* Room equipment */}
                  <div className="space-y-3">
                    <Label className="font-medium">Equipamiento</Label>
                    <div className="flex flex-wrap gap-2">
                      <AmenityChip
                        label="Escritorio"
                        icon={Armchair}
                        selected={filters.amenities.includes('Escritorio')}
                        onClick={() => toggleAmenity('Escritorio')}
                      />
                      <AmenityChip
                        label="Armario empotrado"
                        icon={Building}
                        selected={filters.amenities.includes('Armario')}
                        onClick={() => toggleAmenity('Armario')}
                      />
                      <AmenityChip
                        label="Cerradura"
                        icon={Lock}
                        selected={filters.amenities.includes('Cerradura')}
                        onClick={() => toggleAmenity('Cerradura')}
                      />
                      <AmenityChip
                        label="Ventana exterior"
                        icon={Sun}
                        selected={filters.amenities.includes('Ventana exterior')}
                        onClick={() => toggleAmenity('Ventana exterior')}
                      />
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🏠 Condiciones y Convivencia
                  </h3>
                  
                  {/* Gender preference */}
                  <div className="space-y-3 mb-6">
                    <Label className="font-medium">Género del piso</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'any', label: 'Mixto' },
                        { value: 'female', label: 'Solo chicas' },
                        { value: 'male', label: 'Solo chicos' },
                      ].map((option) => (
                        <Badge
                          key={option.value}
                          variant={filters.genderPreference === option.value ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2"
                          onClick={() => handleFilterChange('genderPreference', option.value)}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* House rules */}
                  <div className="space-y-4">
                    <Label className="font-medium">Reglas</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PawPrint className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Mascotas OK</span>
                        </div>
                        <Switch
                          checked={filters.allowsPets}
                          onCheckedChange={(checked) => handleFilterChange('allowsPets', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cigarette className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Fumadores OK</span>
                        </div>
                        <Switch
                          checked={filters.smokingAllowed}
                          onCheckedChange={(checked) => handleFilterChange('smokingAllowed', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Parejas OK</span>
                        </div>
                        <Switch
                          checked={filters.amenities.includes('Parejas OK')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              toggleAmenity('Parejas OK');
                            } else {
                              handleFilterChange('amenities', filters.amenities.filter(a => a !== 'Parejas OK'));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Expenses included */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Gastos incluidos</Label>
                      <p className="text-xs text-muted-foreground">Luz, agua, gas incluidos en el precio</p>
                    </div>
                    <Switch
                      checked={filters.allInclusive}
                      onCheckedChange={(checked) => handleFilterChange('allInclusive', checked)}
                    />
                  </div>
                </section>
              </>
            )}

            {/* RESIDENCE SPECIFIC FILTERS */}
            {showResidenceFilters && (
              <>
                <Separator />
                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🍽️ Régimen y Comidas
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <Label className="font-medium">Plan de comidas</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'solo_alojamiento', label: 'Solo alojamiento', icon: Building },
                        { value: 'cocina', label: 'Cocina compartida', icon: Utensils },
                        { value: 'media', label: 'Media pensión', icon: Utensils },
                        { value: 'completa', label: 'Pensión completa', icon: Utensils },
                      ].map((option) => (
                        <AmenityChip
                          key={option.value}
                          label={option.label}
                          icon={option.icon}
                          selected={filters.amenities.includes(option.value)}
                          onClick={() => toggleAmenity(option.value)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    <Label className="font-medium">Servicios</Label>
                    <div className="flex flex-wrap gap-2">
                      <AmenityChip
                        label="Limpieza de habitación"
                        icon={Sparkles}
                        selected={filters.amenities.includes('Limpieza')}
                        onClick={() => toggleAmenity('Limpieza')}
                      />
                      <AmenityChip
                        label="Cambio de sábanas"
                        icon={Bed}
                        selected={filters.amenities.includes('Sábanas')}
                        onClick={() => toggleAmenity('Sábanas')}
                      />
                      <AmenityChip
                        label="Recepción 24h"
                        icon={Phone}
                        selected={filters.amenities.includes('Recepción 24h')}
                        onClick={() => toggleAmenity('Recepción 24h')}
                      />
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🏆 Instalaciones Top
                  </h3>
                  
                  <div className="space-y-3">
                    <Label className="font-medium">Lifestyle</Label>
                    <div className="flex flex-wrap gap-2">
                      <AmenityChip
                        label="Gimnasio"
                        icon={Dumbbell}
                        selected={filters.amenities.includes('Gimnasio')}
                        onClick={() => toggleAmenity('Gimnasio')}
                      />
                      <AmenityChip
                        label="Piscina"
                        icon={Waves}
                        selected={filters.amenities.includes('Piscina')}
                        onClick={() => toggleAmenity('Piscina')}
                      />
                      <AmenityChip
                        label="Sala de cine"
                        icon={Film}
                        selected={filters.amenities.includes('Cine')}
                        onClick={() => toggleAmenity('Cine')}
                      />
                      <AmenityChip
                        label="Biblioteca"
                        icon={BookOpen}
                        selected={filters.amenities.includes('Biblioteca')}
                        onClick={() => toggleAmenity('Biblioteca')}
                      />
                      <AmenityChip
                        label="Sala de juegos"
                        icon={Gamepad2}
                        selected={filters.amenities.includes('Sala de juegos')}
                        onClick={() => toggleAmenity('Sala de juegos')}
                      />
                      <AmenityChip
                        label="Terraza/Rooftop"
                        icon={TreePine}
                        selected={filters.amenities.includes('Terraza')}
                        onClick={() => toggleAmenity('Terraza')}
                      />
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer with results count */}
        <div className="p-6 pt-0 border-t">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            size="lg"
          >
            Ver {resultsCount} propiedades
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFiltersModal;
