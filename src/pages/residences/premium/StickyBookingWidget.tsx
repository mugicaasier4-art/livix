import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Calendar, BedDouble, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
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
                  Reservar
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
        <BookingDialog open={open} onOpenChange={setOpen} residence={residence} />
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
                  Premium · Reserva ahora
                </div>
                <div className="mt-3 font-poppins text-[34px] font-black leading-none tracking-tight">
                  {formatPrice(residence.priceRange.min)}
                  <span className="ml-1 text-sm font-medium text-white/80">/mes IVA inc.</span>
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Llegada" placeholder="Sept 2026" icon={<Calendar className="h-4 w-4" />} />
                  <Field label="Salida" placeholder="Jun 2027" icon={<Calendar className="h-4 w-4" />} />
                </div>
                <Field
                  label="Tipo de habitación"
                  placeholder={residence.roomTypes?.[0]?.name ?? 'Estudio individual'}
                  icon={<BedDouble className="h-4 w-4" />}
                />

                <Button onClick={handleSubmit} size="lg" className="h-12 w-full text-base font-semibold">
                  Reservar ahora
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Reserva 100% reembolsable los primeros 7 días.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <BookingDialog open={open} onOpenChange={setOpen} residence={residence} />
    </>
  );
};

interface FieldProps {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}

const Field = ({ label, placeholder, icon }: FieldProps) => (
  <div className="rounded-xl border border-black/10 bg-[#FAFAFA] px-3 py-2 transition-colors hover:border-primary/40">
    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
    </div>
    <div className="mt-0.5 flex items-center gap-2 text-sm font-medium text-foreground">
      <span className="text-muted-foreground">{icon}</span>
      <span>{placeholder}</span>
    </div>
  </div>
);

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residence: Residence;
}

const BookingDialog = ({ open, onOpenChange, residence }: DialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div
          className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
          style={{ background: 'linear-gradient(135deg, #B8902F 0%, #8B6F1F 100%)' }}
        >
          <Sparkles className="h-3 w-3" /> Reserva Premium
        </div>
        <DialogTitle className="font-poppins text-2xl font-black leading-tight">
          Reserva tu plaza en {residence.name}
        </DialogTitle>
        <DialogDescription className="text-base leading-relaxed">
          En la versión real conectamos este formulario con el motor de reservas de la
          residencia. Para esta vista previa, tu solicitud llegaría a{' '}
          <span className="font-medium text-foreground">{residence.email}</span> y un agente
          de Livix responde en menos de 24 horas.
        </DialogDescription>
      </DialogHeader>
      <div className="rounded-xl border border-black/5 bg-[#FAFAF7] p-4 text-sm leading-relaxed text-foreground">
        <strong className="block font-semibold text-foreground">Lo que pasa después:</strong>
        <ul className="mt-2 space-y-1 text-muted-foreground">
          <li>· Confirmación inmediata por email</li>
          <li>· Selector de habitación con disponibilidad real</li>
          <li>· Pago seguro de fianza con Stripe</li>
        </ul>
      </div>
      <Button onClick={() => onOpenChange(false)} className="w-full">
        Entendido
      </Button>
    </DialogContent>
  </Dialog>
);

export default StickyBookingWidget;
