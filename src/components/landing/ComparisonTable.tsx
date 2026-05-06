import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type FeatureValue = "yes" | "no" | "partial" | string;

const comparisonData = [
  { feature: "Automated backups", creatorOps: "yes", selfHosting: "no", otherHosts: "partial" },
  { feature: "One-click rollback to any point", creatorOps: "yes", selfHosting: "no", otherHosts: "no" },
  { feature: "Minecraft version pinning", creatorOps: "yes", selfHosting: "yes", otherHosts: "partial" },
  { feature: "Live TPS / MSPT monitoring", creatorOps: "yes", selfHosting: "DIY (Spark)", otherHosts: "no" },
  { feature: "Incident response", creatorOps: "Real engineer, immediate", selfHosting: "You handle it", otherHosts: "Ticket queue" },
  { feature: "Dedicated staging environment", creatorOps: "yes", selfHosting: "Manual setup", otherHosts: "Extra cost" },
  { feature: "Restore SLA (Pro tier)", creatorOps: "4 hours guaranteed", selfHosting: "no", otherHosts: "Varies / none" },
  { feature: "DDoS + IP-hidden proxy", creatorOps: "yes", selfHosting: "Extra cost", otherHosts: "partial" },
  { feature: "Creator-focused support", creatorOps: "yes", selfHosting: "no", otherHosts: "no" },
  { feature: "Event Assurance (collabs, charity)", creatorOps: "Pro & Studio", selfHosting: "no", otherHosts: "no" },
  { feature: "Your time investment", creatorOps: "Zero ops", selfHosting: "Hours per week", otherHosts: "Several hours" },
];

const ValueCell = ({ value, highlight }: { value: FeatureValue; highlight?: boolean }) => {
  if (value === "yes") {
    return (
      <span role="img" aria-label="Yes">
        <Check className={`w-5 h-5 ${highlight ? "text-primary" : "text-emerald-400"}`} aria-hidden="true" />
      </span>
    );
  }
  if (value === "no") {
    return (
      <span role="img" aria-label="No">
        <X className="w-5 h-5 text-red-400/60" aria-hidden="true" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span role="img" aria-label="Partial">
        <Minus className="w-5 h-5 text-yellow-400/60" aria-hidden="true" />
      </span>
    );
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
          className="w-full"
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
                      <p className="text-xs text-muted-foreground mt-1">Fully managed</p>
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                      Self-Hosted
                      <p className="text-xs text-muted-foreground/60 font-normal mt-1">Your machine</p>
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                      Self-Managed Host
                      <p className="text-xs text-muted-foreground/60 font-normal mt-1">Apex, Bisect, Shockbyte</p>
                    </th>
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
            * "Self-Managed Host" refers to typical Minecraft hosting providers (Apex, BisectHosting, Shockbyte, Sparked Host, etc.) where you run the panel and handle ops yourself.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
