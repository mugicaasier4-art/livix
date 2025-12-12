import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import FeaturedListings from "@/components/sections/FeaturedListings";
import CategoryCTA from "@/components/sections/CategoryCTA";
import PremiumCTA from "@/components/sections/PremiumCTA";
import ClubCTA from "@/components/sections/ClubCTA";
import BlogCTA from "@/components/sections/BlogCTA";
import HomeFAQ from "@/components/sections/HomeFAQ";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <FeaturedListings />
      <PremiumCTA />
      <CategoryCTA />
      <ClubCTA />
      <BlogCTA />
      <HomeFAQ />
    </Layout>
  );
};

export default Index;
