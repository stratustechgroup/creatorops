import { motion } from "framer-motion";
import { ArrowRight, Lock, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Lock,
    title: "Price Locked Forever",
    description: "Your rate stays the same, even as we add features",
  },
  {
    icon: Star,
    title: "Priority Everything",
    description: "First access to new tools and priority support",
  },
  {
    icon: MessageSquare,
    title: "Shape the Roadmap",
    description: "Your feedback directly influences what we build",
  },
];

export const FoundingProgramTeaser = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main card */}
          <div className="p-8 lg:p-12 border border-primary/20 rounded-2xl bg-primary/5">
            {/* Badge */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-accent bg-accent/10 rounded-full border border-accent/20">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Only 7 Spots Remaining
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
              Founding Creator Program.
            </h2>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              Lock in founder pricing forever while shaping infrastructure built
              by people who understand what creators actually need.
            </p>

            {/* Benefits grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                  className="p-5 border border-white/5 rounded-xl bg-background/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Link
                to="/founding-creators"
                className="btn-primary"
              >
                Claim Your Spot
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Limited availability · No commitment required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
