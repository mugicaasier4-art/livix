import { motion } from 'framer-motion';
import {
  Wifi, Dumbbell, Waves, Film, BookOpen, Sofa, Trees, Leaf, Sparkles, Shirt,
  Car, Bike, Smartphone, Bell, Coffee, ChefHat, KeyRound, Wrench, Gamepad2,
  GraduationCap, ShieldCheck, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  'wifi alta velocidad': Wifi,
  'wifi gratis': Wifi,
  'wifi': Wifi,
  'gimnasio': Dumbbell,
  'gimnasio premium': Dumbbell,
  'piscina': Waves,
  'sala de cine': Film,
  'biblioteca': BookOpen,
  'salón privado': Sofa,
  'terraza': Trees,
  'terraza con vistas': Trees,
  'jardín exterior': Leaf,
  'limpieza opcional': Sparkles,
  'lavandería': Shirt,
  'lavandería autoservicio': Shirt,
  'parking': Car,
  'parking de bicis': Bike,
  'domótica': Smartphone,
  'recepción 24h': Bell,
  'vending': Coffee,
  'food lab': ChefHat,
  'control de accesos centralizado': KeyRound,
  'mantenimiento': Wrench,
  'gaming zone': Gamepad2,
  'sala de estudio': GraduationCap,
  'salas de estudio': GraduationCap,
  'cctv 24h': ShieldCheck,
  'smart tv': Film,
  'kitchenette': ChefHat,
  'baño privado': Sparkles,
};

const pickIcon = (label: string): LucideIcon => {
  const key = label.toLowerCase().trim();
  return ICON_MAP[key] ?? Sparkles;
};

interface Props {
  services: string[];
}

const AmenitiesGrid = ({ services }: Props) => {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Servicios y comodidades
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Todo lo que necesitas, ya está aquí.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Espacios diseñados para que solo te preocupes de estudiar, descansar y disfrutar.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
        >
          {services.map((service) => {
            const Icon = pickIcon(service);
            return (
              <motion.div
                key={service}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg md:flex-col md:items-start md:gap-4 md:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white md:h-12 md:w-12">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="font-poppins text-sm font-semibold leading-tight text-foreground md:text-base">
                  {service}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AmenitiesGrid;
