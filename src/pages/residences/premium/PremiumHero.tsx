import { motion } from 'framer-motion';
import { MapPin, Crown, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Residence } from '@/data/residences';

interface Props {
  residence: Residence;
  onScrollToGallery: () => void;
  onBook: () => void;
}

const PremiumHero = ({ residence, onScrollToGallery, onBook }: Props) => {
  const heroImage =
    residence.heroImage ?? residence.images?.[0] ?? residence.galleryCategories?.[0]?.images?.[0];

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      {/* Background image */}
      {heroImage && (
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt={residence.name}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="auto"
          />
        </motion.div>
      )}

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 88%, rgba(0,0,0,0.7) 100%)',
        }}
        aria-hidden
      />

      {/* Top brand row */}
      <div className="absolute left-0 right-0 top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <span className="font-poppins text-xl font-black tracking-tight text-white">
              Livix
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white shadow-md backdrop-blur"
              style={{ background: 'linear-gradient(135deg, #C9A03A 0%, #E5BE5C 100%)' }}
            >
              <Crown className="h-3 w-3" strokeWidth={2.5} />
              Plan Premium
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex items-end pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="max-w-3xl"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-white/80"
            >
              <MapPin className="h-4 w-4" strokeWidth={2} />
              {residence.city}
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="mt-4 font-poppins text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl"
            >
              {residence.name}
            </motion.h1>

            {residence.tagline && (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-white/85 md:text-xl"
              >
                {residence.tagline}
              </motion.p>
            )}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                onClick={onBook}
                size="lg"
                className="h-14 bg-white px-8 text-base font-semibold text-foreground shadow-xl hover:bg-white/90"
              >
                Reservar visita
              </Button>
              <Button
                onClick={onScrollToGallery}
                size="lg"
                variant="outline"
                className="h-14 border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                Ver galería
              </Button>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.6, delay: 0.6 } },
              }}
              className="mt-8 flex items-center gap-2 text-sm text-white/65"
            >
              <span className="font-medium">{residence.address}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        onClick={onScrollToGallery}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/70 transition-colors hover:text-white md:flex"
        aria-label="Ver galería"
      >
        <span>Desplaza para descubrir</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex"
        >
          <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
        </motion.span>
      </motion.button>
    </section>
  );
};

export default PremiumHero;
