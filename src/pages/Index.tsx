import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PainPoints } from "@/components/landing/PainPoints";
import { CreatorDifference } from "@/components/landing/CreatorDifference";
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
 */

// Clean-URL section aliases. /pricing renders this same homepage but
// auto-scrolls to the matching section on mount or pathname change.
// Hash-based links (#pricing) still work for backwards compatibility.
const PATH_TO_SECTION: Record<string, string> = {
  "/features": "features",
  "/pricing": "pricing",
  "/faq": "faq",
};

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const fromPath = PATH_TO_SECTION[location.pathname];
    const fromHash = location.hash ? location.hash.replace("#", "") : null;
    const sectionId = fromPath ?? fromHash;

    if (!sectionId) {
      // Bare "/" — make sure we're at the top so navigating home from
      // a deep section (e.g., /pricing) returns to the hero, not wherever
      // the previous scroll position was.
      if (location.pathname === "/" && !location.hash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Small delay so the page has time to render lazy sections.
    const id = window.setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);

    return () => window.clearTimeout(id);
  }, [location.pathname, location.hash]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <PainPoints />
          <CreatorDifference />
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
    </PageTransition>
  );
};

export default Index;
