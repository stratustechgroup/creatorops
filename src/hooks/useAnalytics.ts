import { useEffect } from "react";
import { useCookieConsent } from "./useCookieConsent";

// Simple analytics implementation
// In production, replace with your actual analytics provider (GA4, Plausible, etc.)
const initAnalytics = () => {
  // Placeholder for analytics initialization
  console.log("[Analytics] Initialized with consent");
  
  // Track page views
  const trackPageView = () => {
    console.log("[Analytics] Page view:", window.location.pathname);
  };

  // Initial page view
  trackPageView();

  // Listen for route changes (for SPA navigation)
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    trackPageView();
  };

  window.addEventListener("popstate", trackPageView);

  return () => {
    window.removeEventListener("popstate", trackPageView);
    history.pushState = originalPushState;
  };
};

const disableAnalytics = () => {
  console.log("[Analytics] Disabled - no consent");
};

export const useAnalytics = () => {
  const { consent, hasInteracted } = useCookieConsent();

  useEffect(() => {
    if (!hasInteracted || !consent) return;

    if (consent.analytics) {
      const cleanup = initAnalytics();
      return cleanup;
    } else {
      disableAnalytics();
    }
  }, [consent, hasInteracted]);

  const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
    if (consent?.analytics) {
      console.log("[Analytics] Event:", eventName, properties);
      // In production: analytics.track(eventName, properties)
    }
  };

  return { trackEvent };
};
