import { motion } from "framer-motion";

const risks = [
  { text: "A bad update corrupts your world", detail: "Weeks of builds, gone" },
  { text: "A mod experiment breaks everything", detail: "No rollback available" },
  { text: "Local worlds don't scale", detail: "Collabs become impossible" },
  { text: "Servers crash mid-recording", detail: "Content lost forever" },
  { text: "Backups exist—until you need them", detail: "Corrupt or outdated" },
];

const costs = [
  "An episode",
  "An editor's time",
  "Upload consistency",
  "Algorithm momentum",
];

export const PainPoints = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent" />

      <div className="container-default relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left column - Content */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-red-400 font-medium mb-4 tracking-wide"
            >
              THE REALITY
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
            >
              If you're a Minecraft creator, you already know the risks.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-12"
            >
              The problems no one talks about—until it's too late.
            </motion.p>

            {/* Risk list */}
            <div className="space-y-4">
              {risks.map((risk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-4 p-4 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-500/[0.02] transition-colors"
                >
                  <span className="text-sm font-mono text-red-400/60 mt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-foreground font-medium">{risk.text}</p>
                    <p className="text-sm text-muted-foreground mt-1">{risk.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column - Cost card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-32"
          >
            <div className="bg-card/50 border border-white/10 rounded-2xl p-8">
              <p className="text-sm text-muted-foreground mb-2">ONE MISTAKE CAN COST</p>
              <h3 className="text-2xl font-bold mb-8">More than you think.</h3>

              <ul className="space-y-4 mb-8">
                {costs.map((cost, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-foreground/80">{cost}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/10">
                <p className="text-muted-foreground">That's not a tech problem.</p>
                <p className="text-xl font-semibold mt-2">
                  That's a <span className="text-red-400">content risk</span> problem.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
