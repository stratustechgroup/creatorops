import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSpotsConfig } from "@/hooks/useSpotsConfig";

export const FinalCTA = () => {
  const { trackEvent } = useAnalytics();
  const { spotsRemaining, loading } = useSpotsConfig();

  const foundingOpen = !loading && spotsRemaining > 0;
  const cta = foundingOpen
    ? { to: "/founding-apply", label: "Apply for founding access" }
    : { to: "/apply", label: "Request access" };

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "final_cta",
      button_text: cta.label,
    });
  };

  return (
    <section className="py-24 lg:py-32 bg-card/30">
      <div className="container-default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Label */}
          <p className="text-sm text-primary font-medium mb-6 tracking-wide">
            READY WHEN YOU ARE
          </p>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">
            Stop risking your content on fragile setups.
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            If you're serious about Minecraft creation, your infrastructure
            should be too.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
            {[
              { icon: Shield, label: "IP Protected" },
              { icon: Zap, label: "Content Safe" },
              { icon: Server, label: "Infra Handled" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Link
              to={cta.to}
              onClick={handleApplyClick}
              className="btn-primary text-lg px-8 py-4"
            >
              {cta.label}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-muted-foreground">
              No commitment required · Response within 48 hours · 30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
