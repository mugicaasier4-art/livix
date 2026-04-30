import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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
  value: string;
  hint?: string;
  label: string;
  delay: number;
  isLast?: boolean;
}

const Fact = ({ value, hint, label, delay, isLast }: FactProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    className={`relative px-4 py-2 md:px-8 ${isLast ? '' : 'md:border-r md:border-black/8'}`}
  >
    <div className="flex items-baseline gap-2">
      <div className="font-poppins text-[44px] font-black leading-[0.95] tracking-tight text-foreground md:text-[64px]">
        {value}
      </div>
      {hint && (
        <span className="text-sm font-semibold text-muted-foreground md:text-base">
          {hint}
        </span>
      )}
    </div>
    <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:text-xs">
      {label}
    </div>
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
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
          <Fact
            value={ratingValue.toFixed(1)}
            hint="/ 5"
            label={`${Math.round(reviewsValue)} reseñas verificadas`}
            delay={0}
          />
          <Fact
            value={`${residence.capacity ?? '-'}`}
            label="Capacidad total"
            delay={0.05}
          />
          <Fact
            value={`${Math.round(priceValue)}€`}
            hint="/mes"
            label="Desde, IVA incluido"
            delay={0.1}
          />
          <Fact
            value={`${Math.round(universitiesValue)}`}
            label="Universidades cercanas"
            delay={0.15}
            isLast
          />
        </div>
      </div>
    </section>
  );
};

export default QuickFacts;
