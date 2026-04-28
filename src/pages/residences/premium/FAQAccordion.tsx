import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { PremiumFaq } from '@/data/residences';

interface Props {
  faqs?: PremiumFaq[];
}

const FAQAccordion = ({ faqs }: Props) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Preguntas frecuentes
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Lo que la gente nos pregunta.
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-black/10 last:border-b-0"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-semibold text-foreground hover:no-underline md:text-xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
