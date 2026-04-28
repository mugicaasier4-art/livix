import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Crown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_LINKS = [
  { id: 'gallery', label: 'Galería' },
  { id: 'rooms', label: 'Habitaciones' },
  { id: 'services', label: 'Servicios' },
  { id: 'location', label: 'Ubicación' },
  { id: 'reviews', label: 'Reseñas' },
];

interface Props {
  residenceName: string;
  onAnchorClick: (id: string) => void;
  onBook: () => void;
}

const PremiumNav = ({ residenceName, onAnchorClick, onBook }: Props) => {
  const [visible, setVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600;
    setVisible(y > threshold);
  });

  const handleAnchor = (id: string) => {
    setDrawerOpen(false);
    onAnchorClick(id);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="premium-nav"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 right-0 top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-xl"
        >
          <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <span className="font-poppins text-lg font-black tracking-tight text-foreground">
                Livix
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white"
                style={{ background: 'linear-gradient(135deg, #C9A03A 0%, #E5BE5C 100%)' }}
              >
                <Crown className="h-2.5 w-2.5" strokeWidth={2.5} />
                Premium
              </span>
              <span className="hidden text-sm text-muted-foreground md:inline">
                · {residenceName}
              </span>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleAnchor(link.id)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground"
                  type="button"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={onBook} className="h-10 px-5 font-semibold">
                Reservar
              </Button>
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <div className="mt-8 flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => handleAnchor(link.id)}
                        className="rounded-lg px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-black/5"
                        type="button"
                      >
                        {link.label}
                      </button>
                    ))}
                    <Button onClick={() => { setDrawerOpen(false); onBook(); }} className="mt-4 h-12 font-semibold">
                      Reservar
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default PremiumNav;
