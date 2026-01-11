import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnalytics } from "@/hooks/useAnalytics";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Founding Program", href: "/founding-creators", isPage: true },
  { label: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { trackEvent } = useAnalytics();

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
    
    trackEvent("nav_click", {
      link_label: label,
      link_href: href,
    });
  };

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "navbar",
      button_text: "Apply Now",
    });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-1 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and nav links together on the left */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <Logo className="w-9 h-9" />
              <span className="font-semibold text-foreground">Creator Ops</span>
            </Link>

            {/* Desktop nav links - now next to logo */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => trackEvent("nav_click", { link_label: link.label, link_href: link.href })}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href, link.label)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button variant="hero" size="sm" asChild>
              <Link to="/apply" onClick={handleApplyClick}>
                Apply Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container px-4 py-4 space-y-4">
              {navLinks.map((link, index) => (
                link.isPage ? (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        trackEvent("nav_click", { link_label: link.label, link_href: link.href });
                      }}
                      className="block py-2 text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href, link.label)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </motion.a>
                )
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full mt-2"
                  asChild
                >
                  <Link 
                    to="/apply" 
                    onClick={() => {
                      handleApplyClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Apply Now
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
