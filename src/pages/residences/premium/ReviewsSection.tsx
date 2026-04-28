import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PremiumDemoReview } from '@/data/residences';

interface Props {
  reviews?: PremiumDemoReview[];
}

const ReviewsSection = ({ reviews }: Props) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-[#F8F8F8] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Voces de residentes
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Lo que dicen quienes ya viven aquí.
          </h2>
          <Badge
            variant="outline"
            className="mt-5 border-dashed bg-white/60 text-xs font-medium italic text-muted-foreground"
          >
            Reseñas demo, datos de prueba para presentación
          </Badge>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <Card className="h-full border-black/5 bg-white shadow-sm transition-shadow hover:shadow-xl">
                <CardContent className="flex h-full flex-col p-7">
                  <Quote className="h-7 w-7 text-primary/30" strokeWidth={1.5} />

                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < review.rating
                            ? 'h-4 w-4 fill-[#FFC107] text-[#FFC107]'
                            : 'h-4 w-4 text-black/15'
                        }
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>

                  <p className="mt-5 flex-1 text-base italic leading-relaxed text-foreground/85">
                    {review.text}
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-poppins text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${idx % 2 === 0 ? '#B8902F' : '#5DB4EE'} 0%, ${idx % 2 === 0 ? '#8B6F1F' : '#3a8fc0'} 100%)`,
                      }}
                    >
                      {review.author.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-poppins text-base font-semibold text-foreground">
                        {review.author}
                      </div>
                      {review.university && (
                        <div className="mt-0.5 truncate text-sm text-muted-foreground">
                          {review.university}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
