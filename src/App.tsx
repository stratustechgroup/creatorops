import { Suspense, lazy } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ClerkProvider } from "@clerk/clerk-react";
import { ConvexReactClient, ConvexProvider, ConvexProviderWithAuth } from "convex/react";
import { PageSkeleton } from "@/components/PageSkeleton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { AnalyticsPageTracker } from "@/components/AnalyticsPageTracker";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { HostGuard } from "@/components/HostGuard";
import { useConvexAuth } from "@/lib/convexAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages
const Apply = lazy(() => import("./pages/Apply"));
const FoundingCreators = lazy(() => import("./pages/FoundingCreators"));
const FoundingApply = lazy(() => import("./pages/FoundingApply"));
const About = lazy(() => import("./pages/About"));
const Team = lazy(() => import("./pages/Team"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const SLAAgreement = lazy(() => import("./pages/SLAAgreement"));
const FairUsagePolicy = lazy(() => import("./pages/FairUsagePolicy"));
const StudioContact = lazy(() => import("./pages/StudioContact"));
const EventsQuote = lazy(() => import("./pages/EventsQuote"));

// Dashboard pages (lazy loaded)
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Support = lazy(() => import("./pages/Support"));
const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout"));
const SettingsProfile = lazy(() => import("./pages/settings/SettingsProfile"));
const SettingsSecurity = lazy(() => import("./pages/settings/SettingsSecurity"));
const SettingsNotifications = lazy(() => import("./pages/settings/SettingsNotifications"));
const SettingsTeam = lazy(() => import("./pages/settings/SettingsTeam"));
const SettingsAccount = lazy(() => import("./pages/settings/SettingsAccount"));

// Admin pages (lazy loaded)
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminTickets = lazy(() => import("./pages/admin/AdminTickets"));
const AdminSpots = lazy(() => import("./pages/admin/AdminSpots"));
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"));
const AdminInfrastructure = lazy(() => import("./pages/admin/AdminInfrastructure"));

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined;
if (!CONVEX_URL && import.meta.env.PROD) {
  console.error("VITE_CONVEX_URL is not set. The app will render but data fetches will fail.");
}
const convex = new ConvexReactClient(CONVEX_URL ?? "https://placeholder.convex.cloud");
const queryClient = new QueryClient();

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnalyticsPageTracker />
      <HostGuard />
      <Suspense fallback={<PageSkeleton />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            {/* Section aliases — render the same Index page, scrolled to section */}
            <Route path="/features" element={<Index />} />
            <Route path="/plans" element={<Index />} />
            <Route path="/faq" element={<Index />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/founding-creators" element={<FoundingCreators />} />
            <Route path="/founding-apply" element={<FoundingApply />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sla" element={<SLAAgreement />} />
            <Route path="/fair-usage" element={<FairUsagePolicy />} />
            <Route path="/studio" element={<StudioContact />} />
            <Route path="/events-quote" element={<EventsQuote />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/settings/profile" replace />} />
              <Route path="profile" element={<SettingsProfile />} />
              <Route path="security" element={<SettingsSecurity />} />
              <Route path="notifications" element={<SettingsNotifications />} />
              <Route path="team" element={<SettingsTeam />} />
              <Route path="account" element={<SettingsAccount />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminOverview />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminApplications />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminTickets />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/spots"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminSpots />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminStaff />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/infrastructure"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminInfrastructure />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <CookieConsentBanner />
    </>
  );
};

const AppCore = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// When Clerk is configured, use authenticated Convex connection.
// When Clerk key is missing (local dev without auth set up), fall back to
// an unauthenticated Convex connection so public pages still render.
const ConvexWithOptionalAuth = ({ children }: { children: React.ReactNode }) => {
  if (CLERK_KEY) {
    return (
      <ClerkProvider publishableKey={CLERK_KEY}>
        <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
          {children}
        </ConvexProviderWithAuth>
      </ClerkProvider>
    );
  }
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

const App = () => (
  <ConvexWithOptionalAuth>
    <AppCore />
  </ConvexWithOptionalAuth>
);

export default App;
