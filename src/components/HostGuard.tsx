import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  isDashRoute,
  isOnDashboardHost,
  isOnMarketingHost,
  urlForPath,
} from "@/lib/hosts";

/**
 * Renders nothing. On every navigation, checks whether the current path
 * matches the current host. If a dash route is being requested on the
 * marketing host (or vice versa), it does a hard redirect to the correct
 * host. When the subdomain env vars are unset (local dev / Vercel preview),
 * both isOnDashboardHost and isOnMarketingHost return true, so this is a
 * no-op.
 */
export function HostGuard() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const wantsDash = isDashRoute(path);
    const onDash = isOnDashboardHost();
    const onMkt = isOnMarketingHost();

    // If env vars unset, both isOnDashboardHost and isOnMarketingHost return
    // true → no redirect (permissive in dev/preview).
    if (onDash && onMkt) return;

    if (wantsDash && !onDash) {
      window.location.href = urlForPath(path) + location.search + location.hash;
      return;
    }
    if (!wantsDash && !onMkt) {
      window.location.href = urlForPath(path) + location.search + location.hash;
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}
