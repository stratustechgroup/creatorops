import { motion } from "framer-motion";
import { Shield, Clock, Download, Database } from "lucide-react";

const trustItems = [
  {
    icon: Database,
    title: "Automated, off-server backups",
  },
  {
    icon: Clock,
    title: "Human-initiated restores",
  },
  {
    icon: Shield,
    title: "Clear restore response times",
  },
  {
    icon: Download,
    title: "World downloads available anytime",
  },
];

export const Trust = () => {
  return (
    <section className="relative py-24 md:py-32 border-y border-border">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Reliability & Trust
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Your content is treated like production data—because it is.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-6 rounded-xl bg-secondary/30 border border-border"
              >
                <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-sm text-foreground font-medium">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
