import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ConsentProvider, useConsent } from "@/components/CookieConsent";
import CookieConsentBanner from "@/components/CookieConsent";
import { trackPageView } from "@/lib/analytics";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import BlochSpherePage from "@/pages/BlochSpherePage";
import PauliTrainerPage from "@/pages/PauliTrainerPage";
import AboutPage from "@/pages/AboutPage";
import NewsletterPage from "@/pages/NewsletterPage";
import PoliciesPage from "@/pages/PoliciesPage";
import NotFound from "@/pages/not-found";

/** Track SPA route changes in GA. */
function RouteTracker() {
  const [location] = useLocation();
  const { consent } = useConsent();

  useEffect(() => {
    if (consent === "accepted") {
      trackPageView(location);
    }
  }, [location, consent]);

  return null;
}

/** Conditionally render Vercel Analytics & SpeedInsights based on consent. */
function ConsentAnalytics() {
  const { consent } = useConsent();
  if (consent !== "accepted") return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/bloch-sphere" component={BlochSpherePage} />
        <Route path="/pauli-trainer" component={PauliTrainerPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/newsletter" component={NewsletterPage} />
        <Route path="/policies" component={PoliciesPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConsentProvider>
          <Toaster />
          <Router />
          <RouteTracker />
          <ConsentAnalytics />
          <CookieConsentBanner />
        </ConsentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
