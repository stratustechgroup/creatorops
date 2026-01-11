import { motion } from "framer-motion";
import { Check, X, Minus, Sparkles } from "lucide-react";

type FeatureValue = "yes" | "no" | "partial" | string;

interface ComparisonFeature {
  feature: string;
  creatorOps: FeatureValue;
  selfHosting: FeatureValue;
  otherHosts: FeatureValue;
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: "Automated backups",
    creatorOps: "yes",
    selfHosting: "no",
    otherHosts: "partial",
  },
  {
    feature: "One-click rollback",
    creatorOps: "yes",
    selfHosting: "no",
    otherHosts: "no",
  },
  {
    feature: "Version pinning",
    creatorOps: "yes",
    selfHosting: "yes",
    otherHosts: "partial",
  },
  {
    feature: "24/7 monitoring",
    creatorOps: "yes",
    selfHosting: "no",
    otherHosts: "partial",
  },
  {
    feature: "Incident response",
    creatorOps: "Immediate",
    selfHosting: "You handle it",
    otherHosts: "Ticket system",
  },
  {
    feature: "Staging environments",
    creatorOps: "yes",
    selfHosting: "Manual setup",
    otherHosts: "Extra cost",
  },
  {
    feature: "Uptime SLA",
    creatorOps: "99.5%",
    selfHosting: "no",
    otherHosts: "Varies",
  },
  {
    feature: "DDoS protection",
    creatorOps: "yes",
    selfHosting: "Extra cost",
    otherHosts: "partial",
  },
  {
    feature: "Creator-focused support",
    creatorOps: "yes",
    selfHosting: "no",
    otherHosts: "no",
  },
  {
    feature: "Time investment",
    creatorOps: "Zero ops",
    selfHosting: "Hours/week",
    otherHosts: "Some required",
  },
];

const ValueCell = ({ value }: { value: FeatureValue }) => {
  if (value === "yes") {
    return (
      <div className="flex justify-center">
        <div className="p-1 rounded-full bg-primary/20">
          <Check className="w-4 h-4 text-primary" />
        </div>
      </div>
    );
  }
  if (value === "no") {
    return (
      <div className="flex justify-center">
        <div className="p-1 rounded-full bg-destructive/20">
          <X className="w-4 h-4 text-destructive" />
        </div>
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="flex justify-center">
        <div className="p-1 rounded-full bg-muted">
          <Minus className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

export const ComparisonTable = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How We Compare
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See why creators choose managed infrastructure over DIY solutions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Table container */}
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Table header */}
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-secondary/50 border-b border-border">
                <div className="p-3 md:p-4 text-left">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">Feature</span>
                </div>
                <div className="p-3 md:p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <motion.span 
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground inline-flex items-center gap-1 whitespace-nowrap"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Recommended
                    </motion.span>
                    <span className="text-xs md:text-sm font-semibold text-primary">Creator Ops</span>
                  </div>
                </div>
                <div className="p-3 md:p-4 text-center">
                  <span className="text-xs md:text-sm font-medium text-foreground">Self-Hosting</span>
                </div>
                <div className="p-3 md:p-4 text-center">
                  <span className="text-xs md:text-sm font-medium text-foreground">Other Hosts</span>
                </div>
              </div>

              {/* Table body */}
              <div className="divide-y divide-border">
                {comparisonData.map((row, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr] hover:bg-secondary/30 transition-colors"
                  >
                    <div className="p-3 md:p-4 text-left">
                      <span className="text-xs md:text-sm text-foreground">{row.feature}</span>
                    </div>
                    <div className="p-3 md:p-4 text-center bg-primary/5">
                      <ValueCell value={row.creatorOps} />
                    </div>
                    <div className="p-3 md:p-4 text-center">
                      <ValueCell value={row.selfHosting} />
                    </div>
                    <div className="p-3 md:p-4 text-center">
                      <ValueCell value={row.otherHosts} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            * "Other Hosts" refers to typical Minecraft hosting providers without creator-specific features.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};