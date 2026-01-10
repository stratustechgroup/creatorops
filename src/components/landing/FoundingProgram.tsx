import { motion } from "framer-motion";
import { Sparkles, MessageSquare, DollarSign, Heart } from "lucide-react";

const benefits = [
  { icon: DollarSign, text: "Discounted early pricing" },
  { icon: Heart, text: "White-glove support" },
  { icon: MessageSquare, text: "Direct input on features" },
];

const asks = [
  "Honest feedback",
  "Real usage",
  "Optional testimonial or case study",
];

export const FoundingProgram = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary">
              <Sparkles className="w-4 h-4" />
              Limited Availability
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Founding Creator Program
            </h2>
            <p className="text-muted-foreground">
              We're onboarding a small group of creators to help shape the platform.
              Spots are limited to keep quality high.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What you get */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-2xl bg-card-gradient border border-border shadow-card"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What you get
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <benefit.icon className="w-5 h-5 text-primary shrink-0" />
                    {benefit.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* What we ask */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-6 rounded-2xl bg-secondary/30 border border-border shadow-card"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What we ask
              </h3>
              <ul className="space-y-4">
                {asks.map((ask, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                    {ask}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
