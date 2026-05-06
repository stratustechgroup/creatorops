import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { useSpotsConfig } from "@/hooks/useSpotsConfig";
import { isOnMarketingHost } from "@/lib/hosts";

const STORAGE_KEY = "founding-banner-dismissed-v1";

interface FoundingBannerProps {
  /** When true, banner never renders. */
  hidden?: boolean;
}

export function FoundingBanner({ hidden }: FoundingBannerProps) {
  const { spotsRemaining, loading } = useSpotsConfig();
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  // Server-side / pre-hydration: render nothing
  if (dismissed === null) return null;
  if (hidden) return null;
  if (dismissed) return null;
  if (!isOnMarketingHost()) return null;
  if (loading) return null;
  if (spotsRemaining <= 0) return null;

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  return (
    <div className="relative w-full bg-primary/10 border-b border-primary/20 backdrop-blur-sm">
      <div className="container-default">
        <div className="flex items-center justify-center gap-3 h-9 text-xs sm:text-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
          <p className="text-foreground/90 truncate">
            <span className="font-medium">Founding Creator Program</span>
            <span className="text-muted-foreground hidden sm:inline">
              {" "}— {spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"} remaining. Lock in your rate forever.
            </span>
            <span className="text-muted-foreground sm:hidden">
              {" "}— {spotsRemaining} left
            </span>
          </p>
          <Link
            to="/founding-apply"
            className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline shrink-0"
          >
            Apply
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        aria-label="Dismiss founding program banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
