import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type FeatureValue = "yes" | "no" | "partial" | string;

const comparisonData = [
  { feature: "Automated backups", creatorOps: "yes", selfHosting: "no", otherHosts: "partial" },
  { feature: "One-click rollback", creatorOps: "yes", selfHosting: "no", otherHosts: "no" },
  { feature: "Version pinning", creatorOps: "yes", selfHosting: "yes", otherHosts: "partial" },
  { feature: "24/7 monitoring", creatorOps: "yes", selfHosting: "no", otherHosts: "partial" },
  { feature: "Incident response", creatorOps: "Immediate", selfHosting: "You handle it", otherHosts: "Ticket system" },
  { feature: "Staging environments", creatorOps: "yes", selfHosting: "Manual setup", otherHosts: "Extra cost" },
  { feature: "Uptime SLA", creatorOps: "99.5%", selfHosting: "no", otherHosts: "Varies" },
  { feature: "DDoS protection", creatorOps: "yes", selfHosting: "Extra cost", otherHosts: "partial" },
  { feature: "Creator-focused support", creatorOps: "yes", selfHosting: "no", otherHosts: "no" },
  { feature: "Time investment", creatorOps: "Zero ops", selfHosting: "Hours/week", otherHosts: "Some required" },
];

const ValueCell = ({ value, highlight }: { value: FeatureValue; highlight?: boolean }) => {
  if (value === "yes") {
    return <Check className={`w-5 h-5 ${highlight ? "text-primary" : "text-emerald-400"}`} />;
  }
  if (value === "no") {
    return <X className="w-5 h-5 text-red-400/60" />;
  }
  if (value === "partial") {
    return <Minus className="w-5 h-5 text-yellow-400/60" />;
  }
  return <span className={`text-sm ${highlight ? "text-foreground font-medium" : "text-muted-foreground"}`}>{value}</span>;
};

export const ComparisonTable = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-default">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-primary font-medium mb-4 tracking-wide"
          >
            COMPARISON
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            How we compare.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            See why creators choose managed infrastructure over DIY solutions.
          </motion.p>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl"
        >
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Feature</th>
                    <th className="text-center p-4 bg-primary/5">
                      <span className="text-xs text-primary font-medium">RECOMMENDED</span>
                      <p className="text-sm font-semibold text-foreground mt-1">Creator Ops</p>
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Self-Hosting</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Other Hosts</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 text-sm text-foreground/80">{row.feature}</td>
                      <td className="p-4 bg-primary/5">
                        <div className="flex justify-center">
                          <ValueCell value={row.creatorOps} highlight />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <ValueCell value={row.selfHosting} />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <ValueCell value={row.otherHosts} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            * "Other Hosts" refers to typical Minecraft hosting providers without creator-specific features.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
