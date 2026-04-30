import { useEffect, useState } from 'react';
import { Sparkles, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Residence } from '@/data/residences';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residence: Residence;
  prefillRoom?: string;
}

const cleanWhatsApp = (raw?: string) => (raw ?? '').replace(/[^\d]/g, '');

const RequestInfoDialog = ({ open, onOpenChange, residence, prefillRoom }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && prefillRoom) {
      setMessage((prev) =>
        prev
          ? prev
          : `Me interesa la "${prefillRoom}". ¿Hay disponibilidad para el próximo curso?`,
      );
    }
  }, [open, prefillRoom]);

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Necesitamos al menos tu nombre y email para responderte.');
      return;
    }
    setSubmitting(true);
    // Demo: simulate network delay
    await new Promise((res) => setTimeout(res, 600));
    setSubmitting(false);
    onOpenChange(false);
    toast.success('Solicitud enviada', {
      description: `${residence.name} te contactará en menos de 24 horas a ${email}.`,
    });
    reset();
  };

  const wa = cleanWhatsApp(residence.whatsapp);
  const waMessage = `Hola, quiero información sobre ${residence.name}`;
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(waMessage)}` : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div
            className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
            style={{ background: 'linear-gradient(135deg, #B8902F 0%, #8B6F1F 100%)' }}
          >
            <Sparkles className="h-3 w-3" />
            Solicita información
          </div>
          <DialogTitle className="font-poppins text-2xl font-black leading-tight">
            Contacta con {residence.name}
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Déjanos ayudarte. Cuéntanos qué necesitas y el equipo de la residencia te responde en
            menos de 24 horas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rid-name">Nombre y apellidos</Label>
              <Input
                id="rid-name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rid-email">Email</Label>
              <Input
                id="rid-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rid-phone">Teléfono (opcional)</Label>
            <Input
              id="rid-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 ..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rid-message">¿En qué podemos ayudarte?</Label>
            <Textarea
              id="rid-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="¿Cuándo te gustaría entrar? ¿Qué tipo de habitación buscas?"
              rows={4}
            />
          </div>

          <Button type="submit" size="lg" className="h-12 w-full text-base font-semibold" disabled={submitting}>
            {submitting ? 'Enviando…' : 'Enviar solicitud'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Al enviar aceptas que {residence.name} te contacte por email o teléfono.
          </p>
        </form>

        <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground">¿Prefieres hablar directamente?</span>
          <div className="flex gap-2">
            {waHref && (
              <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
              <a href={`mailto:${residence.email}`}>
                <Mail className="h-4 w-4" />
                Email
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestInfoDialog;
