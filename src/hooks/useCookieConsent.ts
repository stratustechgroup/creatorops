import { useState, useEffect, useCallback } from "react";

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "cookie-consent";
const CONSENT_TIMESTAMP_KEY = "cookie-consent-timestamp";

const defaultConsent: CookieConsent = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
};

export const useCookieConsent = () => {
  const [consent, setConsentState] = useState<CookieConsent | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
    
    if (stored && timestamp) {
      // Check if consent is older than 12 months (GDPR recommendation)
      const consentDate = new Date(timestamp);
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      
      if (consentDate > twelveMonthsAgo) {
        setConsentState(JSON.parse(stored));
        setHasInteracted(true);
      } else {
        // Consent expired, clear and ask again
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
        setConsentState(defaultConsent);
      }
    } else {
      setConsentState(defaultConsent);
    }
  }, []);

  const saveConsent = useCallback((newConsent: CookieConsent) => {
    setConsentState(newConsent);
    setHasInteracted(true);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, new Date().toISOString());
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  }, [saveConsent]);

  const acceptNecessary = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  }, [saveConsent]);

  const updateConsent = useCallback((updates: Partial<CookieConsent>) => {
    if (consent) {
      saveConsent({ ...consent, ...updates, necessary: true });
    }
  }, [consent, saveConsent]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
    setConsentState(defaultConsent);
    setHasInteracted(false);
  }, []);

  return {
    consent,
    hasInteracted,
    acceptAll,
    acceptNecessary,
    updateConsent,
    saveConsent,
    resetConsent,
  };
};
