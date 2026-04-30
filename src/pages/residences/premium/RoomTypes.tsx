import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { PremiumRoomType } from '@/data/residences';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

interface Props {
  rooms?: PremiumRoomType[];
  onRequestInfo?: (roomName: string) => void;
}

const RoomTypes = ({ rooms, onRequestInfo }: Props) => {
  if (!rooms || rooms.length === 0) return null;

  return (
    <section id="rooms" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Tipos de habitación
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Elige el espacio que va contigo.
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-12 space-y-6"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.name}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <Card className="grid overflow-hidden border-black/5 shadow-sm transition-shadow hover:shadow-xl md:grid-cols-5">
                <div className="relative h-64 overflow-hidden md:col-span-2 md:h-full">
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={room.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#F0F0F0]" />
                  )}
                  {room.size && (
                    <Badge className="absolute left-4 top-4 border-0 bg-white/95 text-foreground shadow-md backdrop-blur">
                      {room.size}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col p-7 md:col-span-3 md:p-10">
                  <h3 className="font-poppins text-2xl font-bold leading-tight text-foreground md:text-3xl">
                    {room.name}
                  </h3>
                  {room.description && (
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {room.description}
                    </p>
                  )}

                  {room.includes && room.includes.length > 0 && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {room.includes.map((inc) => (
                        <li key={inc} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-7 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Desde
                      </div>
                      <div className="font-poppins text-3xl font-black leading-none text-primary">
                        {formatPrice(room.priceFrom)}
                        <span className="text-sm font-medium text-muted-foreground"> /mes</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="lg"
                      className="h-12 px-6 font-semibold"
                      onClick={() => onRequestInfo?.(room.name)}
                    >
                      Pide info de esta habitación
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RoomTypes;
