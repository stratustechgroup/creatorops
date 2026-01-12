import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features", isAnchor: true },
    { label: "Pricing", href: "#pricing", isAnchor: true },
    { label: "FAQ", href: "#faq", isAnchor: true },
  ],
  program: [
    { label: "Founding Program", href: "/founding-creators" },
    { label: "Apply Now", href: "/founding-apply" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "SLA", href: "/sla" },
    { label: "Fair Usage", href: "/fair-usage" },
  ],
};

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

  const FooterLink = ({ href, label, isAnchor }: { href: string; label: string; isAnchor?: boolean }) => {
    if (isAnchor) {
      return (
        <a
          href={href}
          onClick={(e) => handleSmoothScroll(e, href)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
        </a>
      );
    }
    return (
      <Link to={href} className="text-muted-foreground hover:text-foreground transition-colors">
        {label}
      </Link>
    );
  };

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background to-secondary/20">
      {/* Main footer content */}
      <div className="container px-4">
        {/* Links section */}
        <div className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12"
          >
            {/* Brand - spans 2 columns on md+ */}
            <div className="col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-4">
                <Logo className="w-9 h-9" />
                <span className="font-bold text-lg text-foreground">Creator Ops</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Managed Minecraft infrastructure for content creators. You create, we handle the rest.
              </p>
              <a
                href="mailto:hello@creatorops.io"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@creatorops.io
              </a>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Program */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Program</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.program.map((link) => (
                  <li key={link.href}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 bg-secondary/30">
        <div className="container px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-border mx-2">·</span>
              <span>Stratus Technology Group</span>
            </div>
            <p className="text-xs text-muted-foreground/60 text-center md:text-right">
              Not affiliated with Mojang Studios. Minecraft is a trademark of Mojang Studios.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
