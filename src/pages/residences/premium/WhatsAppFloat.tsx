import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const cleanWhatsApp = (raw?: string) => (raw ?? '').replace(/[^\d]/g, '');

interface Props {
  whatsapp?: string;
  residenceName: string;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    aria-hidden
    className={className}
    fill="currentColor"
  >
    <path d="M16.003 3C9.376 3 4 8.371 4 14.998c0 2.288.6 4.519 1.74 6.494L4 29l7.696-1.717a12.005 12.005 0 0 0 4.305.793h.005C22.629 28.076 28 22.706 28 16.078 28 9.45 22.625 3 16.003 3Zm0 22.83c-1.4 0-2.776-.343-4.001-.99l-.286-.151-4.567 1.019 1.04-4.456-.187-.301a9.853 9.853 0 0 1-1.49-5.207c0-5.456 4.443-9.892 9.495-9.892 5.061 0 9.495 4.436 9.495 9.892 0 5.46-4.434 10.086-9.499 10.086Zm5.51-7.405c-.301-.151-1.787-.881-2.064-.982-.276-.1-.477-.151-.678.151s-.778.982-.954 1.183c-.176.201-.352.226-.652.075-.301-.151-1.272-.469-2.422-1.495-.895-.798-1.5-1.785-1.677-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.352.452-.527.151-.176.201-.301.301-.502.1-.201.05-.377-.025-.527-.075-.151-.678-1.633-.928-2.235-.245-.587-.494-.508-.678-.517l-.578-.011c-.201 0-.527.075-.804.377s-1.054 1.029-1.054 2.511 1.079 2.913 1.23 3.114c.151.201 2.122 3.243 5.143 4.547.719.31 1.279.495 1.717.633.722.23 1.378.197 1.897.12.578-.087 1.787-.731 2.039-1.437.251-.706.251-1.31.176-1.437-.075-.126-.276-.201-.577-.352Z" />
  </svg>
);

const WhatsAppFloat = ({ whatsapp, residenceName }: Props) => {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissedTooltip, setDismissedTooltip] = useState(false);

  const wa = cleanWhatsApp(whatsapp);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || dismissedTooltip) return;
    const showT = setTimeout(() => setShowTooltip(true), 4500);
    const hideT = setTimeout(() => setShowTooltip(false), 9500);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, [visible, dismissedTooltip]);

  if (!wa) return null;

  const message = `Hola, quiero información sobre ${residenceName}`;
  const href = `https://wa.me/${wa}?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="whatsapp-float"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-4 z-50 flex items-end gap-2 md:bottom-8 md:right-8"
        >
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-2 hidden max-w-[240px] rounded-2xl border border-black/5 bg-white px-4 py-3 pr-9 shadow-2xl md:block"
              >
                <span className="block text-sm font-semibold text-foreground">
                  ¿Te ayudamos?
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Escríbenos por WhatsApp y te responde el equipo de la residencia.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowTooltip(false);
                    setDismissedTooltip(true);
                  }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
                  aria-label="Cerrar mensaje"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span
                  className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-black/5 bg-white"
                  aria-hidden
                />
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir WhatsApp para ${residenceName}`}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-transform hover:scale-105"
            style={{ backgroundColor: '#25D366' }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-60 transition-opacity group-hover:opacity-0"
              style={{
                animation: 'wa-pulse 2.4s ease-out infinite',
                backgroundColor: '#25D366',
              }}
              aria-hidden
            />
            <WhatsAppIcon className="relative h-7 w-7" />
          </a>
        </motion.div>
      )}
      <style>{`
        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.55; }
          70% { transform: scale(1.45); opacity: 0; }
          100% { transform: scale(1.45); opacity: 0; }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default WhatsAppFloat;
