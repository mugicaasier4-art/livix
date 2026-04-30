import { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import PremiumHero from './premium/PremiumHero';
import PremiumNav from './premium/PremiumNav';
import QuickFacts from './premium/QuickFacts';
import PremiumGallery from './premium/PremiumGallery';
import RoomTypes from './premium/RoomTypes';
import AmenitiesGrid from './premium/AmenitiesGrid';
import AllInclusiveBanner from './premium/AllInclusiveBanner';
import LocationSection from './premium/LocationSection';
import ReviewsSection from './premium/ReviewsSection';
import FAQAccordion from './premium/FAQAccordion';
import StickyBookingWidget from './premium/StickyBookingWidget';
import ContactFooter from './premium/ContactFooter';
import RequestInfoDialog from './premium/RequestInfoDialog';
import WhatsAppFloat from './premium/WhatsAppFloat';
import type { Residence } from '@/data/residences';

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

const NodisPremiumDetail = ({ residence }: { residence: Residence }) => {
  const [requestOpen, setRequestOpen] = useState(false);
  const [prefillRoom, setPrefillRoom] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [residence.id]);

  const openRequest = useCallback(() => {
    setPrefillRoom(undefined);
    setRequestOpen(true);
  }, []);

  const openRequestForRoom = useCallback((roomName: string) => {
    setPrefillRoom(roomName);
    setRequestOpen(true);
  }, []);

  const goToGallery = useCallback(() => scrollToId('gallery'), []);
  const handleAnchor = useCallback((id: string) => scrollToId(id), []);

  return (
    <Layout>
      <SEOHead
        title={`${residence.name} | Livix`}
        description={residence.tagline ?? residence.description}
        canonical={`https://livix.es/residences/${residence.id}`}
      />

      <PremiumNav
        residenceName={residence.name}
        onAnchorClick={handleAnchor}
        onBook={openRequest}
      />

      <PremiumHero
        residence={residence}
        onScrollToGallery={goToGallery}
        onBook={openRequest}
      />

      <QuickFacts residence={residence} />

      <PremiumGallery
        categories={residence.galleryCategories}
        fallbackImages={residence.images}
        residenceName={residence.name}
      />

      <RoomTypes rooms={residence.roomTypes} onRequestInfo={openRequestForRoom} />

      <AmenitiesGrid services={residence.services} />

      <AllInclusiveBanner items={residence.allInclusive} />

      <LocationSection residence={residence} />

      <ReviewsSection reviews={residence.demoReviews} />

      <FAQAccordion faqs={residence.faqs} />

      <ContactFooter residence={residence} />

      <StickyBookingWidget residence={residence} />

      <WhatsAppFloat whatsapp={residence.whatsapp} residenceName={residence.name} />

      <RequestInfoDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        residence={residence}
        prefillRoom={prefillRoom}
      />
    </Layout>
  );
};

export default NodisPremiumDetail;
