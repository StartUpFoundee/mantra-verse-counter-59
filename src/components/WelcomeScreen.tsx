
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { initializeDatabase } from "@/utils/indexedDBUtils";
import ModernCard from "./ModernCard";
import GoogleAuthButton from "./GoogleAuthButton";
import { Button } from "@/components/ui/button";

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsMigrating(true);
      await initializeDatabase();
      console.log("Database initialization completed");
      setIsMigrating(false);
    };
    init();
  }, [location]);

  if (isMigrating) {
    return (
      <ModernCard className="w-full max-w-md mx-auto p-8 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-orange-400 text-lg mb-6">Setting up your spiritual journey...</div>
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ModernCard>
    );
  }

  const handleAuthSuccess = () => {
    toast.success("Welcome to your spiritual journey!");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleContinueAsGuest = () => {
    // Create a basic guest user
    const guestUser = {
      id: `GUEST_${Date.now()}`,
      name: "Guest User",
      email: "guest@localhost",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      syncEnabled: false,
      isGuest: true
    };
    
    localStorage.setItem('chantTrackerUserData', JSON.stringify(guestUser));
    toast.success("Welcome! You can upgrade to Google sync anytime.");
    navigate("/");
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 lg:max-w-2xl lg:p-8">
      <ModernCard className="p-6 lg:p-8 border-orange-200/30 dark:border-orange-700/30" gradient>
        <div className="text-center mb-6 lg:mb-8">
          <div className="text-6xl lg:text-7xl mb-4">🕉️</div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Welcome to Naam Jaapa Counter
          </h1>
          <p className="text-orange-700 dark:text-orange-300 text-sm lg:text-base font-medium mb-1">
            नाम जप काउंटर में आपका स्वागत है
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
            Begin tracking your sacred mantra repetitions
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
              🔐 Secure Google Authentication
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sign in with Google for unlimited cloud sync across all your devices
            </p>
          </div>
          
          <GoogleAuthButton onAuthSuccess={handleAuthSuccess} />
          
          <div className="text-center">
            <span className="text-gray-400 text-sm">or</span>
          </div>
          
          <Button
            onClick={handleContinueAsGuest}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Continue as Guest (Local Only)
          </Button>
        </div>
        
        <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Google sync: Unlimited free storage (15GB Drive space)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Works across all your devices</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Secure OAuth 2.0 authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">ℹ</span>
            <span>Guest mode: Data stored locally on this device only</span>
          </div>
        </div>
        
        <div className="mt-6 lg:mt-8 pt-4 border-t border-gray-200/50 dark:border-zinc-700/50">
          <p className="text-xs lg:text-sm text-center text-gray-500 dark:text-gray-400">
            Your spiritual practice data is private and secure. Google authentication provides the best sync experience.
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default WelcomeScreen;
