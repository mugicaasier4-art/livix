import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RequestInfoDialog from './RequestInfoDialog';
import type { Residence } from '@/data/residences';

const useIsBelowXl = () => {
  const [below, setBelow] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < 1280,
  );
  useEffect(() => {
    const onResize = () => setBelow(window.innerWidth < 1280);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return below;
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const StickyBookingWidget = ({ residence }: { residence: Residence }) => {
  const isBelowXl = useIsBelowXl();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setVisible(y > (typeof window !== 'undefined' ? window.innerHeight * 0.6 : 600));
  });

  const handleSubmit = () => setOpen(true);
  const handleDismiss = () => setDismissed(true);

  if (isBelowXl) {
    return (
      <>
        <AnimatePresence>
          {visible && !dismissed && (
            <motion.div
              key="mobile-bar"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Desde
                  </div>
                  <div className="font-poppins text-xl font-black leading-none text-foreground">
                    {formatPrice(residence.priceRange.min)}
                    <span className="text-sm font-medium text-muted-foreground">/mes</span>
                  </div>
                </div>
                <Button onClick={handleSubmit} size="lg" className="h-12 px-5 font-semibold">
                  Pide info
                </Button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <RequestInfoDialog open={open} onOpenChange={setOpen} residence={residence} />
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {visible && !dismissed && (
          <motion.div
            key="desktop-card"
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto fixed right-6 top-28 z-30 hidden w-[340px] xl:block"
          >
            <Card className="relative overflow-hidden border-black/5 shadow-2xl">
              <span
                className="absolute inset-x-0 top-0 z-10 h-[3px]"
                style={{ background: 'linear-gradient(90deg, #B8902F 0%, #E5BE5C 50%, #B8902F 100%)' }}
              />
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Cerrar"
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="bg-gradient-to-br from-primary to-[#3a8fc0] p-5 pr-12 pt-6 text-white">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: '#E5BE5C' }} />
                  La mejor residencia · {residence.city.split(',')[0]}
                </div>
                <div className="mt-3 font-poppins text-[34px] font-black leading-none tracking-tight">
                  {formatPrice(residence.priceRange.min)}
                  <span className="ml-1 text-sm font-medium text-white/80">/mes IVA inc.</span>
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ¿Quieres conocer disponibilidad, contratos o visitar la residencia? Te
                  contactamos en menos de 24 horas.
                </p>

                <Button onClick={handleSubmit} size="lg" className="h-12 w-full text-base font-semibold">
                  Pide más info
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Sin compromiso. Sin formularios largos.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <RequestInfoDialog open={open} onOpenChange={setOpen} residence={residence} />
    </>
  );
};

export default StickyBookingWidget;
