import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

const plans = [
  {
    name: "Creator Solo",
    monthlyPrice: "$49",
    annualPrice: "$39",
    period: "/ month",
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
    monthlyPrice: "$149",
    annualPrice: "$119",
    period: "/ month",
    description: "For creators running multiple worlds or collaborations.",
    features: [
      "Multiple worlds (prod + staging/collab)",
      "Priority restores",
      "Assisted upgrades",
      "Higher performance envelope",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Events & Collabs",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    period: "",
    description: "Temporary scaling for special events and collaborations.",
    features: [
      "Temporary scaling",
      "Event-ready infrastructure",
      "Time-boxed pricing",
      "Dedicated support",
      "Custom configuration",
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
      button_text: "Get Started",
    });
  };

  const handleToggle = (annual: boolean) => {
    setIsAnnual(annual);
    trackEvent("pricing_toggle", {
      billing_period: annual ? "annual" : "monthly",
    });
  };

  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transparent, Outcome-Based Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No long-term contracts. You always own your world.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span 
            className={`text-sm font-medium transition-colors cursor-pointer ${
              !isAnnual ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => handleToggle(false)}
          >
            Monthly
          </span>
          
          <button
            onClick={() => handleToggle(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? "bg-primary" : "bg-muted"
            }`}
            aria-label="Toggle annual billing"
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md"
              animate={{ x: isAnnual ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          
          <div className="flex items-center gap-2">
            <span 
              className={`text-sm font-medium transition-colors cursor-pointer ${
                isAnnual ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => handleToggle(true)}
            >
              Annual
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/20 text-primary">
              Save 20%
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative p-8 rounded-2xl border shadow-card ${
                plan.highlighted
                  ? "bg-card-gradient border-primary/50 shadow-glow"
                  : "bg-card-gradient border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <motion.span 
                    key={isAnnual ? "annual" : "monthly"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-foreground whitespace-nowrap"
                  >
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </motion.span>
                  {plan.period && (
                    <span className="text-muted-foreground whitespace-nowrap">{plan.period}</span>
                  )}
                </div>
                {isAnnual && plan.annualPrice !== "Custom" && (
                  <span className="text-xs text-primary mt-1 block">billed annually</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.highlighted ? "hero" : "outline"}
                className="w-full"
                asChild
              >
                <Link to="/apply" onClick={() => handlePlanClick(plan.name)}>
                  Get Started
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Annual discount note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          {isAnnual 
            ? "🎉 You're viewing discounted annual rates" 
            : "💡 Switch to annual billing to save up to 20%"
          }
        </motion.p>
      </div>
    </section>
  );
};
