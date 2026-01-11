import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const highlights = [
  { icon: DollarSign, text: "Locked-in pricing forever" },
  { icon: Star, text: "Direct product influence" },
  { icon: Users, text: "Exclusive founder community" },
];

export const FoundingProgramTeaser = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary font-medium">
            <Sparkles className="w-4 h-4" />
            Only 7 Spots Remaining
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Founding Creator Program
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join a small group of serious creators shaping the future of Minecraft infrastructure.
          </p>
          
          {/* Highlight badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
          
          <Button variant="hero" size="xl" className="group" asChild>
            <Link to="/founding-creators">
              Learn More
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};