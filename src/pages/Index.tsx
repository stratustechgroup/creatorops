import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
// import { SocialProof } from "@/components/landing/SocialProof";
// import { CreatorLogos } from "@/components/landing/CreatorLogos";
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
import { NetworkFlow } from "@/components/landing/NetworkFlow";

/**
 * HOW TO RE-ENABLE HIDDEN SECTIONS:
 * 
 * SOCIAL PROOF:
 * 1. Uncomment: import { SocialProof } from "@/components/landing/SocialProof";
 * 2. Uncomment: <SocialProof /> in the JSX below (after <Hero />)
 * Component file: src/components/landing/SocialProof.tsx
 * 
 * CREATOR LOGOS:
 * 1. Uncomment: import { CreatorLogos } from "@/components/landing/CreatorLogos";
 * 2. Uncomment: <CreatorLogos /> in the JSX below (after <SocialProof />)
 * Component file: src/components/landing/CreatorLogos.tsx
 * 
 * TESTIMONIALS:
 * 1. Uncomment: import { Testimonials } from "@/components/landing/Testimonials";
 * 2. Uncomment: <Testimonials /> in the JSX below (after <Audience />)
 * Component file: src/components/landing/Testimonials.tsx
 */

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NetworkFlow />
      <ScrollProgress />
      <Navbar />
      <main>
        <section className="snap-section">
          <Hero />
        </section>
        {/* <SocialProof /> - Uncomment to show social proof */}
        {/* <CreatorLogos /> - Uncomment to show creator logos */}
        <section className="snap-section">
          <PainPoints />
        </section>
        <section className="snap-section">
          <Solution />
        </section>
        <section className="snap-section">
          <HowItWorks />
        </section>
        <section className="snap-section">
          <Audience />
        </section>
        {/* <Testimonials /> - Uncomment to show testimonials carousel */}
        <section className="snap-section">
          <Pricing />
        </section>
        <section className="snap-section">
          <Trust />
        </section>
        <section className="snap-section">
          <FAQ />
        </section>
        <section className="snap-section">
          <FoundingProgram />
        </section>
        <section className="snap-section">
          <FinalCTA />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
