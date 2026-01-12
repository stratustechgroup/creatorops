import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, RefreshCcw, Lock, Sparkles, Zap } from "lucide-react";
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
      { text: "One production world", highlight: false },
      { text: "Automated backups & rollback", highlight: false },
      { text: "Version pinning", highlight: false },
      { text: "Managed updates", highlight: false },
      { text: "Standard support", highlight: false },
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
      { text: "Multiple worlds", highlight: true, detail: "prod + staging/collab" },
      { text: "Priority restores", highlight: true, detail: "4-hour SLA" },
      { text: "Assisted upgrades", highlight: false },
      { text: "Higher performance envelope", highlight: false },
      { text: "Priority support", highlight: true },
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
      { text: "Pre-event stress testing", highlight: true },
      { text: "Dedicated monitoring during event", highlight: true },
      { text: "Instant rollback capability", highlight: false },
      { text: "Post-event performance report", highlight: false },
      { text: "Event Assurance guarantee", highlight: true, detail: "included" },
    ],
    highlighted: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

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
          viewport={{ once: true, margin: "-50px" }}
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

        <motion.div 
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.2, ease: "easeOut" } 
              }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 flex flex-col ${
                plan.highlighted
                  ? "bg-gradient-to-b from-card to-card/80 border-primary/50 shadow-glow"
                  : "bg-card border-border shadow-card hover:border-primary/30"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                {plan.monthlyPrice !== "Custom" && (
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Starting at</span>
                )}
                <div className="flex items-baseline gap-2 flex-wrap">
                  <motion.span 
                    key={isAnnual ? "annual" : "monthly"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-foreground whitespace-nowrap"
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
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {plan.description}
              </p>
              
              {/* Feature divider */}
              <div className="border-t border-border/50 mb-6" />
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${feature.highlight ? 'bg-primary/20' : 'bg-secondary'}`}>
                      <Check className={`w-3.5 h-3.5 ${feature.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${feature.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {feature.text}
                      </span>
                      {feature.detail && (
                        <span className="text-xs text-primary ml-1">({feature.detail})</span>
                      )}
                    </div>
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
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-16 pt-8 border-t border-border/50"
        >
          {[
            { icon: ShieldCheck, text: "30-day money-back guarantee" },
            { icon: RefreshCcw, text: "Cancel anytime" },
            { icon: Lock, text: "You always own your world" },
            { icon: Zap, text: "Event Assurance included" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <div className="p-1.5 rounded-lg bg-secondary/50">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Event Assurance note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="max-w-2xl mx-auto mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Event Assurance:</span> If your server crashes during a scheduled live event due to our infrastructure, you get one month credit. We put our money where our mouth is.
          </p>
        </motion.div>

        {/* Annual discount note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
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
