import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import {
  MapPin, Footprints, Bike, TrainFront, Bus, Car as CarIcon, TramFront, Loader2, ExternalLink, type LucideIcon,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { GOOGLE_MAPS_CONFIG } from '@/config/maps';
import type { Residence, PremiumNearbyUniversity } from '@/data/residences';

const MODE_ICONS: Record<PremiumNearbyUniversity['mode'], LucideIcon> = {
  walk: Footprints,
  bike: Bike,
  metro: TrainFront,
  bus: Bus,
  car: CarIcon,
  tram: TramFront,
  transit: MapPin,
};

const mapContainerStyle = { width: '100%', height: '100%' };

const LocationSection = ({ residence }: { residence: Residence }) => {
  const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded || loadError) return;
    const t = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(t);
  }, [isLoaded, loadError]);

  const showFallback = !apiKey || !!loadError || (timedOut && !isLoaded);

  const buildings = residence.buildings ?? [];
  const hasBuildings = buildings.length > 0;
  const buildingTabs = ['todos', ...buildings.map((b) => b.label)];
  const [activeTab, setActiveTab] = useState<string>(buildingTabs[0]);

  const center = useMemo(() => {
    if (residence.coordinates) {
      return { lat: residence.coordinates[0], lng: residence.coordinates[1] };
    }
    if (hasBuildings) {
      return { lat: buildings[0].coordinates[0], lng: buildings[0].coordinates[1] };
    }
    return { lat: GOOGLE_MAPS_CONFIG.defaultCenter.lat, lng: GOOGLE_MAPS_CONFIG.defaultCenter.lng };
  }, [residence.coordinates, buildings, hasBuildings]);

  const filteredUniversities = useMemo(() => {
    const list = residence.nearbyUniversities ?? [];
    if (!hasBuildings || activeTab === 'todos') return list;
    return list.filter((u) => u.building === activeTab);
  }, [residence.nearbyUniversities, activeTab, hasBuildings]);

  return (
    <section id="location" className="bg-[#F8F8F8] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Ubicación
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            En el corazón de la vida universitaria.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg lg:col-span-3"
          >
            <div className="relative h-[420px] w-full md:h-[520px]">
              {isLoaded && !showFallback ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={14}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    styles: GOOGLE_MAPS_CONFIG.mapStyles,
                  }}
                >
                  {hasBuildings ? (
                    buildings.map((b) => (
                      <Marker
                        key={b.label}
                        position={{ lat: b.coordinates[0], lng: b.coordinates[1] }}
                        title={b.label}
                      />
                    ))
                  ) : residence.coordinates ? (
                    <Marker
                      position={{ lat: residence.coordinates[0], lng: residence.coordinates[1] }}
                      title={residence.name}
                    />
                  ) : null}
                </GoogleMap>
              ) : showFallback ? (
                <div
                  className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-cover bg-center p-8 text-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(248,248,248,0.85), rgba(248,248,248,0.85)), url(https://maps.googleapis.com/maps/api/staticmap?size=1&zoom=1)',
                  }}
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: 'rgba(93,180,238,0.12)', color: '#5DB4EE' }}
                  >
                    <MapPin className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-poppins text-lg font-bold text-foreground">
                      {residence.address}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {residence.postalCode} {residence.city}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="lg" className="mt-2 h-12 gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${residence.address} ${residence.city}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en Google Maps
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F0F0F0]">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Dirección
              </div>
              <div className="mt-2 font-poppins text-lg font-bold leading-snug text-foreground">
                {residence.address}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {residence.postalCode} {residence.city}
              </div>

              {hasBuildings && (
                <div className="mt-5 grid gap-3">
                  {buildings.map((b) => (
                    <div key={b.label} className="rounded-xl bg-[#F8F8F8] p-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {b.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">{b.address}</div>
                      <div className="text-xs text-muted-foreground">{b.postalCode}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="border-b border-black/5 p-6">
                <div className="font-poppins text-lg font-bold text-foreground">
                  Universidades cercanas
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {filteredUniversities.length} centros con conexión rápida.
                </div>

                {hasBuildings && (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-3 bg-[#F8F8F8]">
                      {buildingTabs.map((label) => (
                        <TabsTrigger key={label} value={label} className="text-xs">
                          {label === 'todos' ? 'Todos' : label.replace('Edificio ', 'Edif. ')}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              </div>

              <ScrollArea className="h-[320px]">
                <ul className="divide-y divide-black/5">
                  {filteredUniversities.map((uni, idx) => {
                    const Icon = MODE_ICONS[uni.mode] ?? MapPin;
                    return (
                      <li key={`${uni.name}-${idx}`} className="flex items-start gap-4 px-6 py-4">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-poppins text-sm font-semibold leading-snug text-foreground">
                            {uni.name}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{uni.distance}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
