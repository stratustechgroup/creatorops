import { motion } from "framer-motion";
import { Shield, Lock, Server, Clock, Database, CheckCircle } from "lucide-react";

const badges = [
  {
    icon: Lock,
    title: "256-bit Encryption",
    description: "All data encrypted in transit and at rest",
  },
  {
    icon: Database,
    title: "Automated Backups",
    description: "Every 4 hours with 30-day retention",
  },
  {
    icon: Clock,
    title: "99.5% Uptime SLA",
    description: "Guaranteed availability with credits",
  },
  {
    icon: Server,
    title: "Isolated Infrastructure",
    description: "Your world runs on dedicated resources",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Enterprise-grade attack mitigation",
  },
  {
    icon: CheckCircle,
    title: "Version Control",
    description: "No forced updates, full rollback support",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const SecurityBadges = () => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
            <Shield className="w-4 h-4" />
            Enterprise-Grade Security
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Your Content Deserves Real Protection
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We take security seriously so you can focus on creating.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card transition-all duration-300 text-center"
            >
              {/* Icon container */}
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <badge.icon className="w-5 h-5 text-primary" />
              </div>
              
              {/* Title */}
              <h3 className="text-sm font-semibold text-foreground mb-1 leading-tight">
                {badge.title}
              </h3>
              
              {/* Description - hidden on mobile, shown on hover/larger screens */}
              <p className="text-xs text-muted-foreground leading-snug hidden md:block">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-muted-foreground">
            Built on battle-tested cloud infrastructure trusted by enterprises worldwide.
          </p>
        </motion.div>
      </div>
    </section>
  );
};