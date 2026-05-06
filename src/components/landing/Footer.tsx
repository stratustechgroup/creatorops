import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";
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
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const FooterLink = ({
    href,
    label,
    isAnchor,
  }: {
    href: string;
    label: string;
    isAnchor?: boolean;
  }) => {
    if (isAnchor) {
      return (
        <a
          href={href}
          onClick={(e) => handleSmoothScroll(e, href)}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        to={href}
        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        {label}
      </Link>
    );
  };

  return (
    <footer className="border-t border-white/5">
      <div className="container-default">
        {/* Main footer content */}
        <div className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-6 gap-12"
          >
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
                <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
                <span className="font-semibold text-foreground tracking-tight">
                  Creator Ops
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
                Managed Minecraft infrastructure for content creators. You
                create, we handle the rest.
              </p>

              <a
                href="mailto:hi@creatorops.io"
                className="text-sm text-primary hover:text-primary/80 transition-colors block mb-3"
              >
                hi@creatorops.io
              </a>

              {/*
                Community link — uncomment and update href once a public Discord
                / community space exists. Lower-commitment hook for visitors
                who aren't ready to apply but want to follow along.
              */}
              {/*
              <a
                href="https://discord.gg/creatorops"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Join the Discord →
              </a>
              */}
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">
                Product
              </h4>
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
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">
                Program
              </h4>
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
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">
                Company
              </h4>
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
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide">
                Legal
              </h4>
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
      <div className="border-t border-white/5">
        <div className="container-default py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>
              {new Date().getFullYear()} Stratus Technology Group, LLC DBA
              Creator Ops
            </span>
            <span className="text-xs text-muted-foreground/60">
              Not affiliated with Mojang Studios. Minecraft is a trademark of
              Mojang Studios.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
