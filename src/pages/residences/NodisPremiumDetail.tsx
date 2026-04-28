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

      <div className="xl:pr-[372px]">
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
      </div>

      <ContactFooter residence={residence} />

      <StickyBookingWidget residence={residence} />

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-poppins text-2xl font-black">
              Solicitud de reserva
            </DialogTitle>
            <DialogDescription className="text-base">
              En producción, este flujo llevaría al motor de reservas conectado a {residence.email}.
              En esta demo, simulamos el envío para mostrar la experiencia premium.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
            <strong className="block font-semibold">¿Qué pasaría a continuación?</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Confirmación inmediata por email</li>
              <li>Selector de habitación con disponibilidad real</li>
              <li>Pago seguro de fianza con Stripe</li>
              <li>Acceso a tu panel de residente en Livix</li>
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
