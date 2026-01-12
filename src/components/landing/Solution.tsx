import { motion } from "framer-motion";
import { Zap, Shield, RefreshCw, Users, Settings, PlayCircle, Radio, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Always Ready When You Are",
    description: "Your world is always online, stable, and ready to join when inspiration hits. No warmup time, no lag spikes.",
  },
  {
    icon: RefreshCw,
    title: "Instant Rollback Anytime",
    description: "Something go wrong? Restore to any point in the last 30 days. Your progress is always protected.",
  },
  {
    icon: Shield,
    title: "Updates That Don't Break Your Series",
    description: "We pin your version. Upgrades happen only when you approve them—test in staging first, rollback if needed.",
  },
  {
    icon: Users,
    title: "Safe Collaboration",
    description: "Invite collaborators safely. Spin up staging or collab worlds without risking your main production world.",
  },
  {
    icon: Settings,
    title: "We Handle Everything",
    description: "No server panels. No JVM flags. No guesswork. If something breaks, we fix it—you keep creating.",
  },
];

const managedServices = [
  {
    icon: PlayCircle,
    phase: "Pre-Stream",
    title: "Recording-Ready Setup",
    items: [
      "Chunks pre-generated for smooth exploration",
      "Configurations tested and optimized",
      "World verified stable before you go live",
    ],
  },
  {
    icon: Radio,
    phase: "During Stream",
    title: "Live Support Available",
    items: [
      "Admin support in Discord for emergencies",
      "Real-time monitoring of your session",
      "Instant griefer bans or crash recovery",
    ],
  },
  {
    icon: Download,
    phase: "Post-Stream",
    title: "Content Delivered",
    items: [
      "World downloads ready within hours",
      "Backups verified and secured",
      "Performance reports on request",
    ],
  },
];

const steps = [
  { number: "01", title: "Apply", description: "We review your needs" },
  { number: "02", title: "Onboard", description: "We set up your world" },
  { number: "03", title: "Create", description: "You focus on content" },
  { number: "04", title: "Relax", description: "We handle the rest" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

export const Solution = () => {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 px-4">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            We turn your Minecraft world into{" "}
            <span className="text-gradient">reliable creator infrastructure</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            You connect to one server address. Behind the scenes, we manage everything required to keep your world safe, fast, and reversible.
          </p>
          <p className="text-xl text-foreground font-medium">
            You focus on content. We handle the rest.
          </p>
        </motion.div>

        {/* How it works - compact strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="grid grid-cols-4 gap-2 md:gap-4 p-4 rounded-2xl bg-secondary/30 border border-border">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="text-2xl md:text-3xl font-bold text-primary/40 mb-1">
                  {step.number}
                </div>
                <div className="text-sm font-semibold text-foreground mb-0.5">{step.title}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What Fully Managed Means */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              What "Fully Managed" Actually Means
            </h3>
            <p className="text-muted-foreground">
              Think of us as your Technical Director, not just your server host.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {managedServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-primary uppercase tracking-wide">
                      {service.phase}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {service.title}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl bg-card border border-border shadow-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};