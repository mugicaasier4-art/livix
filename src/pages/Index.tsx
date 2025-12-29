import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import AnimatedStats from "@/components/sections/AnimatedStats";
import FeaturedListings from "@/components/sections/FeaturedListings";
import CategoryCTA from "@/components/sections/CategoryCTA";
import PremiumCTA from "@/components/sections/PremiumCTA";
import ClubCTA from "@/components/sections/ClubCTA";
import BlogCTA from "@/components/sections/BlogCTA";
import HomeFAQ from "@/components/sections/HomeFAQ";

const Index = () => {
  return (
    <Layout>
      {/* Hero with rotating text */}
      <Hero />

      {/* Animated stats counter */}
      <AnimatedStats />

      {/* Features with premium cards */}
      <Features />

      {/* Featured listings */}
      <FeaturedListings />

      {/* Premium CTA */}
      <PremiumCTA />

      {/* Category CTA */}
      <CategoryCTA />

      {/* Club CTA */}
      <ClubCTA />

      {/* Blog CTA */}
      <BlogCTA />

      {/* FAQ */}
      <HomeFAQ />
    </Layout>
  );
};

export default Index;
