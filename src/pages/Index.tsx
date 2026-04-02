import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import Hero from "@/components/sections/Hero";
import TrustBanner from "@/components/sections/TrustBanner";
import Features from "@/components/sections/Features";
import AnimatedStats from "@/components/sections/AnimatedStats";
import FeaturedListings from "@/components/sections/FeaturedListings";
import CategoryCTA from "@/components/sections/CategoryCTA";
import TestimonialSection from "@/components/sections/TestimonialSection";
import HomeFAQ from "@/components/sections/HomeFAQ";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // After Google OAuth redirect, restore the original destination
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('returnTo');
    if (returnTo && user) {
      navigate(decodeURIComponent(returnTo), { replace: true });
    }
  }, [user, navigate]);

  return (
    <Layout>
      <SEOHead
        title="Livix - Alojamiento Universitario en Zaragoza | Pisos, Habitaciones y Residencias"
        description="Encuentra pisos, habitaciones y residencias universitarias verificadas en Zaragoza. Marketplace de alojamiento para estudiantes. Busca, compara y reserva online."
        canonical="https://livix.es/"
        ogImage="https://livix.es/og-livix.jpg"
      />
      <Hero />
      <TrustBanner />
      <AnimatedStats />
      <Features />
      <FeaturedListings />
      <TestimonialSection />
      <CategoryCTA />
      <HomeFAQ />
    </Layout>
  );
};

export default Index;
