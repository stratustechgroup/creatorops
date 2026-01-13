import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Clock, Activity, Zap, Settings, Calendar, RotateCcw } from "lucide-react";

const safetyFeatures = [
  {
    category: "Security",
    items: [
      { icon: Lock, title: "Proxy Protection", description: "Your IP stays hidden. We handle all proxy layers.", tag: "IP Hidden" },
      { icon: Shield, title: "DDoS Shield", description: "Content-safe mitigation without disconnecting players.", tag: "Always On" },
      { icon: Eye, title: "Creator Confidentiality", description: "Your projects and server IPs stay strictly confidential.", tag: "NDA Ready" },
    ],
  },
  {
    category: "Reliability",
    items: [
      { icon: Clock, title: "Never Lose Progress", description: "Backups so frequent you'll never wonder if you're protected.", tag: "Auto-backups" },
      { icon: Activity, title: "Proactive Monitoring", description: "We detect issues before they interrupt your session.", tag: "24/7" },
      { icon: Zap, title: "Instant Response", description: "When issues arise, we respond immediately. No tickets.", tag: "Immediate" },
    ],
  },
  {
    category: "Control",
    items: [
      { icon: Settings, title: "Safe Updates", description: "We never update your Minecraft version without approval.", tag: "You Approve" },
      { icon: Calendar, title: "Recording-Ready", description: "Uptime guarantees during your content windows.", tag: "99.5% SLA" },
      { icon: RotateCcw, title: "Rapid Rollback", description: "Restores happen in hours, not days.", tag: "< 4 Hours" },
    ],
  },
];

export const SafetyFeatures = () => {
  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="container-default">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-primary font-medium mb-4 tracking-wide"
          >
            PROTECTION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            Security & safety built for creators.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Your IP protected. Your content safe. Your infrastructure handled.
          </motion.p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {safetyFeatures.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground tracking-wide">
                  {category.category.toUpperCase()}
                </h3>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {category.items.map((item, index) => (
                  <div
                    key={item.title}
                    className="group p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* SLA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Read our full{" "}
            <Link to="/sla" className="text-primary hover:underline">
              Service Level Agreement
            </Link>{" "}
            for complete details.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
