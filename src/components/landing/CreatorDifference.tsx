import { motion } from "framer-motion";
import { Server, MessageSquare, Target, Sparkles } from "lucide-react";

const differentiators = [
  {
    icon: Server,
    title: "Dedicated Resources",
    description: "Your node is yours. No noisy neighbors, no resource contention, no sharing CPU with 50 other servers.",
  },
  {
    icon: MessageSquare,
    title: "Creator-First Support",
    description: "We speak content, not sysadmin. Talk about upload schedules and recording windows—not CPU cores and RAM allocation.",
  },
  {
    icon: Target,
    title: "Outcome Guarantees",
    description: "We measure success by uninterrupted content, not uptime percentages. Your stream matters more than our metrics.",
  },
  {
    icon: Sparkles,
    title: "SparkAnalyzer (Coming Soon)",
    description: "Proprietary profiling tools that catch performance issues before they happen. See problems we fix before you even notice them.",
    badge: "Coming Soon",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export const CreatorDifference = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
            <Server className="w-4 h-4" />
            Premium Infrastructure
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            The Creator Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            This isn't shared hosting with a fancy label. It's infrastructure built specifically for content creators who can't afford downtime.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {differentiators.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl border border-border bg-card shadow-card hover:border-primary/30 transition-all duration-300"
            >
              {/* Coming Soon badge */}
              {item.badge && (
                <div className="absolute -top-3 right-6">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground">
            <span className="text-foreground font-medium">Bottom line:</span> We don't sell servers. We sell peace of mind for creators.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
