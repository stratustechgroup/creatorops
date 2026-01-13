import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnalytics } from "@/hooks/useAnalytics";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Founding Program", href: "/founding-creators", isPage: true },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  hideNavLinks?: boolean;
}

export const Navbar = ({ hideNavLinks = false }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    trackEvent("nav_click", {
      link_label: label,
      link_href: href,
    });

    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleApplyClick = () => {
    trackEvent("cta_click", {
      location: "navbar",
      button_text: "Get Started",
    });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="container-default">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="font-semibold text-foreground tracking-tight">
              Creator Ops
            </span>
          </Link>

          {/* Desktop navigation */}
          {!hideNavLinks && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) =>
                link.isPage ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                    onClick={() =>
                      trackEvent("nav_click", {
                        link_label: link.label,
                        link_href: link.href,
                      })
                    }
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href, link.label)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          )}

          {/* Right side */}
          <div
            className={`${
              hideNavLinks ? "flex" : "hidden md:flex"
            } items-center gap-3`}
          >
            <ThemeToggle />
            <Link
              to="/founding-apply"
              onClick={handleApplyClick}
              className="btn-primary text-sm py-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          {!hideNavLinks && (
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-foreground"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {!hideNavLinks && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="container-default py-6 space-y-2">
              {navLinks.map((link, index) =>
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
                        trackEvent("nav_click", {
                          link_label: link.label,
                          link_href: link.href,
                        });
                      }}
                      className="block py-3 text-foreground hover:text-primary transition-colors"
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
                    className="block py-3 text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </motion.a>
                )
              )}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-4"
              >
                <Link
                  to="/founding-apply"
                  onClick={() => {
                    handleApplyClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full justify-center"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
