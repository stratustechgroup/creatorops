import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { Github, Twitter, Youtube } from "lucide-react";

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

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/creatorops", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@creatorops", label: "YouTube" },
  { icon: Github, href: "https://github.com/creatorops", label: "GitHub" },
];

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

              {/* Social links */}
              <div className="flex items-center gap-3 mb-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/10 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              <a
                href="mailto:hello@creatorops.io"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                hello@creatorops.io
              </a>
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
