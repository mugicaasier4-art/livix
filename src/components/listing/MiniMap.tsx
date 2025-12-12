import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';
import { useMemo, useCallback, useState } from 'react';

interface MiniMapProps {
  coordinates: [number, number]; // [lng, lat]
  title: string;
  address: string;
}

const MiniMap = ({ coordinates, title, address }: MiniMapProps) => {
  const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
  const [mapReady, setMapReady] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: 'google-map-script',
  });

  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '200px',
    borderRadius: '8px',
  }), []);

  const center = useMemo(() => ({
    lat: coordinates[1],
    lng: coordinates[0],
  }), [coordinates]);

  const mapOptions: google.maps.MapOptions = useMemo(() => ({
    zoom: 15,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: GOOGLE_MAPS_CONFIG.mapStyles,
  }), []);

  const onLoad = useCallback((map: google.maps.Map) => {
    map.addListener('idle', () => {
      setMapReady(true);
    });
  }, []);

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`;
    window.open(url, '_blank');
  };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Ubicación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-3">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
          <div>
            <h4 className="font-medium mb-1">Mapa no disponible</h4>
            <p className="text-sm text-muted-foreground">
              Configura tu API key de Google Maps
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Ubicación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-3">
          <MapPin className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm text-muted-foreground">Error al cargar el mapa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Ubicación</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isLoaded ? (
          <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            options={mapOptions}
            onLoad={onLoad}
          >
            {mapReady && (
              <Marker 
                position={center}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: 'hsl(var(--primary))',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3,
                }}
              />
            )}
          </GoogleMap>
        )}
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-sm text-muted-foreground break-words">{address}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={handleOpenGoogleMaps}
          >
            <ExternalLink className="h-4 w-4" />
            Abrir en Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniMap;
