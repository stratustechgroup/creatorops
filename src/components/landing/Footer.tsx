import { motion } from "framer-motion";

const trustSignals = [
  "Creator-first infrastructure",
  "You own your world, always",
  "Built for stability, not hype",
];

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {signal}
              </div>
            ))}
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
