import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

export const FinalCTA = () => {
  const { trackEvent } = useAnalytics();

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "final_cta",
      button_text: "Apply for Creator Access",
    });
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      
      {/* Decorative border top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <p className="text-sm font-medium tracking-wider uppercase text-primary mb-4">
            Ready to level up?
          </p>
          
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
            Stop risking your content on fragile setups.
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            If you're serious about Minecraft creation, your infrastructure should be too.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/founding-apply" onClick={handleApplyClick}>
                Apply for Creator Access
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No commitment required · Response within 48 hours
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
