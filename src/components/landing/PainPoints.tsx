import { motion } from "framer-motion";
import { AlertTriangle, Clock, Users, Server, Database } from "lucide-react";

const risks = [
  { icon: AlertTriangle, text: "A bad update corrupts your world" },
  { icon: Clock, text: "A mod experiment breaks weeks of progress" },
  { icon: Users, text: "Local worlds don't scale for collabs" },
  { icon: Server, text: "Servers crash mid-recording" },
  { icon: Database, text: "Backups exist… until you actually need them" },
];

const costs = [
  "An episode",
  "An editor's time",
  "Upload consistency",
  "Algorithm momentum",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export const PainPoints = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            If you're a Minecraft creator, you already know the risks
          </h2>
          <p className="text-muted-foreground text-center mb-16">
            The problems no one talks about until it's too late.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Risk list */}
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {risks.map((risk, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                >
                  <risk.icon className="w-5 h-5 text-destructive shrink-0" />
                  <span className="text-foreground">{risk.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Cost box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-card-gradient rounded-2xl border border-border p-8 shadow-card"
            >
              <p className="text-lg text-foreground mb-6">
                One mistake can cost:
              </p>
              <ul className="space-y-3 mb-8">
                {costs.map((cost, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {cost}
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-border">
                <p className="text-foreground font-medium">That's not a tech problem.</p>
                <p className="text-primary font-semibold mt-1">That's a content risk problem.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
