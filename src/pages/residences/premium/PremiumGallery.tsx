import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { PremiumGalleryCategory } from '@/data/residences';

interface Props {
  categories?: PremiumGalleryCategory[];
  fallbackImages?: string[];
  residenceName: string;
}

const PremiumGallery = ({ categories, fallbackImages, residenceName }: Props) => {
  const effectiveCategories: PremiumGalleryCategory[] =
    categories && categories.length > 0
      ? categories
      : fallbackImages && fallbackImages.length > 0
      ? [{ id: 'all', label: 'Galería', images: fallbackImages }]
      : [];

  const [activeTab, setActiveTab] = useState(effectiveCategories[0]?.id ?? 'all');
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const closeLightbox = () => setLightbox(null);
  const next = () =>
    setLightbox((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s));
  const prev = () =>
    setLightbox((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s));

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  if (effectiveCategories.length === 0) return null;

  return (
    <section id="gallery" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">Galería</span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Mira de cerca cómo es vivir aquí.
          </h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
          <TabsList className="mr-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-black/5 bg-white p-1 shadow-sm">
            {effectiveCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-foreground data-[state=active]:text-white data-[state=active]:shadow"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {effectiveCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-10">
              <GalleryGrid
                images={cat.images}
                residenceName={residenceName}
                onOpen={(index) => setLightbox({ images: cat.images, index })}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-10"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox.index}
                src={lightbox.images[lightbox.index]}
                alt={`${residenceName} ${lightbox.index + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
              />
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface GridProps {
  images: string[];
  residenceName: string;
  onOpen: (index: number) => void;
}

// Tile sizing pattern repeats every 6 images and produces a clean 3-col grid:
// row 1: [BIG (2x2)] [small] [small]
// row 2:           [small] [small]
// row 3: [small] [small] [small]
// no orphans because every block of 6 fills 2 full rows of the 3-column grid.
const TILE_PATTERN: Array<'big' | 'small'> = ['big', 'small', 'small', 'small', 'small', 'small'];

const GalleryGrid = ({ images, residenceName, onOpen }: GridProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      className="grid auto-rows-[120px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-3 md:gap-4 lg:auto-rows-[210px]"
    >
      {images.map((src, index) => {
        const tile = TILE_PATTERN[index % TILE_PATTERN.length];
        const isBig = tile === 'big';
        return (
          <motion.button
            key={src + index}
            type="button"
            onClick={() => onOpen(index)}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
            className={cn(
              'group relative overflow-hidden rounded-2xl bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-primary',
              isBig ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : ''
            )}
            aria-label={`Imagen ${index + 1} de ${residenceName}`}
          >
            <img
              src={src}
              alt={`${residenceName} ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default PremiumGallery;
