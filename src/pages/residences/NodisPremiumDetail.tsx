import { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PremiumHero from './premium/PremiumHero';
import PremiumNav from './premium/PremiumNav';
import QuickFacts from './premium/QuickFacts';
import PremiumGallery from './premium/PremiumGallery';
import RoomTypes from './premium/RoomTypes';
import AmenitiesGrid from './premium/AmenitiesGrid';
import AllInclusiveBanner from './premium/AllInclusiveBanner';
import LocationSection from './premium/LocationSection';
import VirtualTourCTA from './premium/VirtualTourCTA';
import ReviewsSection from './premium/ReviewsSection';
import FAQAccordion from './premium/FAQAccordion';
import StickyBookingWidget from './premium/StickyBookingWidget';
import ContactFooter from './premium/ContactFooter';
import type { Residence } from '@/data/residences';

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

const NodisPremiumDetail = ({ residence }: { residence: Residence }) => {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [residence.id]);

  const openBooking = useCallback(() => setBookingOpen(true), []);
  const goToGallery = useCallback(() => scrollToId('gallery'), []);
  const handleAnchor = useCallback((id: string) => scrollToId(id), []);

  return (
    <Layout>
      <SEOHead
        title={`${residence.name} | Premium en Livix`}
        description={residence.tagline ?? residence.description}
        canonical={`https://livix.es/residences/${residence.id}`}
      />

      <PremiumNav
        residenceName={residence.name}
        onAnchorClick={handleAnchor}
        onBook={openBooking}
      />

      <PremiumHero
        residence={residence}
        onScrollToGallery={goToGallery}
        onBook={openBooking}
      />

      <QuickFacts residence={residence} />

      <PremiumGallery
        categories={residence.galleryCategories}
        fallbackImages={residence.images}
        residenceName={residence.name}
      />

      <RoomTypes rooms={residence.roomTypes} bookingUrl={residence.bookingUrl} />

      <AmenitiesGrid services={residence.services} />

      <AllInclusiveBanner items={residence.allInclusive} />

      <LocationSection residence={residence} />

      <VirtualTourCTA bookingUrl={residence.bookingUrl} />

      <ReviewsSection reviews={residence.demoReviews} />

      <FAQAccordion faqs={residence.faqs} />

      <ContactFooter residence={residence} />

      <StickyBookingWidget residence={residence} />

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div
              className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white"
              style={{ background: 'linear-gradient(135deg, #B8902F 0%, #8B6F1F 100%)' }}
            >
              Reserva Premium
            </div>
            <DialogTitle className="font-poppins text-2xl font-black leading-tight">
              Reserva una visita en {residence.name}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              En la versión real conectamos este flujo con el motor de reservas de la residencia.
              Para esta vista previa, tu solicitud llegaría a{' '}
              <span className="font-medium text-foreground">{residence.email}</span> y nuestro
              equipo responde en menos de 24 horas.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-black/5 bg-[#FAFAF7] p-4 text-sm leading-relaxed text-foreground">
            <strong className="block font-semibold text-foreground">Lo que pasa después:</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>· Confirmación inmediata por email</li>
              <li>· Selector de habitación con disponibilidad real</li>
              <li>· Pago seguro de fianza con Stripe</li>
              <li>· Acceso a tu panel de residente en Livix</li>
            </ul>
          </div>
          <Button onClick={() => setBookingOpen(false)} className="w-full">
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NodisPremiumDetail;
