/**
 * Subdomain split helpers.
 *
 * Production:
 *   - creatorops.io        → marketing site (public pages only)
 *   - dash.creatorops.io   → authenticated app (dashboard, settings, admin)
 *
 * Local dev / Vercel previews: both env vars are unset → all routes serve from
 * one host with no redirects (the host helpers return permissive defaults).
 */

const MARKETING_URL = import.meta.env.VITE_MARKETING_URL as string | undefined;
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL as string | undefined;

const DASH_ROUTES = [
  "/login",
  "/forgot-password",
  "/dashboard",
  "/support",
  "/settings",
  "/admin",
];

export function getMarketingUrl(): string {
  if (MARKETING_URL) return MARKETING_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function getDashboardUrl(): string {
  if (DASHBOARD_URL) return DASHBOARD_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/**
 * Normalize a host for comparison: strip leading "www." and lowercase.
 * Treats `www.creatorops.io` and `creatorops.io` as the same host so we
 * don't infinite-loop redirect between them.
 */
function normalizeHost(host: string): string {
  const lower = host.toLowerCase();
  return lower.startsWith("www.") ? lower.slice(4) : lower;
}

export function isOnDashboardHost(): boolean {
  // If env vars are unset (local dev / preview), treat all hosts as "both"
  if (!MARKETING_URL || !DASHBOARD_URL) return true; // default to permissive
  if (typeof window === "undefined") return false;
  try {
    const dashHost = normalizeHost(new URL(DASHBOARD_URL).host);
    return normalizeHost(window.location.host) === dashHost;
  } catch {
    return false;
  }
}

export function isOnMarketingHost(): boolean {
  if (!MARKETING_URL || !DASHBOARD_URL) return true;
  if (typeof window === "undefined") return false;
  try {
    const mktHost = normalizeHost(new URL(MARKETING_URL).host);
    return normalizeHost(window.location.host) === mktHost;
  } catch {
    return false;
  }
}

export function isDashRoute(path: string): boolean {
  return DASH_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
}

/**
 * For a given app path, return the absolute URL that path should live at.
 * Auth/app routes resolve to the dashboard host; everything else to marketing host.
 * Used for cross-subdomain links where <Link> would do a client-side nav that breaks.
 */
export function urlForPath(path: string): string {
  return (isDashRoute(path) ? getDashboardUrl() : getMarketingUrl()) + path;
}
