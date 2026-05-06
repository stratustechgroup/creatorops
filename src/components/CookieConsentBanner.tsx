import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCookieConsent, CookieConsent } from "@/hooks/useCookieConsent";

interface PreferenceRowProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

function PreferenceRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <Label className="text-xs font-medium text-foreground">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className={disabled ? "opacity-50 shrink-0" : "shrink-0"}
      />
    </div>
  );
}

export const CookieConsentBanner = () => {
  const { consent, hasInteracted, acceptAll, acceptNecessary, saveConsent } =
    useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  if (hasInteracted || !consent) return null;

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowPreferences(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto z-[100] sm:max-w-[380px]"
        role="region"
        aria-label="Cookie consent"
      >
        <div className="bg-card/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
          {!showPreferences ? (
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Cookie className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Cookies
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We use cookies for analytics and to improve your
                    experience. See our{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="flex-1 h-8 text-xs"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="flex-1 h-8 text-xs"
                >
                  Reject
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Customize
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-foreground">
                  Cookie preferences
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose which cookies you allow.
                </p>
              </div>

              <div className="space-y-3 mb-4 border-t border-white/5 pt-3">
                <PreferenceRow
                  label="Necessary"
                  description="Required for the site to work. Always on."
                  checked
                  disabled
                />
                <PreferenceRow
                  label="Analytics"
                  description="Helps us understand site usage."
                  checked={preferences.analytics}
                  onChange={(v) =>
                    setPreferences({ ...preferences, analytics: v })
                  }
                />
                <PreferenceRow
                  label="Marketing"
                  description="Used for ad personalization."
                  checked={preferences.marketing}
                  onChange={(v) =>
                    setPreferences({ ...preferences, marketing: v })
                  }
                />
              </div>

              <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                <Button
                  size="sm"
                  onClick={handleSavePreferences}
                  className="flex-1 h-8 text-xs"
                >
                  Save preferences
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                  className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
