import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Stop risking your content on fragile setups.
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            If you're serious about Minecraft creation, your infrastructure should be too.
          </p>
          
          <Button variant="hero" size="xl" className="group">
            Apply for Creator Access
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
