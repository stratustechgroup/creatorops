import { useEffect, useCallback } from "react";
import { useCookieConsent } from "./useCookieConsent";

// Google Analytics 4 Measurement ID — set via VITE_GA_MEASUREMENT_ID env var.
// If unset or still the placeholder, GA never loads (no broken script requests).
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined;

const GA_ENABLED =
  !!GA_MEASUREMENT_ID &&
  GA_MEASUREMENT_ID.startsWith("G-") &&
  GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const loadGoogleAnalytics = () => {
  if (!GA_ENABLED || !GA_MEASUREMENT_ID) return;

  // Don't load if already loaded
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return;
  }

  // Load gtag.js script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Configure GA4
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    anonymize_ip: true, // GDPR compliance
    cookie_flags: "SameSite=None;Secure",
  });
};

const disableGoogleAnalytics = () => {
  if (!GA_ENABLED || !GA_MEASUREMENT_ID) return;
  // Set opt-out flag
  const key = `ga-disable-${GA_MEASUREMENT_ID}`;
  (window as unknown as Record<string, boolean>)[key] = true;
};

export const useAnalytics = () => {
  const { consent, hasInteracted } = useCookieConsent();

  useEffect(() => {
    if (!GA_ENABLED) return;
    if (!hasInteracted || !consent) return;

    if (consent.analytics) {
      loadGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
  }, [consent, hasInteracted]);

  // Track custom events
  const trackEvent = useCallback(
    (eventName: string, parameters?: Record<string, unknown>) => {
      if (!GA_ENABLED) return;
      if (consent?.analytics && window.gtag) {
        window.gtag("event", eventName, parameters);
      }
    },
    [consent]
  );

  // Track page views (for SPA navigation)
  const trackPageView = useCallback(
    (path?: string) => {
      if (!GA_ENABLED) return;
      if (consent?.analytics && window.gtag) {
        window.gtag("event", "page_view", {
          page_path: path || window.location.pathname,
          page_title: document.title,
        });
      }
    },
    [consent]
  );

  return { trackEvent, trackPageView };
};
