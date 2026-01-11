import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageSkeleton } from "@/components/PageSkeleton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { AnalyticsPageTracker } from "@/components/AnalyticsPageTracker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages
const Apply = lazy(() => import("./pages/Apply"));
const FoundingCreators = lazy(() => import("./pages/FoundingCreators"));
const FoundingApply = lazy(() => import("./pages/FoundingApply"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const SLAAgreement = lazy(() => import("./pages/SLAAgreement"));
const FairUsagePolicy = lazy(() => import("./pages/FairUsagePolicy"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <AnalyticsPageTracker />
      <Suspense fallback={<PageSkeleton />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Index />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/founding-creators" element={<FoundingCreators />} />
            <Route path="/founding-apply" element={<FoundingApply />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sla" element={<SLAAgreement />} />
            <Route path="/fair-usage" element={<FairUsagePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <CookieConsentBanner />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
