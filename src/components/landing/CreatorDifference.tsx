import { motion } from "framer-motion";
import { Server, Headphones, Target, Activity } from "lucide-react";

const differentiators = [
  {
    icon: Server,
    title: "Dedicated Resources",
    description:
      "Your node is yours. No noisy neighbors, no resource contention, no sharing CPU with 50 other servers.",
  },
  {
    icon: Headphones,
    title: "Creator-First Support",
    description:
      "We speak content, not sysadmin. Talk about upload schedules and recording windows—not CPU cores and RAM allocation.",
  },
  {
    icon: Target,
    title: "Outcome Guarantees",
    description:
      "Pro tier guarantees a 4-hour restore window — even at 2am before a big upload. Studio defines a custom SLA. Real, signed commitments — not aspirational uptime numbers.",
  },
  {
    icon: Activity,
    title: "Proactive Profiling",
    description:
      "We run live TPS and MSPT monitoring on every server, with the Spark profiler catching issues before they hit your stream. Most problems get fixed before you notice them.",
  },
];

export const CreatorDifference = () => {
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
            THE DIFFERENCE
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            This isn't shared hosting with a fancy label.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Infrastructure built specifically for content creators who can't afford downtime.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="group p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-16 border-t border-white/5 text-center"
        >
          <p className="text-xl">
            <span className="text-muted-foreground">Bottom line: </span>
            <span className="text-foreground font-semibold">We don't sell servers. We sell peace of mind.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
