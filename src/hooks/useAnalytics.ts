import { useEffect, useCallback } from "react";
import { useCookieConsent } from "./useCookieConsent";

// Google Analytics 4 Measurement ID
// This is a publishable key - safe to include in frontend code
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Replace with your actual GA4 Measurement ID

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const loadGoogleAnalytics = () => {
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

  console.log("[GA4] Initialized with consent");
};

const disableGoogleAnalytics = () => {
  // Set opt-out cookie
  const key = `ga-disable-${GA_MEASUREMENT_ID}`;
  (window as unknown as Record<string, boolean>)[key] = true;
  console.log("[GA4] Disabled - no consent");
};

export const useAnalytics = () => {
  const { consent, hasInteracted } = useCookieConsent();

  useEffect(() => {
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
      if (consent?.analytics && window.gtag) {
        window.gtag("event", eventName, parameters);
        console.log("[GA4] Event:", eventName, parameters);
      }
    },
    [consent]
  );

  // Track page views (for SPA navigation)
  const trackPageView = useCallback(
    (path?: string) => {
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
