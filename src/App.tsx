
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AudioCountPage from "./pages/AudioCountPage";
import ManualCountPage from "./pages/ManualCountPage";
import SpiritualIdPage from "./pages/SpiritualIdPage";
import IdentityGuidePage from "./pages/IdentityGuidePage";
import ActiveDaysPage from "./pages/ActiveDaysPage";
import NotFound from "./pages/NotFound";
import WelcomeScreen from "./components/WelcomeScreen";
import { initializeDatabase } from "./utils/indexedDBUtils";
import { dataFortress } from "./utils/dataFortress";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Initialize the Fort Knox data protection system
  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      console.log("🔒 Fort Knox data protection system initialized");
    };
    init();
  }, []);

  // Check if user is logged in via auto-login
  const autoLoginUser = dataFortress.autoLogin();
  const hasUserData = localStorage.getItem('chantTrackerUserData');

  // Show welcome screen if no user data
  if (!autoLoginUser && !hasUserData) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
            <WelcomeScreen />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/audio" element={<AudioCountPage />} />
            <Route path="/manual" element={<ManualCountPage />} />
            <Route path="/spiritual-id" element={<SpiritualIdPage />} />
            <Route path="/identity-guide" element={<IdentityGuidePage />} />
            <Route path="/active-days" element={<ActiveDaysPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
