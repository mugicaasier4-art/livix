import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/contexts/I18nContext';
import { analytics } from '@/utils/analytics';

export interface Filters {
  priceRange: [number, number];
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string[];
  neighborhoods: string[];
  erasmusFriendly: boolean;
  allInclusive: boolean;
  furnished: boolean;
  englishContract: boolean;
  flexibleDeposit: boolean;
  verifiedOnly: boolean;
  duration: string;
  roommates: number | null;
  amenities: string[];
  faculty: string;
  maxDistance: number;
  allowsPets: boolean;
  minRating: number | null;
  smokingAllowed: boolean;
  genderPreference: string;
}

interface FiltersSheetProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FiltersSheet: React.FC<FiltersSheetProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onOpenChange,
}) => {
  const { t } = useI18n();

  const availableAmenities = [
    'WiFi', 'Cocina', 'Lavadora', 'Calefacción', 'Aire acondicionado',
    'Terraza', 'Parking', 'Ascensor', 'Escritorio', 'Baño privado'
  ];

  const faculties = [
    { value: 'all', label: 'Todas las facultades' },
    { value: 'filosofia', label: 'Filosofía y Letras' },
    { value: 'derecho', label: 'Derecho' },
    { value: 'ciencias', label: 'Ciencias' },
    { value: 'rio-ebro', label: 'Campus Río Ebro' },
    { value: 'economia', label: 'Económicas' },
  ];

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
    analytics.trackSearchFilterApplied(key, value);
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    handleFilterChange('amenities', newAmenities);
  };

  const clearAllFilters = () => {
    const clearedFilters: Filters = {
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
      genderPreference: 'any'
    };
    onFiltersChange(clearedFilters);
  };

  const applyErasmusPreset = () => {
    const erasmusFilters: Filters = {
      ...filters,
      erasmusFriendly: true,
      allInclusive: true,
      furnished: true,
      englishContract: true,
      duration: '4-6 meses',
    };
    onFiltersChange(erasmusFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{t('explore.filters')}</SheetTitle>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              {t('common.clear')}
            </Button>
          </div>
          
          <Button 
            onClick={applyErasmusPreset}
            className="w-full bg-erasmus hover:bg-erasmus/90"
          >
            🎓 Preset Erasmus
          </Button>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Property Type */}
          <div className="space-y-3">
            <Label className="font-medium">Tipo de propiedad</Label>
            <div className="flex flex-wrap gap-2">
              {['Habitación', 'Estudio', 'Apartamento', 'Residencia'].map((type) => (
                <Badge
                  key={type}
                  variant={filters.propertyType.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newTypes = filters.propertyType.includes(type)
                      ? filters.propertyType.filter(t => t !== type)
                      : [...filters.propertyType, type];
                    handleFilterChange('propertyType', newTypes);
                  }}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="font-medium">Habitaciones</Label>
              <Select
                value={filters.bedrooms?.toString() || 'all'}
                onValueChange={(value) => handleFilterChange('bedrooms', value === 'all' ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cualquiera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquiera</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-medium">Baños</Label>
              <Select
                value={filters.bathrooms?.toString() || 'all'}
                onValueChange={(value) => handleFilterChange('bathrooms', value === 'all' ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cualquiera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquiera</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Neighborhoods */}
          <div className="space-y-3">
            <Label className="font-medium">Barrios</Label>
            <div className="flex flex-wrap gap-2">
              {['Centro', 'Universidad', 'Romareda', 'Actur', 'Delicias', 'Oliver'].map((neighborhood) => (
                <Badge
                  key={neighborhood}
                  variant={filters.neighborhoods.includes(neighborhood) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const newNeighborhoods = filters.neighborhoods.includes(neighborhood)
                      ? filters.neighborhoods.filter(n => n !== neighborhood)
                      : [...filters.neighborhoods, neighborhood];
                    handleFilterChange('neighborhoods', newNeighborhoods);
                  }}
                >
                  {neighborhood}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="font-medium">{t('filters.price_range')}</Label>
            <div className="px-3">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                min={150}
                max={1000}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>€{filters.priceRange[0]}</span>
                <span>€{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Filters */}
          <div className="space-y-3">
            <Label className="font-medium">Filtros rápidos</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="erasmus"
                  checked={filters.erasmusFriendly}
                  onCheckedChange={(checked) => handleFilterChange('erasmusFriendly', checked)}
                />
                <Label htmlFor="erasmus" className="text-sm">{t('filters.erasmus_friendly')}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-inclusive"
                  checked={filters.allInclusive}
                  onCheckedChange={(checked) => handleFilterChange('allInclusive', checked)}
                />
                <Label htmlFor="all-inclusive" className="text-sm">{t('filters.all_inclusive')}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={filters.furnished}
                  onCheckedChange={(checked) => handleFilterChange('furnished', checked)}
                />
                <Label htmlFor="furnished" className="text-sm">{t('filters.furnished')}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="english-contract"
                  checked={filters.englishContract}
                  onCheckedChange={(checked) => handleFilterChange('englishContract', checked)}
                />
                <Label htmlFor="english-contract" className="text-sm">{t('filters.english_contract')}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) => handleFilterChange('verifiedOnly', checked)}
                />
                <Label htmlFor="verified" className="text-sm">{t('filters.verified_only')}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets"
                  checked={filters.allowsPets}
                  onCheckedChange={(checked) => handleFilterChange('allowsPets', checked)}
                />
                <Label htmlFor="pets" className="text-sm">Admite mascotas</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smoking"
                  checked={filters.smokingAllowed}
                  onCheckedChange={(checked) => handleFilterChange('smokingAllowed', checked)}
                />
                <Label htmlFor="smoking" className="text-sm">Permite fumar</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Gender Preference */}
          <div className="space-y-3">
            <Label className="font-medium">Preferencia de género</Label>
            <Select
              value={filters.genderPreference || 'any'}
              onValueChange={(value) => handleFilterChange('genderPreference', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin preferencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Sin preferencia</SelectItem>
                <SelectItem value="male">Solo hombres</SelectItem>
                <SelectItem value="female">Solo mujeres</SelectItem>
                <SelectItem value="mixed">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Faculty and Distance */}
          <div className="space-y-3">
            <Label className="font-medium">{t('explore.faculty')}</Label>
            <Select
              value={filters.faculty || 'all'}
              onValueChange={(value) => handleFilterChange('faculty', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona facultad" />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.value} value={faculty.value}>
                    {faculty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {filters.faculty && (
              <div className="space-y-2">
                <Label className="text-sm">Distancia máxima: {filters.maxDistance} min</Label>
                <Slider
                  value={[filters.maxDistance]}
                  onValueChange={([value]) => handleFilterChange('maxDistance', value)}
                  min={5}
                  max={60}
                  step={5}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Duration */}
          <div className="space-y-3">
            <Label className="font-medium">{t('filters.duration')}</Label>
            <Select
              value={filters.duration || 'all'}
              onValueChange={(value) => handleFilterChange('duration', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier duración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier duración</SelectItem>
                <SelectItem value="4-6 meses">4-6 meses (Semestre)</SelectItem>
                <SelectItem value="9-10 meses">9-10 meses (Curso completo)</SelectItem>
                <SelectItem value="12+ meses">12+ meses (Año o más)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Roommates */}
          <div className="space-y-3">
            <Label className="font-medium">{t('filters.roommates')}</Label>
            <Select
              value={filters.roommates?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('roommates', value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier cantidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier cantidad</SelectItem>
                <SelectItem value="0">Solo (estudio)</SelectItem>
                <SelectItem value="1">1 compañero</SelectItem>
                <SelectItem value="2">2 compañeros</SelectItem>
                <SelectItem value="3">3 compañeros</SelectItem>
                <SelectItem value="4">4+ compañeros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Rating Filter */}
          <div className="space-y-3">
            <Label className="font-medium">Valoración mínima</Label>
            <Select
              value={filters.minRating?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('minRating', value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cualquier valoración" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier valoración</SelectItem>
                <SelectItem value="4">⭐ 4.0+</SelectItem>
                <SelectItem value="3">⭐ 3.0+</SelectItem>
                <SelectItem value="2">⭐ 2.0+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="font-medium">{t('filters.amenities')}</Label>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleAmenityToggle(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t p-4 space-y-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            {t('common.apply')} filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;