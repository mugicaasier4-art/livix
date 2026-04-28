import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  items?: string[];
}

const AllInclusiveBanner = ({ items }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#F8F8F8] py-20 md:py-28">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Todo incluido
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Sin sustos, sin gastos extra.
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Una sola cuota mensual cubre toda la experiencia premium. Sin facturas sueltas, sin gastos de comunidad, sin sorpresas.
          </p>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="space-y-4"
        >
          {items.map((item) => (
            <motion.li
              key={item}
              variants={{
                hidden: { opacity: 0, x: 12 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="flex items-start gap-4"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
              </span>
              <span className="pt-1 text-base font-medium text-foreground md:text-lg">{item}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default AllInclusiveBanner;
