import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Instagram } from 'lucide-react';
import type { Residence } from '@/data/residences';

const cleanWhatsApp = (raw?: string) => (raw ?? '').replace(/[^\d]/g, '');

const ContactFooter = ({ residence }: { residence: Residence }) => {
  const phone = residence.phone?.[0];
  const email = residence.email;
  const wa = cleanWhatsApp(residence.whatsapp);

  return (
    <section id="contact" className="border-t border-black/5 bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Hablemos cuando quieras.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Reservas, dudas, planos, contratos. Te atendemos en español o inglés.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="group rounded-2xl border border-black/5 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Phone className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="mt-5 text-sm font-medium text-muted-foreground">Llámanos</div>
              <div className="mt-1 text-lg font-semibold text-foreground">{phone}</div>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="group rounded-2xl border border-black/5 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Mail className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="mt-5 text-sm font-medium text-muted-foreground">Escríbenos</div>
              <div className="mt-1 break-all text-lg font-semibold text-foreground">{email}</div>
            </a>
          )}

          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-black/5 bg-white p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="mt-5 text-sm font-medium text-muted-foreground">WhatsApp</div>
              <div className="mt-1 text-lg font-semibold text-foreground">+{wa.slice(0, 2)} {wa.slice(2)}</div>
            </a>
          )}
        </div>

        {residence.instagram && (
          <div className="mt-10 text-center">
            <a
              href={residence.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
              Síguenos en Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactFooter;
