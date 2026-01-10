import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { PainPoints } from "@/components/landing/PainPoints";
import { Solution } from "@/components/landing/Solution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Audience } from "@/components/landing/Audience";
import { Pricing } from "@/components/landing/Pricing";
import { Trust } from "@/components/landing/Trust";
import { FAQ } from "@/components/landing/FAQ";
import { FoundingProgram } from "@/components/landing/FoundingProgram";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { ApplicationModal } from "@/components/landing/ApplicationModal";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar onApplyClick={handleApplyClick} />
      <main>
        <Hero onApplyClick={handleApplyClick} />
        <SocialProof />
        <PainPoints />
        <Solution />
        <HowItWorks />
        <Audience />
        <Pricing onApplyClick={handleApplyClick} />
        <Trust />
        <FAQ />
        <FoundingProgram />
        <FinalCTA onApplyClick={handleApplyClick} />
      </main>
      <Footer />
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Index;
