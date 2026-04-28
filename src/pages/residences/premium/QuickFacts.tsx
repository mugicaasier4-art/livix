import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Users, Wallet, GraduationCap } from 'lucide-react';
import type { Residence } from '@/data/residences';

const useCountUp = (target: number, inView: boolean, duration = 1200) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);

  return value;
};

interface FactProps {
  icon: typeof Star;
  value: string;
  label: string;
  delay: number;
}

const Fact = ({ icon: Icon, value, label, delay }: FactProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    className="flex flex-col items-start gap-3"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
    <div className="font-poppins text-4xl font-black leading-none tracking-tight text-foreground md:text-5xl">
      {value}
    </div>
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
  </motion.div>
);

const QuickFacts = ({ residence }: { residence: Residence }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const ratingValue = useCountUp(residence.rating, inView, 900);
  const reviewsValue = useCountUp(residence.reviewCount, inView, 1100);
  const priceValue = useCountUp(residence.priceRange.min, inView, 1100);
  const universitiesValue = useCountUp(residence.nearbyUniversities?.length ?? 0, inView, 900);

  return (
    <section ref={ref} className="border-y border-black/5 bg-white py-14 md:py-20">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-6">
        <Fact
          icon={Star}
          value={`${ratingValue.toFixed(1)}`}
          label={`Valoración (${Math.round(reviewsValue)} reseñas)`}
          delay={0}
        />
        <Fact
          icon={Users}
          value={`${residence.capacity ?? '-'}`}
          label="Capacidad total"
          delay={0.05}
        />
        <Fact
          icon={Wallet}
          value={`${Math.round(priceValue)}€`}
          label="Desde, IVA incluido"
          delay={0.1}
        />
        <Fact
          icon={GraduationCap}
          value={`${Math.round(universitiesValue)}`}
          label="Universidades cercanas"
          delay={0.15}
        />
      </div>
    </section>
  );
};

export default QuickFacts;
