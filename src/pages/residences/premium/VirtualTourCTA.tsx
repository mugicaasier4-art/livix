import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Video } from 'lucide-react';

interface Props {
  bookingUrl?: string;
}

const VirtualTourCTA = ({ bookingUrl }: Props) => {
  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-28">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center text-white"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Video className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>

          <h2 className="font-poppins text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Reserva una visita virtual
          </h2>

          <p className="mt-5 text-lg text-white/85 md:text-xl">
            Conoce cada rincón antes de decidir. Tour 1 a 1 con nuestro equipo de Reservas, sin compromiso.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-base font-semibold shadow-xl"
            >
              <a href={bookingUrl ?? '#booking'} target="_blank" rel="noopener noreferrer">
                <CalendarCheck className="mr-2 h-5 w-5" />
                Agendar visita virtual
              </a>
            </Button>
            <span className="text-sm text-white/70">Slots de 20 minutos, en español o inglés.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTourCTA;
