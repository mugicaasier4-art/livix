import { useState, useCallback, useEffect, useRef } from 'react';
import { Pencil, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DrawingToolProps {
  map: google.maps.Map | null;
  isActive: boolean;
  onToggle: () => void;
  onPolygonComplete: (polygon: google.maps.LatLngLiteral[]) => void;
  onClear: () => void;
}

const DrawingTool = ({ 
  map, 
  isActive, 
  onToggle, 
  onPolygonComplete,
  onClear 
}: DrawingToolProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [hasPolygon, setHasPolygon] = useState(false);
  const pointsRef = useRef<google.maps.LatLng[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const listenerRefs = useRef<google.maps.MapsEventListener[]>([]);

  const REQUIRED_POINTS = 4;

  // Clean up markers
  const cleanupMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  // Clean up drawing elements
  const cleanupDrawing = useCallback(() => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    cleanupMarkers();
    pointsRef.current = [];
    setClickCount(0);
  }, [cleanupMarkers]);

  // Clean up polygon
  const cleanupPolygon = useCallback(() => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setHasPolygon(false);
  }, []);

  // Remove all listeners
  const removeListeners = useCallback(() => {
    listenerRefs.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    listenerRefs.current = [];
  }, []);

  // Complete the polygon after 4 points
  const completePolygon = useCallback(() => {
    if (!map || pointsRef.current.length < 3) {
      cleanupDrawing();
      toast.error('Necesitas al menos 3 puntos');
      return;
    }

    // Store the points before cleanup
    const finalPoints = [...pointsRef.current];

    // Clean up the temporary polyline and markers
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    cleanupMarkers();

    // Create the final polygon with semi-transparent blue fill
    const polygon = new google.maps.Polygon({
      paths: finalPoints,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.9,
      strokeWeight: 3,
      fillColor: '#3B82F6',
      fillOpacity: 0.35, // More visible fill
      map: map,
      clickable: false,
    });

    polygonRef.current = polygon;
    setHasPolygon(true);
    setClickCount(0);
    pointsRef.current = [];

    // Convert to LatLngLiteral array and pass to parent
    const polygonCoords = finalPoints.map(point => ({
      lat: point.lat(),
      lng: point.lng()
    }));

    onPolygonComplete(polygonCoords);
    toast.success('Zona seleccionada - mostrando solo pisos en esta área');
  }, [map, cleanupMarkers, onPolygonComplete]);

  // Update polyline to show current path
  const updatePolyline = useCallback(() => {
    if (polylineRef.current && pointsRef.current.length > 0) {
      // Close the path visually by adding first point at end
      const path = [...pointsRef.current];
      if (path.length > 1) {
        path.push(path[0]); // Close the loop visually
      }
      polylineRef.current.setPath(path);
    }
  }, []);

  // Add a point marker
  const addPointMarker = useCallback((position: google.maps.LatLng, index: number) => {
    if (!map) return;

    const marker = new google.maps.Marker({
      position,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: index === 0 ? '#22C55E' : '#3B82F6', // Green for first, blue for others
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 1000 + index,
    });

    markersRef.current.push(marker);
  }, [map]);

  // Handle drawing mode
  useEffect(() => {
    if (!map || !isActive) return;

    // Reset state
    pointsRef.current = [];
    setClickCount(0);

    // Change cursor to crosshair
    map.setOptions({ draggableCursor: 'crosshair' });

    // Create polyline for showing the path
    const polyline = new google.maps.Polyline({
      strokeColor: '#3B82F6',
      strokeOpacity: 1,
      strokeWeight: 3,
      map: map,
    });
    polylineRef.current = polyline;

    // Click handler - add points
    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const currentCount = pointsRef.current.length;

      if (currentCount < REQUIRED_POINTS) {
        // Add point
        pointsRef.current.push(e.latLng);
        addPointMarker(e.latLng, currentCount);
        setClickCount(currentCount + 1);
        updatePolyline();

        // If we have 4 points, complete the polygon
        if (pointsRef.current.length === REQUIRED_POINTS) {
          setTimeout(() => {
            completePolygon();
          }, 100);
        }
      }
    });

    listenerRefs.current = [clickListener];

    return () => {
      map.setOptions({ draggableCursor: null });
      removeListeners();
      if (!hasPolygon) {
        cleanupDrawing();
      }
    };
  }, [map, isActive, addPointMarker, updatePolyline, completePolygon, removeListeners, cleanupDrawing, hasPolygon]);

  // Handle toggle off - cleanup
  useEffect(() => {
    if (!isActive && map) {
      map.setOptions({ draggableCursor: null });
      if (!hasPolygon) {
        cleanupDrawing();
      }
      removeListeners();
    }
  }, [isActive, map, cleanupDrawing, removeListeners, hasPolygon]);

  // Clear zone handler
  const handleClear = useCallback(() => {
    cleanupPolygon();
    cleanupDrawing();
    onClear();
    toast.info('Zona eliminada');
  }, [cleanupPolygon, cleanupDrawing, onClear]);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Drawing Toggle Button */}
      <Button
        variant={isActive ? "default" : "secondary"}
        size="sm"
        onClick={onToggle}
        className={cn(
          "shadow-lg gap-2 font-medium",
          isActive && "bg-primary text-primary-foreground"
        )}
      >
        {isActive ? (
          <>
            <X className="h-4 w-4" />
            Cancelar
          </>
        ) : (
          <>
            <Pencil className="h-4 w-4" />
            Dibujar zona
          </>
        )}
      </Button>

      {/* Clear Zone Button - only show when there's a polygon */}
      {hasPolygon && !isActive && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          className="shadow-lg gap-2 font-medium"
        >
          <Trash2 className="h-4 w-4" />
          Borrar zona
        </Button>
      )}

      {/* Drawing Instructions */}
      {isActive && (
        <div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border max-w-[200px]">
          <p className="text-xs text-muted-foreground">
            Haz clic en {REQUIRED_POINTS} puntos para definir la zona.
          </p>
          <p className="text-xs font-medium text-primary mt-1">
            {clickCount} / {REQUIRED_POINTS} puntos
          </p>
        </div>
      )}
    </div>
  );
};

export default DrawingTool;
