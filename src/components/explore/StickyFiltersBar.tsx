import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  CalendarDays, 
  Euro, 
  SlidersHorizontal,
  GraduationCap,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { zaragozaFaculties, Faculty } from '@/data/faculties';
import { PropertyFilter } from './PropertyTypeFilter';

interface StickyFiltersBarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  entryDate: Date | undefined;
  onEntryDateChange: (date: Date | undefined) => void;
  selectedFaculty: Faculty | null;
  onFacultyChange: (faculty: Faculty | null) => void;
  activeFiltersCount: number;
  onMoreFiltersClick: () => void;
  propertyFilter: PropertyFilter;
}

const StickyFiltersBar = ({
  priceRange,
  onPriceRangeChange,
  entryDate,
  onEntryDateChange,
  selectedFaculty,
  onFacultyChange,
  activeFiltersCount,
  onMoreFiltersClick,
  propertyFilter,
}: StickyFiltersBarProps) => {
  const [priceOpen, setPriceOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const neighborhoods = ['Centro', 'Universidad', 'Romareda', 'Actur', 'Delicias', 'Oliver', 'Las Fuentes'];

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* Location / Faculty Filter */}
        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full gap-2 whitespace-nowrap",
                selectedFaculty && "bg-primary/10 border-primary text-primary"
              )}
            >
              {selectedFaculty ? (
                <>
                  <GraduationCap className="h-4 w-4" />
                  {selectedFaculty.shortName}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onFacultyChange(null);
                    }}
                  />
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 space-y-4">
              {/* Universities Tab */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Universidades y Facultades
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {zaragozaFaculties.map((faculty) => (
                    <Button
                      key={faculty.id}
                      variant={selectedFaculty?.id === faculty.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs justify-start h-auto py-2"
                      onClick={() => {
                        onFacultyChange(faculty);
                        setLocationOpen(false);
                      }}
                    >
                      {faculty.shortName}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Neighborhoods */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Barrios
                </h4>
                <div className="flex flex-wrap gap-2">
                  {neighborhoods.map((neighborhood) => (
                    <Badge
                      key={neighborhood}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setLocationOpen(false)}
                    >
                      {neighborhood}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Entry Date Filter */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full gap-2 whitespace-nowrap",
                entryDate && "bg-primary/10 border-primary text-primary"
              )}
            >
              <CalendarDays className="h-4 w-4" />
              {entryDate ? format(entryDate, 'MMM yyyy', { locale: es }) : 'Fecha entrada'}
              {entryDate && (
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEntryDateChange(undefined);
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => {
                  onEntryDateChange(new Date());
                  setDateOpen(false);
                }}
              >
                🚀 Entrada inmediata
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={entryDate}
              onSelect={(date) => {
                onEntryDateChange(date);
                setDateOpen(false);
              }}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Price Range Filter */}
        <Popover open={priceOpen} onOpenChange={setPriceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full gap-2 whitespace-nowrap",
                (priceRange[0] !== 200 || priceRange[1] !== 800) && "bg-primary/10 border-primary text-primary"
              )}
            >
              <Euro className="h-4 w-4" />
              {priceRange[0] === 200 && priceRange[1] === 800 
                ? 'Precio' 
                : `${priceRange[0]}€ - ${priceRange[1]}€`
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Rango de precio mensual</h4>
            <div className="px-2">
                <div className="flex justify-between text-sm font-semibold text-[hsl(210,100%,50%)] mb-3">
                  <span className="bg-[hsl(210,100%,95%)] px-2 py-1 rounded-md">{priceRange[0]}€</span>
                  <span className="bg-[hsl(210,100%,95%)] px-2 py-1 rounded-md">{priceRange[1]}€</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
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
              {/* Quick price options */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '< 300€', range: [150, 300] as [number, number] },
                  { label: '300-500€', range: [300, 500] as [number, number] },
                  { label: '500-800€', range: [500, 800] as [number, number] },
                  { label: '800€+', range: [800, 2000] as [number, number] },
                ].map((option) => (
                  <Badge
                    key={option.label}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => {
                      onPriceRangeChange(option.range);
                    }}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* More Filters Button */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-2 whitespace-nowrap"
          onClick={onMoreFiltersClick}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Más filtros
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StickyFiltersBar;
