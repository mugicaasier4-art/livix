import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { MapPin, X, Loader2, ArrowUp } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';
import { cn } from '@/lib/utils';
import MapMiniCard from './MapMiniCard';
import DrawingTool from './DrawingTool';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface Listing {
  id: number;
  originalId?: string; // UUID from database
  image: string;
  images?: string[];
  title: string;
  location: string;
  price: number;
  roommates?: number;
  distance?: string;
  verified?: boolean;
  amenities?: string[];
  matchScore?: number;
  bedrooms?: number;
  coordinates: [number, number];
}

interface MapViewProps {
  listings: Listing[];
  onVisibleListingsChange?: (visibleIds: number[]) => void;
  hoveredListingId?: number | null;
  onMarkerHover?: (id: number | null) => void;
  onZoneFilter?: (polygon: google.maps.LatLngLiteral[] | null) => void;
}

// Cluster grouping logic
const clusterListings = (listings: Listing[], zoom: number) => {
  if (zoom >= 15) return { clusters: [], singles: listings };

  const gridSize = zoom < 12 ? 0.02 : zoom < 14 ? 0.01 : 0.005;
  const clusters: { center: [number, number]; listings: Listing[] }[] = [];
  const processed = new Set<number>();

  listings.forEach(listing => {
    if (processed.has(listing.id)) return;

    const nearby = listings.filter(other => {
      if (processed.has(other.id)) return false;
      const distance = Math.sqrt(
        Math.pow(listing.coordinates[0] - other.coordinates[0], 2) +
        Math.pow(listing.coordinates[1] - other.coordinates[1], 2)
      );
      return distance < gridSize;
    });

    if (nearby.length >= 3) {
      const avgLng = nearby.reduce((sum, l) => sum + l.coordinates[0], 0) / nearby.length;
      const avgLat = nearby.reduce((sum, l) => sum + l.coordinates[1], 0) / nearby.length;
      clusters.push({ center: [avgLng, avgLat], listings: nearby });
      nearby.forEach(l => processed.add(l.id));
    }
  });

  const singles = listings.filter(l => !processed.has(l.id));
  return { clusters, singles };
};

// Price Pill Marker Component
const PriceMarker = ({
  listing,
  isHovered,
  isSelected,
  isVisited,
  onClick,
  onMouseEnter,
  onMouseLeave
}: {
  listing: Listing;
  isHovered: boolean;
  isSelected: boolean;
  isVisited?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const isActive = isHovered || isSelected;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "cursor-pointer transition-all duration-200 ease-out",
        isActive ? "scale-110 -translate-y-1 z-50" : "scale-100 z-10",
        isVisited && !isActive ? "opacity-70" : "opacity-100"
      )}
      style={{ position: 'relative' }}
    >
      <div
        className={cn(
          "px-3 py-1.5 rounded-full font-bold text-sm leading-tight",
          "whitespace-nowrap inline-flex items-center justify-center",
          "shadow-lg border transition-all duration-200",
          isActive
            ? "bg-foreground text-background border-foreground shadow-xl"
            : isVisited
              ? "bg-muted text-muted-foreground border-border"
              : "bg-background text-foreground border-border/50 hover:shadow-xl"
        )}
      >
        {listing.price.toLocaleString('es-ES')}€
      </div>
      {/* Triangle pointer */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 -bottom-1.5",
          "w-0 h-0",
          "border-l-[6px] border-l-transparent",
          "border-r-[6px] border-r-transparent",
          isActive
            ? "border-t-[6px] border-t-foreground"
            : isVisited
              ? "border-t-[6px] border-t-muted"
              : "border-t-[6px] border-t-background"
        )}
      />
    </div>
  );
};

// Cluster Marker Component
const ClusterMarker = ({
  count,
  onClick
}: {
  count: number;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 ease-out hover:scale-110",
        "w-12 h-12 rounded-full",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center",
        "font-bold text-sm shadow-xl border-2 border-background"
      )}
    >
      {count}
    </div>
  );
};

const MapView = ({
  listings,
  onVisibleListingsChange,
  hoveredListingId: externalHoveredId,
  onMarkerHover,
  onZoneFilter
}: MapViewProps) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [internalHoveredId, setInternalHoveredId] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [visibleListings, setVisibleListings] = useState<Listing[]>(listings);
  const [zoom, setZoom] = useState(13);
  const [visitedIds, setVisitedIds] = useState<Set<number>>(new Set());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [initialBoundsFit, setInitialBoundsFit] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [activeZonePolygon, setActiveZonePolygon] = useState<google.maps.LatLngLiteral[] | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const apiKey = GOOGLE_MAPS_CONFIG.apiKey;

  // Use the hook instead of LoadScript component for better initialization
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  // Use external or internal hover state
  const hoveredListingId = externalHoveredId ?? internalHoveredId;

  const handleMarkerHover = (id: number | null) => {
    setInternalHoveredId(id);
    onMarkerHover?.(id);
  };

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '16px',
  };

  const mapOptions: google.maps.MapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    styles: GOOGLE_MAPS_CONFIG.mapStyles,
    gestureHandling: 'greedy',
    draggable: true,
    scrollwheel: true,
    minZoom: 8,
    maxZoom: 21,
  }), []);

  // Cluster listings based on zoom level
  const { clusters, singles } = useMemo(() =>
    clusterListings(listings, zoom),
    [listings, zoom]
  );

  // Fit bounds only ONCE when map is first ready
  useEffect(() => {
    if (map && mapReady && listings.length > 0 && !initialBoundsFit) {
      const bounds = new google.maps.LatLngBounds();
      listings.forEach(listing => {
        bounds.extend({ lat: listing.coordinates[1], lng: listing.coordinates[0] });
      });

      requestAnimationFrame(() => {
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 100, left: 50 });
        setInitialBoundsFit(true);
      });
    }
  }, [map, mapReady, listings, initialBoundsFit]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log('Google Map loaded successfully');
    setMap(mapInstance);

    // Wait for the map to be fully idle before marking as ready
    google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
      console.log('Map is idle and ready');
      setMapReady(true);
    });
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMapReady(false);
  }, []);

  // Handle zoom changes
  const onZoomChanged = useCallback(() => {
    if (map) {
      const newZoom = map.getZoom();
      if (newZoom) setZoom(newZoom);
    }
  }, [map]);

  // Update visible listings when map stops moving
  const onIdle = useCallback(() => {
    if (map) {
      const bounds = map.getBounds();
      const currentZoom = map.getZoom();
      if (currentZoom) setZoom(currentZoom);

      if (bounds) {
        const filtered = listings.filter(listing => {
          const lat = listing.coordinates[1];
          const lng = listing.coordinates[0];
          return bounds.contains({ lat, lng });
        });
        setVisibleListings(filtered);
        onVisibleListingsChange?.(filtered.map(l => l.id));
      }
    }
  }, [map, listings, onVisibleListingsChange]);

  // Fly to cluster on click
  const handleClusterClick = useCallback((center: [number, number]) => {
    if (map) {
      map.panTo({ lat: center[1], lng: center[0] });
      map.setZoom(Math.min((zoom || 13) + 2, 17));
    }
  }, [map, zoom]);

  // Handle marker click
  const handleMarkerClick = useCallback((listing: Listing) => {
    setVisitedIds(prev => new Set([...prev, listing.id]));

    if (isMobile) {
      setSelectedListing(listing);
      setMobileDrawerOpen(true);
    } else {
      setSelectedListing(listing);
    }
  }, [isMobile]);

  // Close popup/drawer
  const handleClosePopup = useCallback(() => {
    setSelectedListing(null);
    setMobileDrawerOpen(false);
  }, []);

  // Drawing tool handlers
  const handleDrawingToggle = useCallback(() => {
    setIsDrawingMode(prev => !prev);
  }, []);

  const handlePolygonComplete = useCallback((polygon: google.maps.LatLngLiteral[]) => {
    setIsDrawingMode(false);
    setActiveZonePolygon(polygon);
    onZoneFilter?.(polygon);
  }, [onZoneFilter]);

  const handleDrawingClear = useCallback(() => {
    setActiveZonePolygon(null);
    onZoneFilter?.(null);
  }, [onZoneFilter]);

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

  // Filter listings based on active zone polygon
  const filteredSingles = useMemo(() => {
    if (!activeZonePolygon || activeZonePolygon.length < 3) {
      return singles;
    }
    return singles.filter(listing =>
      isPointInPolygon(listing.coordinates, activeZonePolygon)
    );
  }, [singles, activeZonePolygon, isPointInPolygon]);

  const filteredClusters = useMemo(() => {
    if (!activeZonePolygon || activeZonePolygon.length < 3) {
      return clusters;
    }
    return clusters.filter(cluster =>
      isPointInPolygon(cluster.center, activeZonePolygon)
    );
  }, [clusters, activeZonePolygon, isPointInPolygon]);

  // No API key configured
  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8 bg-muted rounded-2xl">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Configurar Google Maps</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Para ver el mapa, configura VITE_GOOGLE_MAPS_API_KEY en el archivo .env
        </p>
      </div>
    );
  }

  // Loading error
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8 bg-muted rounded-2xl">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Error cargando Google Maps</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Verifica que la clave es válida y que el dominio está permitido.
        </p>
      </div>
    );
  }

  // Still loading
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8 bg-muted rounded-2xl">
        <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
        <h3 className="text-lg font-medium mb-2">Cargando mapa...</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Preparando Google Maps
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" ref={mapContainerRef}>
      {/* Drawing Tool - positioned above map */}
      {!isMobile && mapReady && (
        <DrawingTool
          map={map}
          isActive={isDrawingMode}
          onToggle={handleDrawingToggle}
          onPolygonComplete={handlePolygonComplete}
          onClear={handleDrawingClear}
        />
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={GOOGLE_MAPS_CONFIG.defaultCenter}
        zoom={13}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={onIdle}
        onZoomChanged={onZoomChanged}
        onClick={handleClosePopup}
      >
        {mapReady && (
          <>
            {/* Cluster Markers - only show those in zone */}
            {filteredClusters.map((cluster, idx) => (
              <OverlayView
                key={`cluster-${idx}`}
                position={{ lat: cluster.center[1], lng: cluster.center[0] }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <ClusterMarker
                  count={cluster.listings.length}
                  onClick={() => handleClusterClick(cluster.center)}
                />
              </OverlayView>
            ))}

            {/* Individual Price Markers - only show those in zone */}
            {filteredSingles.map((listing) => (
              <OverlayView
                key={listing.id}
                position={{ lat: listing.coordinates[1], lng: listing.coordinates[0] }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <PriceMarker
                  listing={listing}
                  isHovered={hoveredListingId === listing.id}
                  isSelected={selectedListing?.id === listing.id}
                  isVisited={visitedIds.has(listing.id)}
                  onClick={() => handleMarkerClick(listing)}
                  onMouseEnter={() => handleMarkerHover(listing.id)}
                  onMouseLeave={() => handleMarkerHover(null)}
                />
              </OverlayView>
            ))}

            {/* Desktop Popup */}
            {selectedListing && !isMobile && (
              <OverlayView
                position={{
                  lat: selectedListing.coordinates[1],
                  lng: selectedListing.coordinates[0]
                }}
                mapPaneName={OverlayView.FLOAT_PANE}
              >
                <div className="relative -translate-x-1/2 -translate-y-full pb-4">
                  <MapMiniCard
                    listing={selectedListing}
                    onClose={handleClosePopup}
                  />
                  <button
                    onClick={handleClosePopup}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </OverlayView>
            )}
          </>
        )}
      </GoogleMap>

      {/* Mobile Floating Action Button - Ver Lista */}
      {isMobile && (
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="absolute bottom-20 right-4 z-20 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm animate-bounce-subtle"
        >
          <span>{visibleListings.length} pisos</span>
          <ArrowUp className="h-4 w-4" />
        </button>
      )}

      {/* Listings Count Badge - Desktop */}
      {!isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            {activeZonePolygon ? filteredSingles.length + filteredClusters.reduce((sum, c) => sum + c.listings.length, 0) : visibleListings.length} alojamientos
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Drawer with List */}
      <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-semibold">
                {selectedListing ? selectedListing.title : `${visibleListings.length} alojamientos`}
              </DrawerTitle>
              {selectedListing && (
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-sm text-primary font-medium"
                >
                  Ver todos
                </button>
              )}
            </div>
            {/* Drag indicator */}
            <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-2" />
          </DrawerHeader>

          {selectedListing ? (
            <div className="px-4 pb-6">
              <MapMiniCard
                listing={selectedListing}
                onClose={handleClosePopup}
                className="w-full shadow-none border-0"
              />
            </div>
          ) : (
            <div className="px-4 pb-6 space-y-3 overflow-y-auto max-h-[60vh]">
              {visibleListings.slice(0, 10).map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => {
                    setSelectedListing(listing);
                    if (map) {
                      map.panTo({ lat: listing.coordinates[1], lng: listing.coordinates[0] });
                    }
                  }}
                  className="flex gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted active:scale-[0.98] transition-all cursor-pointer"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{listing.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{listing.location}</p>
                    <p className="text-lg font-bold text-primary mt-1">{listing.price}€<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
                  </div>
                </div>
              ))}
              {visibleListings.length > 10 && (
                <p className="text-center text-sm text-muted-foreground py-2">
                  +{visibleListings.length - 10} más en esta zona
                </p>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MapView;
