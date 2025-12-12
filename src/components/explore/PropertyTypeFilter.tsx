import { cn } from "@/lib/utils";
import { Building2, Home, LayoutGrid } from "lucide-react";

export type PropertyFilter = 'all' | 'pisos' | 'residencias';

interface PropertyTypeFilterProps {
  currentFilter: PropertyFilter;
  onFilterChange: (filter: PropertyFilter) => void;
  pisosCount?: number;
  residenciasCount?: number;
}

const PropertyTypeFilter = ({ 
  currentFilter, 
  onFilterChange,
  pisosCount,
  residenciasCount
}: PropertyTypeFilterProps) => {
  const filters = [
    { 
      value: 'all' as PropertyFilter, 
      icon: LayoutGrid, 
      label: 'Todo',
      count: pisosCount && residenciasCount ? pisosCount + residenciasCount : undefined
    },
    { 
      value: 'pisos' as PropertyFilter, 
      icon: Home, 
      label: 'Pisos',
      count: pisosCount
    },
    { 
      value: 'residencias' as PropertyFilter, 
      icon: Building2, 
      label: 'Residencias',
      count: residenciasCount
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            currentFilter === filter.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <filter.icon className="h-3.5 w-3.5" />
          <span>{filter.label}</span>
          {filter.count !== undefined && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full",
              currentFilter === filter.value
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}>
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default PropertyTypeFilter;
