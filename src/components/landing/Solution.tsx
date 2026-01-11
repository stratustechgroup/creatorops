import { motion } from "framer-motion";
import { Zap, Shield, RefreshCw, Users, Settings } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Recording-Ready Worlds",
    description: "Your world is always online, stable, and ready to join when inspiration hits.",
  },
  {
    icon: RefreshCw,
    title: "Automatic Backups & Rollback",
    description: "Frequent backups with the ability to restore your world to a previous point—fast.",
  },
  {
    icon: Shield,
    title: "Safe Upgrades (No Series Breakage)",
    description: "We pin your version. Upgrades happen only when you approve them—and they're fully reversible.",
  },
  {
    icon: Users,
    title: "Collaboration Without Chaos",
    description: "Invite collaborators safely. Spin up staging or collab worlds without risking production.",
  },
  {
    icon: Settings,
    title: "Zero-Ops Experience",
    description: "No server panels. No JVM flags. No guesswork. If something breaks, we fix it.",
  },
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
          className="max-w-3xl mx-auto text-center mb-20"
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
