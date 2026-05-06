import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

const plans = [
  {
    name: "Creator Solo",
    monthlyPrice: "$99",
    annualPrice: "$79",
    description: "For individual creators who can't afford downtime on their main world.",
    features: [
      "One production world, always ready to record",
      "Roll back to any point — never lose world progress",
      "Locked to your exact version until you decide to change",
      "We handle updates. You just hit record.",
      "Standard support, 24-hour response window",
    ],
    highlighted: false,
    cta: "Apply Now",
    href: "/apply",
  },
  {
    name: "Creator Plus",
    monthlyPrice: "$129",
    annualPrice: "$103",
    description: "For creators ready to test changes before their audience ever sees them.",
    features: [
      "Production world + dedicated staging environment",
      "Push updates to staging first — go live when ready",
      "Roll back to any point — never lose world progress",
      "Managed updates and version control",
      "Standard support, 12-hour response window",
    ],
    highlighted: false,
    cta: "Apply Now",
    href: "/apply",
  },
  {
    name: "Creator Pro",
    monthlyPrice: "$199",
    annualPrice: "$159",
    description: "For creators running a real operation — multiple worlds, real SLAs, real support.",
    features: [
      "Unlimited worlds — production, staging, and more",
      "4-hour guaranteed restore, even at 2am before a big upload",
      "Event Assurance + pre-event stress testing for collabs and charity streams",
      "Performance tuned for larger audiences and heavier modpacks",
      "Priority support, 1-hour response window",
    ],
    highlighted: true,
    cta: "Apply Now",
    href: "/apply",
  },
  {
    name: "Creator Studio",
    monthlyPrice: "$399",
    annualPrice: "$319",
    description: "For established creators and networks who need dedicated infrastructure and a real point of contact.",
    features: [
      "Dedicated managed server built for your workflow",
      "Custom SLA — you define the restore times and response windows",
      "Dedicated account manager who knows your setup by name",
      "White-glove onboarding and world migration included",
      "Network-level support: multi-creator SMPs, event burst capacity",
    ],
    highlighted: false,
    cta: "Talk to Us",
    href: "/studio",
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
    <section id="plans" className="py-24 lg:py-32 bg-card/30">
      <div className="container-default">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-primary font-medium mb-4 tracking-wide"
          >
            PLANS
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6"
          >
            Transparent, outcome-based plans.
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
          role="group"
          aria-label="Billing period"
          className="flex items-center gap-4 mb-12"
        >
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            aria-pressed={!isAnnual}
            className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            aria-label="Toggle annual billing"
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
            type="button"
            onClick={() => setIsAnnual(true)}
            aria-pressed={isAnnual}
            className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
          >
            Annual
          </button>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Save 20%</span>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index }}
              className={`relative p-6 rounded-2xl border flex flex-col ${
                plan.highlighted
                  ? "border-primary/30 bg-primary/[0.03]"
                  : "border-white/10 bg-card/50"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">/ month</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                onClick={() => handlePlanClick(plan.name)}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white/5 text-foreground hover:bg-white/10 border border-white/10"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Money-back guarantee — visible on every card, not buried below */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>30-day money-back guarantee</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Events & Collabs Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 rounded-2xl border border-white/10 bg-card/50 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">Events & Collabs</h3>
            <p className="text-sm text-muted-foreground">
              Temporary scaling for special events, charity streams, and creator collaborations — including pre-event stress testing, dedicated monitoring, instant rollback, and post-event reports. Priced per engagement.
            </p>
          </div>
          <Link
            to="/events-quote"
            onClick={() => handlePlanClick("Events & Collabs")}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/5 text-foreground hover:bg-white/10 border border-white/10 transition-colors"
          >
            Get a Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          {["30-day money-back guarantee", "Cancel anytime", "You always own your world", "Event Assurance included on Studio"].map((item) => (
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
