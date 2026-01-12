import { motion } from "framer-motion";
import { Shield, Database, Activity, AlertTriangle, Clock, RotateCcw, Globe, Zap, Lock } from "lucide-react";

const safetyFeatures = [
  // Security features first
  {
    icon: Globe,
    title: "Proxy Protection",
    description: "Your IP stays hidden. We handle all proxy and velocity layers so your home network is never exposed to viewers or attackers.",
    highlight: "IP Hidden",
  },
  {
    icon: Zap,
    title: "DDoS Shield",
    description: "Stream-safe DDoS mitigation that protects your server without disconnecting players mid-session. Your content keeps flowing.",
    highlight: "Stream-safe",
  },
  {
    icon: Lock,
    title: "Creator Confidentiality",
    description: "Your projects, server IPs, and upcoming content stay strictly confidential. We work under discretion—your secrets are safe.",
    highlight: "NDA Ready",
  },
  // Reliability features with outcome-focused copy
  {
    icon: Database,
    title: "Never Lose Progress",
    description: "Backups so frequent you'll never wonder if you're protected. 30-day retention with off-site storage means your builds are always recoverable.",
    highlight: "Auto-backups",
  },
  {
    icon: Activity,
    title: "Problems Caught Before Your Stream",
    description: "We detect issues before they interrupt your recording. Real-time monitoring means problems get fixed while you focus on content.",
    highlight: "Proactive",
  },
  {
    icon: AlertTriangle,
    title: "Instant Incident Response",
    description: "When issues arise, we respond immediately. No tickets, no waiting—our team handles problems so you can keep creating.",
    highlight: "Immediate",
  },
  {
    icon: Shield,
    title: "Updates That Don't Break Your Series",
    description: "We never update your Minecraft version without approval. Test in staging first, rollback within 72 hours if something's off.",
    highlight: "You control",
  },
  {
    icon: Clock,
    title: "Stream-Ready Reliability",
    description: "Uptime guarantees that matter during your content windows. Scheduled maintenance is always communicated 48 hours in advance.",
    highlight: "99.5% SLA",
  },
  {
    icon: RotateCcw,
    title: "Rapid Rollback",
    description: "Need to undo something? Restores happen in hours, not days. Creator Pro gets 4-hour restore times, guaranteed.",
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
            Security & Protection
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Security & Safety Built for Creators
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your IP protected. Your content safe. Your infrastructure handled. We treat your world like the production asset it is.
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
