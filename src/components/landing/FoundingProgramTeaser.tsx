import { motion } from "framer-motion";
import { ArrowRight, Lock, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useSpotsConfig } from "@/hooks/useSpotsConfig";

const benefits = [
  {
    icon: Lock,
    title: "Founder Pricing, Locked Forever",
    description: "Solo locks at $79/mo, Plus at $103/mo, Pro at $159/mo — even as standard rates rise",
  },
  {
    icon: Star,
    title: "Priority Everything",
    description: "First access to new tools, priority support, and direct line to the team",
  },
  {
    icon: MessageSquare,
    title: "Shape the Roadmap",
    description: "Your feedback directly influences what we build — quarterly founder roadmap calls",
  },
];

export const FoundingProgramTeaser = () => {
  const { spotsRemaining } = useSpotsConfig();
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
                Only {spotsRemaining} Spots Remaining
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
              Founding Creator Program.
            </h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Lock in founder pricing forever while shaping infrastructure built
              by people who understand what creators actually need.
            </p>

            {/* Founding price callout — concrete numbers, not just "lock in" */}
            <div className="grid sm:grid-cols-3 gap-3 mb-12 max-w-2xl">
              <div className="p-4 rounded-xl border border-primary/20 bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Solo founder rate</p>
                <p className="text-2xl font-bold text-foreground">$79<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1 line-through">$99/mo standard</p>
              </div>
              <div className="p-4 rounded-xl border border-primary/20 bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Plus founder rate</p>
                <p className="text-2xl font-bold text-foreground">$103<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1 line-through">$129/mo standard</p>
              </div>
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                <p className="text-xs text-primary mb-1">Pro founder rate</p>
                <p className="text-2xl font-bold text-foreground">$159<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1 line-through">$199/mo standard</p>
              </div>
            </div>

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
                Apply for founding access
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
