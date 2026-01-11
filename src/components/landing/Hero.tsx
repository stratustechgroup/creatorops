import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { useAnalytics } from "@/hooks/useAnalytics";

export const Hero = () => {
  const { trackEvent } = useAnalytics();
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "hero",
      button_text: "Apply for Creator Access",
    });
  };

  const scrollToContent = () => {
    const nextSection = document.querySelector('#features')?.previousElementSibling || document.querySelector('section:nth-of-type(2)');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          y: backgroundY
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
      <div className="absolute inset-0 bg-hero-gradient" />
      <motion.div className="absolute inset-0 grid-pattern opacity-20" style={{ y: backgroundY }} />
      
      {/* Glow orb with parallax */}
      <motion.div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow"
        style={{ y: backgroundY }}
      />
      
      <motion.div className="container relative z-10 px-4 py-20 md:py-32" style={{ y: contentY, opacity }}>
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
            <span className="text-foreground">Fully Managed.</span>
            <br />
            <span className="text-muted-foreground">Zero Ops Required.</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            We handle backups, updates, monitoring, and incident response—so you can focus on creating content, not managing infrastructure.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/apply" onClick={handleApplyClick}>
                Apply for Creator Access
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#pricing">
                View Pricing
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {["Automated backups", "24/7 monitoring", "Instant response"].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Sub-headline section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mt-16 pt-16 border-t border-border/50"
        >
          <p className="text-xl md:text-2xl text-foreground font-medium mb-2">
            Stop treating your content like a hobby server.
          </p>
          <p className="text-muted-foreground">
            Creator Ops: Managed infrastructure built specifically for content creators.
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Scroll to content"
      >
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
};
