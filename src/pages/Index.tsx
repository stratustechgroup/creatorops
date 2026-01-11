import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PainPoints } from "@/components/landing/PainPoints";
import { Solution } from "@/components/landing/Solution";
import { SafetyFeatures } from "@/components/landing/SafetyFeatures";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { Pricing } from "@/components/landing/Pricing";
import { Trust } from "@/components/landing/Trust";
import { FAQ } from "@/components/landing/FAQ";
import { FoundingProgramTeaser } from "@/components/landing/FoundingProgramTeaser";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

/**
 * REMOVED SECTIONS (can be re-added if needed):
 * - HowItWorks: Merged into Solution section as compact step strip
 * - SecurityBadges: Consolidated with SafetyFeatures
 * - Audience: Removed to streamline page
 *
 * COMMENTED OUT SECTIONS (ready to enable):
 * - SocialProof: src/components/landing/SocialProof.tsx
 * - CreatorLogos: src/components/landing/CreatorLogos.tsx
 * - Testimonials: src/components/landing/Testimonials.tsx
 */

const Index = () => {
  const location = useLocation();

  // Handle hash scrolling when navigating from other pages
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar hideNavLinks />
      <main>
        <Hero />
        <PainPoints />
        <Solution />
        <SafetyFeatures />
        <ComparisonTable />
        <Pricing />
        <Trust />
        <FAQ />
        <FoundingProgramTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
