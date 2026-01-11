import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "SLA Agreement", href: "/sla" },
  { label: "Fair Usage Policy", href: "/fair-usage" },
];

const trustSignals = [
  "Creator-first infrastructure",
  "You own your world, always",
  "Built for stability, not hype",
];

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo and company */}
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <div>
                <span className="font-semibold text-foreground">Creator Ops</span>
                <p className="text-xs text-muted-foreground">by Stratus Technology Group</p>
              </div>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {signal}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Legal links and copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Stratus Technology Group. All rights reserved.
            </p>
          </div>

          {/* Trademark notice */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground/70">
              Creator Ops™ is a trademark of Stratus Technology Group.
              Minecraft is a trademark of Mojang Studios. We are not affiliated with or endorsed by Mojang Studios.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
