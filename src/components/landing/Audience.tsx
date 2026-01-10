import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const forCreators = [
  "YouTubers running long-form Minecraft series",
  "SMP organizers and collab groups",
  "Creators with custom or cinematic worlds",
  "Anyone who can't afford to lose progress or recordings",
];

const notFor = [
  "Cheap shared hosting shoppers",
  "Viewer-open public servers",
  '"Set it and forget it" hobby servers',
];

export const Audience = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Is This For You?
          </h2>
          <p className="text-xl text-primary font-medium">
            If losing your world would hurt your channel, this is for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* For */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-card-gradient border border-primary/30 shadow-card"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              Who This Is For
            </h3>
            <ul className="space-y-4">
              {forCreators.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not for */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-secondary/30 border border-border shadow-card"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <X className="w-5 h-5 text-muted-foreground" />
              Who This Is Not For
            </h3>
            <ul className="space-y-4">
              {notFor.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground">
              This is professional infrastructure for serious creators.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
