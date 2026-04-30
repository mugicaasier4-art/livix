import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Footprints, Bike, TrainFront, Bus, Car as CarIcon, TramFront, ExternalLink, type LucideIcon,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
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

const LocationSection = ({ residence }: { residence: Residence }) => {
  const buildings = residence.buildings ?? [];
  const hasBuildings = buildings.length > 0;
  const buildingTabs = ['todos', ...buildings.map((b) => b.label)];
  const [activeTab, setActiveTab] = useState<string>(buildingTabs[0]);

  const mapQuery = useMemo(() => {
    if (residence.coordinates) {
      return `${residence.coordinates[0]},${residence.coordinates[1]}`;
    }
    if (hasBuildings) {
      return `${buildings[0].coordinates[0]},${buildings[0].coordinates[1]}`;
    }
    return `${residence.address} ${residence.city}`;
  }, [residence.coordinates, residence.address, residence.city, buildings, hasBuildings]);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
  const externalMapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${residence.address} ${residence.city}`,
  )}`;

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
              <iframe
                title={`Mapa de ${residence.name}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={externalMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-lg transition-shadow hover:shadow-xl"
              >
                Abrir en Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
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
