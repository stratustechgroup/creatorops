import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

const plans = [
  {
    name: "Creator Solo",
    monthlyPrice: "$79",
    annualPrice: "$63",
    description: "Perfect for individual creators with one production world.",
    features: [
      "One production world",
      "Automated backups & rollback",
      "Version pinning",
      "Managed updates",
      "Standard support",
    ],
    highlighted: false,
  },
  {
    name: "Creator Pro",
    monthlyPrice: "$199",
    annualPrice: "$159",
    description: "For creators running multiple worlds or collaborations.",
    features: [
      "Multiple worlds (prod + staging)",
      "Priority restores (4-hour SLA)",
      "Assisted upgrades",
      "Higher performance",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Events & Collabs",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    description: "Temporary scaling for special events and collaborations.",
    features: [
      "Pre-event stress testing",
      "Dedicated monitoring",
      "Instant rollback capability",
      "Post-event reports",
      "Event Assurance",
    ],
    highlighted: false,
  },
];

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { trackEvent } = useAnalytics();

  const handlePlanClick = (planName: string) => {
    trackEvent("cta_click", {
      location: "pricing",
      plan_name: planName,
      billing_period: isAnnual ? "annual" : "monthly",
    });
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-card/30">
      <div className="container-default">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-primary font-medium mb-4 tracking-wide"
          >
            PRICING
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            Transparent, outcome-based pricing.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            No long-term contracts. You always own your world.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12"
        >
          <button
            onClick={() => setIsAnnual(false)}
            className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${isAnnual ? "bg-primary" : "bg-white/10"}`}
          >
            <motion.div
              className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annual
          </button>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Save 20%</span>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className={`relative p-6 rounded-2xl border ${
                plan.highlighted
                  ? "border-primary/30 bg-primary/[0.03]"
                  : "border-white/10 bg-card/50"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}

              <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                {plan.monthlyPrice !== "Custom" && (
                  <span className="text-muted-foreground">/ month</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/founding-apply"
                onClick={() => handlePlanClick(plan.name)}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10"
                }`}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          {["30-day money-back guarantee", "Cancel anytime", "You always own your world", "Event Assurance included"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
