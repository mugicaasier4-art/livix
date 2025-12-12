import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, GraduationCap, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import SortMenu from './SortMenu';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
  activeFiltersCount: number;
  onFiltersClick: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFacultyClick: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  resultsCount,
  activeFiltersCount,
  onFiltersClick,
  sortBy,
  onSortChange,
  onFacultyClick,
  onClearFilters,
  hasActiveFilters,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative" data-tour="search-bar">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('explore.search.placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 border-0 bg-surface-secondary shadow-soft"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onFiltersClick}
          className="flex-shrink-0"
          data-tour="filters"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t('explore.filters')}
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <SortMenu value={sortBy} onChange={onSortChange} />

        <Button
          variant="outline"
          size="sm"
          onClick={onFacultyClick}
          className="flex-shrink-0"
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          {t('explore.faculty')}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {t('common.clear')}
          </Button>
        )}
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultsCount} {t('explore.results')} en Zaragoza
        </span>
      </div>
    </div>
  );
};

export default SearchHeader;