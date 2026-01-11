import { motion } from "framer-motion";
import { Shield, Clock, Download, Database, CheckCircle2, Zap } from "lucide-react";

const trustItems = [
  {
    icon: Database,
    title: "Automated Backups",
    description: "Off-server backups run automatically, so your data is never at risk",
    stat: "Every 6 hours"
  },
  {
    icon: Clock,
    title: "Human-Initiated Restores",
    description: "Real people review and execute restores with care and context",
    stat: "< 2 hour response"
  },
  {
    icon: Shield,
    title: "Clear Response Times",
    description: "SLA-backed response times you can count on, documented and guaranteed",
    stat: "99.9% uptime"
  },
  {
    icon: Download,
    title: "World Downloads",
    description: "Download your complete world anytime—you always own your data",
    stat: "Instant access"
  },
];

const promises = [
  "Your content is treated like production data—because it is",
  "No surprise downtimes during recording sessions",
  "Direct human support, not ticket queues",
  "Transparent operations with full visibility"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export const Trust = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Built on Trust
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Reliability & Trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your content is treated like production data—because it is. We build systems that let you focus on creating, not worrying.
          </p>
        </motion.div>

        {/* Trust cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs font-medium text-primary mb-2">{item.stat}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Promises section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Our Promise to Creators</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {promises.map((promise, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{promise}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
