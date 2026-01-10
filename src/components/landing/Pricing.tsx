import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface PricingProps {
  onApplyClick: () => void;
}

const plans = [
  {
    name: "Creator Solo",
    price: "$49–79",
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
    price: "$149–249",
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
    price: "Custom",
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

export const Pricing = ({ onApplyClick }: PricingProps) => {
  const { trackEvent } = useAnalytics();

  const handlePlanClick = (planName: string) => {
    trackEvent("cta_click", {
      location: "pricing",
      plan_name: planName,
      button_text: "Get Started",
    });
    onApplyClick();
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transparent, Outcome-Based Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No long-term contracts. You always own your world.
          </p>
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
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
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
                onClick={() => handlePlanClick(plan.name)}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
