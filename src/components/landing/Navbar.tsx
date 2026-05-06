import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { FoundingBanner } from "./FoundingBanner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAnalytics } from "@/hooks/useAnalytics";
import { urlForPath } from "@/lib/hosts";
import { cn } from "@/lib/utils";

interface NavLinkDef {
  label: string;
  href: string;
  isPage?: boolean;
}

const navLinks: NavLinkDef[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Founding Program", href: "/founding-creators", isPage: true },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  hideNavLinks?: boolean;
}

const navLinkClass =
  "px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/5";

const navLinkActiveClass = "text-foreground bg-white/5";

const signInClass =
  "inline-flex items-center h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/5";

const primaryButtonClass =
  "inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] hover:bg-primary/90 active:bg-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export const Navbar = ({ hideNavLinks = false }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
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
      button_text: "Request access",
    });
  };

  const isPageLinkActive = (href: string) =>
    href === location.pathname || location.pathname.startsWith(`${href}/`);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <FoundingBanner hidden={hideNavLinks} />
      <div className="container-default">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo — UNCHANGED */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
            <span className="font-semibold text-foreground tracking-tight">
              Creator Ops
            </span>
          </Link>

          {/* Desktop primary nav */}
          {!hideNavLinks && (
            <nav
              aria-label="Primary"
              className="hidden lg:flex items-center gap-0.5 mx-6"
            >
              {navLinks.map((link) =>
                link.isPage ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      navLinkClass,
                      isPageLinkActive(link.href) && navLinkActiveClass,
                    )}
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
                    onClick={(e) =>
                      handleSmoothScroll(e, link.href, link.label)
                    }
                    className={navLinkClass}
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
          )}

          {/* Desktop right cluster */}
          <div
            className={cn(
              "items-center gap-1.5",
              hideNavLinks ? "flex" : "hidden lg:flex",
            )}
          >
            <ThemeToggle />
            <span
              aria-hidden="true"
              className="hidden sm:block h-5 w-px bg-white/10 mx-1"
            />
            <a href={urlForPath("/login")} className={signInClass}>
              Sign in
            </a>
            <Link
              to="/apply"
              onClick={handleApplyClick}
              className={primaryButtonClass}
            >
              Request access
            </Link>
          </div>

          {/* Mobile menu toggle */}
          {!hideNavLinks && (
            <div className="lg:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/5 transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
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

      {/* Mobile drawer */}
      <AnimatePresence>
        {!hideNavLinks && isMobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-white/[0.06]"
          >
            <div className="container-default py-4 space-y-1">
              {navLinks.map((link, index) =>
                link.isPage ? (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
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
                      className={cn(
                        "block px-3 py-3 text-base text-foreground hover:bg-white/5 transition-colors rounded-md",
                        isPageLinkActive(link.href) && "bg-white/5",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) =>
                      handleSmoothScroll(e, link.href, link.label)
                    }
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="block px-3 py-3 text-base text-foreground hover:bg-white/5 transition-colors rounded-md"
                  >
                    {link.label}
                  </motion.a>
                ),
              )}

              {/* Auth actions */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="pt-3 mt-3 border-t border-white/[0.06] space-y-2"
              >
                <a
                  href={urlForPath("/login")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full h-10 px-4 text-sm font-medium text-foreground rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Sign in
                </a>
                <Link
                  to="/apply"
                  onClick={() => {
                    handleApplyClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(primaryButtonClass, "w-full h-10")}
                >
                  Request access
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
