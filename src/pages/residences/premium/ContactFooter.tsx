import { motion } from 'framer-motion';
import { Mail, MessageCircle, Instagram, ArrowUpRight } from 'lucide-react';
import type { Residence } from '@/data/residences';

const cleanWhatsApp = (raw?: string) => (raw ?? '').replace(/[^\d]/g, '');

const ContactFooter = ({ residence }: { residence: Residence }) => {
  const email = residence.email;
  const wa = cleanWhatsApp(residence.whatsapp);
  const waMessage = `Hola, quiero información sobre ${residence.name}`;
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(waMessage)}` : undefined;

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
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            Contacto directo
          </span>
          <h2 className="mt-3 font-poppins text-4xl font-black leading-tight tracking-tight text-foreground md:text-5xl">
            Contacta con la residencia.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Déjanos ayudarte. Te respondemos en menos de 24 horas por WhatsApp o email.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-2">
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-[#25D366]/20 bg-[#F5FBF6] p-7 transition-all hover:-translate-y-1 hover:border-[#25D366]/50 hover:shadow-xl"
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
                style={{
                  background: 'radial-gradient(ellipse at top right, rgba(37,211,102,0.18), transparent 60%)',
                }}
              />
              <div className="relative flex items-center justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <div className="relative mt-6 text-sm font-medium uppercase tracking-widest" style={{ color: '#1a8d49' }}>
                Recomendado · Respuesta más rápida
              </div>
              <div className="relative mt-1 font-poppins text-xl font-bold text-foreground">
                Habla por WhatsApp
              </div>
              <div className="relative mt-1 text-sm text-muted-foreground">
                Pre-rellenamos el mensaje y te conectamos al instante con el equipo de la residencia.
              </div>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(`Información sobre ${residence.name}`)}`}
              className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <div className="mt-6 text-sm font-medium uppercase tracking-widest text-primary">
                Email del equipo
              </div>
              <div className="mt-1 font-poppins text-xl font-bold text-foreground">
                Escribe al equipo
              </div>
              <div className="mt-1 break-all text-sm text-muted-foreground">{email}</div>
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
