import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Filters } from './FiltersSheet';

interface ActiveFiltersProps {
  filters: Filters;
  onFilterRemove: (key: keyof Filters, value?: any) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onFilterRemove, onClearAll }) => {
  const activeFilterTags: { key: keyof Filters; label: string; value?: any }[] = [];

  // Price range (only show if not default)
  if (filters.priceRange[0] !== 200 || filters.priceRange[1] !== 800) {
    activeFilterTags.push({
      key: 'priceRange',
      label: `€${filters.priceRange[0]} - €${filters.priceRange[1]}`
    });
  }

  // Bedrooms
  if (filters.bedrooms) {
    activeFilterTags.push({
      key: 'bedrooms',
      label: `${filters.bedrooms}+ habitaciones`
    });
  }

  // Bathrooms
  if (filters.bathrooms) {
    activeFilterTags.push({
      key: 'bathrooms',
      label: `${filters.bathrooms}+ baños`
    });
  }

  // Property types
  filters.propertyType.forEach(type => {
    activeFilterTags.push({
      key: 'propertyType',
      label: type,
      value: type
    });
  });

  // Neighborhoods
  filters.neighborhoods.forEach(neighborhood => {
    activeFilterTags.push({
      key: 'neighborhoods',
      label: neighborhood,
      value: neighborhood
    });
  });

  // Boolean filters
  if (filters.furnished) {
    activeFilterTags.push({ key: 'furnished', label: 'Amueblado' });
  }
  if (filters.allInclusive) {
    activeFilterTags.push({ key: 'allInclusive', label: 'Todo incluido' });
  }
  if (filters.erasmusFriendly) {
    activeFilterTags.push({ key: 'erasmusFriendly', label: 'Erasmus friendly' });
  }
  if (filters.allowsPets) {
    activeFilterTags.push({ key: 'allowsPets', label: 'Mascotas' });
  }
  if (filters.verifiedOnly) {
    activeFilterTags.push({ key: 'verifiedOnly', label: 'Verificado' });
  }

  // Duration
  if (filters.duration && filters.duration !== 'all') {
    activeFilterTags.push({ key: 'duration', label: filters.duration });
  }

  // Roommates
  if (filters.roommates !== null) {
    const label = filters.roommates === 0 ? 'Solo' : `${filters.roommates} compañeros`;
    activeFilterTags.push({ key: 'roommates', label });
  }

  // Amenities
  filters.amenities.forEach(amenity => {
    activeFilterTags.push({
      key: 'amenities',
      label: amenity,
      value: amenity
    });
  });

  // Faculty
  if (filters.faculty && filters.faculty !== 'all') {
    activeFilterTags.push({ key: 'faculty', label: `Cerca de ${filters.faculty}` });
  }

  if (activeFilterTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
      {activeFilterTags.map((filter, index) => (
        <Badge
          key={`${filter.key}-${index}`}
          variant="secondary"
          className="gap-1"
        >
          {filter.label}
          <button
            onClick={() => onFilterRemove(filter.key, filter.value)}
            className="ml-1 rounded-full hover:bg-background/80 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 text-xs"
      >
        Limpiar todo
      </Button>
    </div>
  );
};

export default ActiveFilters;
