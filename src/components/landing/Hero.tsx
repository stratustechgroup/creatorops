import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroProps {
  onApplyClick: () => void;
}

export const Hero = ({ onApplyClick }: HeroProps) => {
  const { trackEvent } = useAnalytics();

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "hero",
      button_text: "Apply for Creator Access",
    });
    onApplyClick();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Founding creator spots now open
          </motion.div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient">Your Minecraft World.</span>
            <br />
            <span className="text-foreground">Always Recording-Ready.</span>
            <br />
            <span className="text-muted-foreground">Never at Risk.</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            We run your Minecraft world on professional infrastructure so you can build, record, and collaborate—without worrying about backups, updates, or breaking your series.
          </motion.p>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm text-muted-foreground mb-10"
          >
            No panels. No setup. No surprises.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl" className="group" onClick={handleApplyClick}>
              Apply for Creator Access
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Sub-headline section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mt-20 pt-20 border-t border-border"
        >
          <p className="text-xl md:text-2xl text-foreground font-medium mb-4">
            Stop treating your content like a hobby server.
          </p>
          <p className="text-muted-foreground">
            This is managed Minecraft infrastructure built specifically for creators.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
