import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PainPoints } from "@/components/landing/PainPoints";
import { Solution } from "@/components/landing/Solution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Audience } from "@/components/landing/Audience";
import { Pricing } from "@/components/landing/Pricing";
import { Trust } from "@/components/landing/Trust";
import { FoundingProgram } from "@/components/landing/FoundingProgram";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <Solution />
        <HowItWorks />
        <Audience />
        <Pricing />
        <Trust />
        <FoundingProgram />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
