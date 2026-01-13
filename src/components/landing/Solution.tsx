import { motion } from "framer-motion";
import { Rocket, RotateCcw, Shield, Users, Settings, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Always Ready",
    description: "Your world is online, stable, and ready to join. No warmup time, no lag spikes.",
  },
  {
    icon: RotateCcw,
    title: "Instant Rollback",
    description: "Something go wrong? Restore to any point in the last 30 days.",
  },
  {
    icon: Shield,
    title: "Safe Updates",
    description: "We pin your version. Upgrades happen only when you approve.",
  },
  {
    icon: Users,
    title: "Safe Collaboration",
    description: "Invite collaborators safely. Spin up staging worlds without risking production.",
  },
  {
    icon: Settings,
    title: "Fully Managed",
    description: "No server panels. No JVM flags. No guesswork. If something breaks, we fix it.",
  },
];

const steps = [
  { number: "01", title: "Apply", description: "We review your needs" },
  { number: "02", title: "Onboard", description: "We set up your world" },
  { number: "03", title: "Create", description: "You focus on content" },
  { number: "04", title: "Relax", description: "We handle the rest" },
];

const phases = [
  {
    phase: "Before",
    title: "Session-Ready Setup",
    items: ["Chunks pre-generated", "Configurations optimized", "World verified stable"],
  },
  {
    phase: "During",
    title: "Live Support",
    items: ["Discord support on standby", "Real-time monitoring", "Instant crash recovery"],
  },
  {
    phase: "After",
    title: "Content Delivered",
    items: ["World downloads ready", "Backups verified", "Performance reports"],
  },
];

export const Solution = () => {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container-default">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-primary font-medium mb-4 tracking-wide"
          >
            THE SOLUTION
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            We turn your Minecraft world into reliable creator infrastructure.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            You connect to one server address. Behind the scenes, we manage everything required to keep your world safe, fast, and reversible.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors text-center"
            >
              <span className="text-3xl font-bold text-primary/40 font-mono">{step.number}</span>
              <p className="text-lg font-semibold text-foreground mt-2">{step.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Phases */}
        <div className="mb-24">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground mb-4 tracking-wide"
          >
            WHAT WE DO
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-10"
          >
            Think of us as your Technical Director, not just your server host.
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <span className="text-xs font-medium text-primary tracking-wide">{phase.phase.toUpperCase()}</span>
                <h4 className="text-lg font-semibold text-foreground mt-2 mb-4">{phase.title}</h4>
                <ul className="space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-10"
          >
            Everything you need, nothing you don't.
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                className="group p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <feature.icon className="w-6 h-6 text-primary mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-16 border-t border-white/5 text-center"
        >
          <p className="text-2xl font-bold">
            You focus on content. <span className="text-primary">We handle the rest.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
