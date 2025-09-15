import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Pages
import Home from "@/pages/home";
import PrivacyAudit from "@/pages/privacy-audit";
import DigitalFootprint from "@/pages/digital-footprint";
import HarassmentDetection from "@/pages/harassment-detection";
import SecurityChecklist from "@/pages/security-checklist";
import SafeCommunication from "@/pages/safe-communication";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";

// Components
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import QuickExit from "@/components/emergency/quick-exit";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/privacy-audit" component={PrivacyAudit} />
          <Route path="/digital-footprint" component={DigitalFootprint} />
          <Route path="/harassment-detection" component={HarassmentDetection} />
          <Route path="/security-checklist" component={SecurityChecklist} />
          <Route path="/safe-communication" component={SafeCommunication} />
          <Route path="/resources" component={Resources} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <QuickExit />
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize session ID if not exists
    if (!localStorage.getItem('cybershe-session')) {
      fetch('/api/session', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('cybershe-session', data.sessionId);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
