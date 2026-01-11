import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { CreatorLogos } from "@/components/landing/CreatorLogos";
import { PainPoints } from "@/components/landing/PainPoints";
import { Solution } from "@/components/landing/Solution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Audience } from "@/components/landing/Audience";
// import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { Trust } from "@/components/landing/Trust";
import { FAQ } from "@/components/landing/FAQ";
import { FoundingProgram } from "@/components/landing/FoundingProgram";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

/**
 * HOW TO RE-ENABLE TESTIMONIALS:
 * 
 * 1. Uncomment the import above:
 *    import { Testimonials } from "@/components/landing/Testimonials";
 * 
 * 2. Uncomment <Testimonials /> in the JSX below (after <Audience />)
 * 
 * The Testimonials component includes:
 * - Carousel with 5 creator testimonials
 * - Profile photos, quotes, roles, and subscriber counts
 * - Optional video embed dialogs
 * - Navigation dots and prev/next buttons
 * 
 * To customize testimonials, edit: src/components/landing/Testimonials.tsx
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <CreatorLogos />
        <PainPoints />
        <Solution />
        <HowItWorks />
        <Audience />
        {/* <Testimonials /> - Uncomment to show testimonials carousel */}
        <Pricing />
        <Trust />
        <FAQ />
        <FoundingProgram />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
