import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, ArrowRight } from "lucide-react";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const programLinks = [
  { label: "Founding Program", href: "/founding-creators" },
  { label: "Apply Now", href: "/founding-apply" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "SLA Agreement", href: "/sla" },
  { label: "Fair Usage Policy", href: "/fair-usage" },
];

export const Footer = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <footer className="relative border-t border-border bg-card/50">
      {/* Main footer */}
      <div className="container px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Top section - Brand and CTA */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-16">
            {/* Brand */}
            <div className="max-w-sm">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <Logo className="w-10 h-10" />
                <div>
                  <span className="font-bold text-lg text-foreground">Creator Ops</span>
                  <p className="text-xs text-muted-foreground">by Stratus Technology Group</p>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Managed Minecraft infrastructure built specifically for content creators. Focus on creating, not managing servers.
              </p>
            </div>

            {/* Contact CTA */}
            <div className="lg:text-right">
              <h4 className="font-semibold text-foreground mb-3">Get in Touch</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:hello@creatorops.io"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors lg:justify-end"
                >
                  <Mail className="w-4 h-4" />
                  hello@creatorops.io
                </a>
                <a
                  href="https://creatorops.io/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors lg:justify-end"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join our Discord
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-12" />

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Program */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Program</h4>
              <ul className="space-y-3">
                {programLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Stratus Technology Group. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 text-center md:text-right max-w-md">
              Creator Ops is a trademark of Stratus Technology Group. Minecraft is a trademark of Mojang Studios. We are not affiliated with or endorsed by Mojang Studios.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
