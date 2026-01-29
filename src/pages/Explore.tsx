import Layout from "@/components/layout/Layout";
import ListingCard from "@/components/explore/ListingCard";
import ViewToggle, { ViewMode } from "@/components/explore/ViewToggle";
import PropertyTypeFilter, { PropertyFilter } from "@/components/explore/PropertyTypeFilter";
import StickyFiltersBar from "@/components/explore/StickyFiltersBar";
import AdvancedFiltersModal from "@/components/explore/AdvancedFiltersModal";
import ActiveFilters from "@/components/explore/ActiveFilters";
import MapView from "@/components/explore/MapView";
import SwipeView from "@/components/explore/SwipeView";
import MobileDrawer from "@/components/explore/MobileDrawer";
import { ListingComparator } from "@/components/explore/ListingComparator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/contexts/I18nContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useCompare } from "@/contexts/CompareContext";
import { analytics } from "@/utils/analytics";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { useLikes } from "@/hooks/useLikes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSquads } from "@/hooks/useSquads";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Building2, X } from "lucide-react";
import { residences } from "@/data/residences";
import { Faculty } from "@/data/faculties";
import { Filters } from "@/components/explore/FiltersSheet";

const Explore = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, isLoading } = useListings();
  const { toggleLike } = useLikes();
  const isMobile = useIsMobile();
  const { mySquad, squadMembers } = useSquads();

  // Preferences and Compare hooks
  const { hasCompletedQuestionnaire } = usePreferences();
  const { compareList, isCompareOpen, setIsCompareOpen, removeFromCompare, clearCompare } = useCompare();

  // Get initial property filter from URL
  const getInitialPropertyFilter = (): PropertyFilter => {
    const typeParam = searchParams.get('tipo');
    if (typeParam === 'pisos') return 'pisos';
    if (typeParam === 'residencias') return 'residencias';
    return 'all';
  };

  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'map'
  );
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>(getInitialPropertyFilter());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [visibleListingIds, setVisibleListingIds] = useState<number[]>([]);
  const [drawnZonePolygon, setDrawnZonePolygon] = useState<google.maps.LatLngLiteral[] | null>(null);

  // New filter states
  const [entryDate, setEntryDate] = useState<Date | undefined>(undefined);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Bidirectional hover sync state
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  const listingRefs = useRef<Map<number, HTMLElement>>(new Map());

  const [filters, setFilters] = useState<Filters>({
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
  });

  // Convert residences to display format
  const residenceListings = useMemo(() => residences
    .filter(r => r.status === 'active')
    .map((residence, index) => ({
      id: 10000 + index,
      originalId: residence.id,
      title: residence.name,
      location: residence.address,
      price: residence.priceRange.min,
      priceMax: residence.priceRange.max,
      image: `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&q=80`,
      images: [
        `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80`
      ],
      verified: residence.verified,
      matchScore: Math.round(residence.rating * 20),
      bedrooms: 1,
      bathrooms: 1,
      amenities: residence.services.slice(0, 4),
      furnished: true,
      allInclusive: true,
      erasmusFriendly: true,
      englishContract: false,
      roommates: residence.capacity || 1,
      faculty: [],
      distance: '1.0 km',
      coordinates: residence.coordinates
        ? [residence.coordinates[1], residence.coordinates[0]] as [number, number]
        : [-0.8891, 41.6488] as [number, number],
      isResidence: true,
      residenceType: residence.type,
      residenceGender: residence.gender,
    })), []);

  // Register listing refs for scroll-into-view
  const registerListingRef = useCallback((id: number, element: HTMLElement | null) => {
    if (element) {
      listingRefs.current.set(id, element);
    } else {
      listingRefs.current.delete(id);
    }
  }, []);

  // Handle marker hover -> scroll list
  const handleMarkerHover = useCallback((id: number | null) => {
    setHoveredListingId(id);
    if (id && listingRefs.current.has(id)) {
      const element = listingRefs.current.get(id);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Handle list hover -> highlight marker
  const handleListingHover = useCallback((id: number | null) => {
    setHoveredListingId(id);
  }, []);

  // Track page view
  useEffect(() => {
    analytics.trackPageView('/explore', 'Explore Accommodations');
  }, []);

  // Sync property filter from URL
  useEffect(() => {
    const typeParam = searchParams.get('tipo');
    if (typeParam === 'pisos' && propertyFilter !== 'pisos') {
      setPropertyFilter('pisos');
    } else if (typeParam === 'residencias' && propertyFilter !== 'residencias') {
      setPropertyFilter('residencias');
    }
  }, [searchParams]);

  // Auto-filter bedrooms based on squad size
  useEffect(() => {
    if (mySquad && squadMembers.length > 0) {
      setFilters(prev => ({
        ...prev,
        bedrooms: squadMembers.length
      }));
    }
  }, [mySquad, squadMembers]);

  // Update URL when view mode or property filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (viewMode !== 'map') {
      params.set('view', viewMode);
    } else {
      params.delete('view');
    }

    if (propertyFilter !== 'all') {
      params.set('tipo', propertyFilter);
    } else {
      params.delete('tipo');
    }

    setSearchParams(params, { replace: true });
    analytics.trackViewModeChanged(viewMode);
  }, [viewMode, propertyFilter, setSearchParams]);

  // Convert pisos listings to display format
  const pisoListings = useMemo(() => listings.map((listing, index) => ({
    id: index + 1, // Display ID for UI purposes
    originalId: listing.id, // Keep original UUID for database operations
    title: listing.title,
    location: listing.address,
    price: Number(listing.price),
    image: listing.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    images: listing.images.length > 0 ? listing.images : [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    verified: true,
    matchScore: 95 - (index % 10),
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    amenities: [
      ...(listing.has_wifi ? ['WiFi'] : []),
      ...(listing.has_parking ? ['Parking'] : []),
      ...(listing.has_washing_machine ? ['Lavadora'] : []),
      ...(listing.has_ac ? ['AC'] : [])
    ],
    furnished: listing.is_furnished,
    allInclusive: listing.utilities_included,
    erasmusFriendly: true,
    englishContract: false,
    roommates: listing.max_occupants || 0,
    faculty: [],
    distance: listing.latitude && listing.longitude ? '1.2 km' : 'N/A',
    coordinates: [
      listing.longitude || -0.8891,
      listing.latitude || 41.6488
    ] as [number, number],
    isResidence: false,
  })), [listings]);

  // Combine and filter based on property type
  const allListings = useMemo(() => {
    if (propertyFilter === 'pisos') return pisoListings;
    if (propertyFilter === 'residencias') return residenceListings;
    return [...pisoListings, ...residenceListings];
  }, [propertyFilter, pisoListings, residenceListings]);

  // Helper function to check if a point is inside a polygon
  const isPointInPolygon = useCallback((point: [number, number], polygon: google.maps.LatLngLiteral[]): boolean => {
    const x = point[0]; // longitude
    const y = point[1]; // latitude
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }, []);

  // Filter listings
  const filteredListings = allListings.filter(listing => {
    // Zone polygon filter (highest priority - drawn zone)
    if (drawnZonePolygon && drawnZonePolygon.length > 0) {
      if (!isPointInPolygon(listing.coordinates, drawnZonePolygon)) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const searchWords = searchQuery.toLowerCase().split(/\s+/);
      const searchableText = [listing.title, listing.location].join(' ').toLowerCase();
      if (!searchWords.every(word => searchableText.includes(word))) {
        return false;
      }
    }

    // Price filter
    if (listing.price < filters.priceRange[0] || listing.price > filters.priceRange[1]) {
      return false;
    }

    // Apartment-specific filters
    if (!listing.isResidence) {
      if (filters.bedrooms && listing.bedrooms < filters.bedrooms) return false;
      if (filters.bathrooms && listing.bathrooms < filters.bathrooms) return false;
      if (filters.neighborhoods.length > 0) {
        const addressLower = listing.location.toLowerCase();
        if (!filters.neighborhoods.some(n => addressLower.includes(n.toLowerCase()))) return false;
      }
    }

    // Amenities filter (soft match - doesn't strictly require all)
    if (filters.amenities.length > 0) {
      const hasAtLeastOneAmenity = filters.amenities.some(amenity =>
        listing.amenities?.includes(amenity) ||
        listing.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      );
      if (!hasAtLeastOneAmenity) return false;
    }

    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      default: return 0;
    }
  });

  const displayListings = sortedListings;

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] !== 200 || filters.priceRange[1] !== 800) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.allowsPets) count++;
    if (filters.smokingAllowed) count++;
    if (filters.allInclusive) count++;
    if (filters.genderPreference !== 'any') count++;
    if (entryDate) count++;
    if (selectedFaculty) count++;
    if (drawnZonePolygon) count++;
    return count;
  }, [filters, entryDate, selectedFaculty, drawnZonePolygon]);

  // Handle zone filter from map
  const handleZoneFilter = useCallback((polygon: google.maps.LatLngLiteral[] | null) => {
    setDrawnZonePolygon(polygon);
  }, []);

  const handleClearFilters = () => {
    setFilters({
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
      duration: '',
      roommates: null,
      amenities: [],
      faculty: '',
      maxDistance: 30,
      allowsPets: false,
      minRating: null,
      smokingAllowed: false,
      genderPreference: 'any'
    });
    setSearchQuery('');
    setEntryDate(undefined);
    setSelectedFaculty(null);
    setDrawnZonePolygon(null);
  };

  const handleFilterRemove = (key: keyof Filters, value?: any) => {
    const newFilters = { ...filters };

    if (key === 'priceRange') {
      newFilters.priceRange = [200, 800];
    } else if (key === 'amenities' && value) {
      newFilters.amenities = newFilters.amenities.filter(a => a !== value);
    } else if (typeof newFilters[key] === 'boolean') {
      (newFilters[key] as boolean) = false;
    } else if (typeof newFilters[key] === 'number' || newFilters[key] === null) {
      (newFilters[key] as any) = null;
    } else if (typeof newFilters[key] === 'string') {
      (newFilters[key] as string) = '';
    }

    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 max-w-6xl space-y-3">
          {/* View & Property Type Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <PropertyTypeFilter
              currentFilter={propertyFilter}
              onFilterChange={setPropertyFilter}
              pisosCount={pisoListings.length}
              residenciasCount={residenceListings.length}
            />
          </div>

          {/* CTA to Residences Directory */}
          {(propertyFilter === 'residencias' || propertyFilter === 'all') && (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  ¿Prefieres ver el directorio completo de residencias?
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/residences'}
                className="shrink-0"
              >
                Ver directorio
              </Button>
            </div>
          )}

          {/* Sticky Filters Bar */}
          <StickyFiltersBar
            priceRange={filters.priceRange}
            onPriceRangeChange={(range) => setFilters(prev => ({ ...prev, priceRange: range }))}
            entryDate={entryDate}
            onEntryDateChange={setEntryDate}
            selectedFaculty={selectedFaculty}
            onFacultyChange={setSelectedFaculty}
            activeFiltersCount={activeFiltersCount}
            onMoreFiltersClick={() => setShowAdvancedFilters(true)}
            propertyFilter={propertyFilter}
          />

          {/* Zone Filter Active Indicator */}
          {drawnZonePolygon && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  Zona personalizada activa
                </span>
                <span className="text-sm text-muted-foreground">
                  ({displayListings.length} resultados)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawnZonePolygon(null)}
                className="text-primary hover:text-primary/80"
              >
                <X className="h-4 w-4 mr-1" />
                Quitar zona
              </Button>
            </div>
          )}

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && !drawnZonePolygon && (
            <ActiveFilters
              filters={filters}
              onFilterRemove={handleFilterRemove}
              onClearAll={handleClearFilters}
            />
          )}

          {/* Squad Banner */}
          {mySquad && squadMembers.length > 0 && (
            <Alert className="border-primary/50 bg-primary/5">
              <Users className="h-4 w-4 text-primary" />
              <AlertDescription className="ml-2">
                Buscando para <strong>{mySquad.name}</strong> ({squadMembers.length} personas)
              </AlertDescription>
            </Alert>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[16/9] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-6">
                  {displayListings.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {displayListings.map((listing, index) => (
                        <ListingCard
                          key={listing.id}
                          {...listing}
                          position={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 space-y-4">
                      <h3 className="text-lg font-medium">No hay resultados</h3>
                      <p className="text-muted-foreground">Prueba con otros filtros</p>
                      <Button variant="outline" onClick={handleClearFilters}>
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Map View */}
              {viewMode === 'map' && (
                <>
                  {!isMobile ? (
                    <div className="grid grid-cols-2 gap-4 h-[calc(100vh-300px)] min-h-[500px]">
                      <div className="overflow-y-auto overflow-x-hidden space-y-4 pr-2 scroll-smooth">
                        {(() => {
                          const listingsToShow = visibleListingIds.length > 0
                            ? displayListings.filter(l => visibleListingIds.includes(l.id))
                            : displayListings;

                          return listingsToShow.length > 0 ? (
                            listingsToShow.map((listing, index) => (
                              <ListingCard
                                key={listing.id}
                                {...listing}
                                position={index}
                                isHighlighted={hoveredListingId === listing.id}
                                onMouseEnter={() => handleListingHover(listing.id)}
                                onMouseLeave={() => handleListingHover(null)}
                                registerRef={registerListingRef}
                              />
                            ))
                          ) : (
                            <div className="text-center py-16">
                              <p className="text-muted-foreground">No hay resultados en esta zona</p>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="h-full rounded-2xl overflow-hidden shadow-lg">
                        <MapView
                          listings={displayListings}
                          onVisibleListingsChange={setVisibleListingIds}
                          hoveredListingId={hoveredListingId}
                          onMarkerHover={handleMarkerHover}
                          onZoneFilter={handleZoneFilter}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Mobile: Simple list view without map */
                    <div className="space-y-4 pb-6">
                      <p className="text-sm text-muted-foreground">
                        {displayListings.length} alojamientos encontrados
                      </p>
                      {displayListings.length > 0 ? (
                        displayListings.map((listing, index) => (
                          <ListingCard
                            key={listing.id}
                            {...listing}
                            position={index}
                          />
                        ))
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-muted-foreground">No hay resultados</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Swipe View */}
              {viewMode === 'swipe' && (
                <div className="py-4">
                  <SwipeView listings={displayListings} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal
          isOpen={showAdvancedFilters}
          onOpenChange={setShowAdvancedFilters}
          filters={filters}
          onFiltersChange={setFilters}
          propertyFilter={propertyFilter}
          resultsCount={displayListings.length}
        />
        <ListingComparator
          listings={compareList}
          onRemove={removeFromCompare}
          onClear={clearCompare}
          isOpen={isCompareOpen}
          onOpenChange={setIsCompareOpen}
        />
      </div>
    </Layout>
  );
};

export default Explore;
