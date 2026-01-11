import { motion } from "framer-motion";
import { Shield, Database, Activity, AlertTriangle, Clock, RotateCcw } from "lucide-react";

const safetyFeatures = [
  {
    icon: Database,
    title: "Automated Backups",
    description: "Every 4 hours, your world is backed up automatically. 30-day retention with off-site storage means your builds are never at risk.",
    highlight: "Every 4 hours",
  },
  {
    icon: Activity,
    title: "24/7 Monitoring",
    description: "Our systems watch your server around the clock. CPU, memory, disk, and network—we catch problems before they affect your content.",
    highlight: "Always watching",
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    description: "When issues arise, we respond immediately. No tickets, no waiting—our team handles problems so you can keep creating.",
    highlight: "Immediate action",
  },
  {
    icon: Shield,
    title: "Version Protection",
    description: "We never update your Minecraft version without your approval. Test in staging first, rollback within 72 hours if needed.",
    highlight: "You control updates",
  },
  {
    icon: Clock,
    title: "Uptime Guarantee",
    description: "99.5% uptime SLA backed by service credits. Scheduled maintenance is always communicated 48 hours in advance.",
    highlight: "99.5% SLA",
  },
  {
    icon: RotateCcw,
    title: "Instant Restores",
    description: "Need to rollback? Restores happen in hours, not days. Creator Pro gets 4-hour restore times, guaranteed.",
    highlight: "Hours, not days",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
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

export const SafetyFeatures = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
            <Shield className="w-4 h-4" />
            Infrastructure Protection
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            How We Keep You Safe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your world is your livelihood. We treat it that way with enterprise-grade protection and operations.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {safetyFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl border border-border bg-card shadow-card hover:border-primary/30 transition-all duration-300"
            >
              {/* Highlight badge */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                  {feature.highlight}
                </span>
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Read our full{" "}
            <a href="/sla" className="text-primary hover:underline">
              Service Level Agreement
            </a>{" "}
            for complete details.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
