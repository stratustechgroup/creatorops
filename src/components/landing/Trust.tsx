import { motion } from "framer-motion";
import { Check, Clock, Activity, Download, Shield } from "lucide-react";

const trustItems = [
  {
    icon: Clock,
    stat: "Every 6 hours",
    title: "Automated Backups",
    description: "Off-server backups run automatically, so your data is never at risk",
  },
  {
    icon: Activity,
    stat: "< 2 hour response",
    title: "Human-Initiated Restores",
    description: "Real people review and execute restores with care and context",
  },
  {
    icon: Shield,
    stat: "Live monitoring",
    title: "Event Protection",
    description: "Pre-tested, monitored in real-time, with instant rollback capability",
  },
  {
    icon: Download,
    stat: "Instant access",
    title: "World Downloads",
    description: "Download your complete world anytime—you always own your data",
  },
];

const promises = [
  "Your content is treated like production data",
  "No surprise downtimes during recording sessions",
  "Live events protected by Event Assurance",
  "Direct human support, not ticket queues",
];

export const Trust = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-default">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-sm text-primary font-medium mb-4 tracking-wide">
            RELIABILITY
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
            Reliability you can count on.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your content is treated like production data—because it is.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="block text-xl font-bold text-primary font-mono mb-2">
                {item.stat}
              </span>
              <h4 className="text-base font-semibold text-foreground mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Promises section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-8 border border-white/5 rounded-xl bg-card/30">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Our Promise to Creators
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {promises.map((promise, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-foreground/80">{promise}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
