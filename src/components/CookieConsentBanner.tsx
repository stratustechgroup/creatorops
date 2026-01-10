import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Settings, X, Shield } from "lucide-react";
import { useCookieConsent, CookieConsent } from "@/hooks/useCookieConsent";
import { Link } from "react-router-dom";

export const CookieConsentBanner = () => {
  const { consent, hasInteracted, acceptAll, acceptNecessary, saveConsent } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // Don't show if already interacted
  if (hasInteracted || !consent) return null;

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowPreferences(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4"
      >
        <div className="container max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            {!showPreferences ? (
              // Main banner
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                      By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or 
                      learn more in our{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="hero" size="sm" onClick={acceptAll}>
                        Accept All
                      </Button>
                      <Button variant="outline" size="sm" onClick={acceptNecessary}>
                        Necessary Only
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPreferences(true)}
                        className="text-muted-foreground"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Preferences panel
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Necessary cookies */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                    <div>
                      <Label className="text-foreground font-medium">
                        Necessary Cookies
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                    <Switch checked disabled className="opacity-50" />
                  </div>

                  {/* Analytics cookies */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                    <div>
                      <Label className="text-foreground font-medium">
                        Analytics Cookies
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Help us understand how visitors interact with our website to improve user experience.
                      </p>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, analytics: checked })
                      }
                    />
                  </div>

                  {/* Marketing cookies */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Label className="text-foreground font-medium">
                        Marketing Cookies
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Used to deliver personalized advertisements and track campaign performance.
                      </p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, marketing: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                  <Button variant="hero" size="sm" onClick={handleSavePreferences}>
                    Save Preferences
                  </Button>
                  <Button variant="outline" size="sm" onClick={acceptAll}>
                    Accept All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
