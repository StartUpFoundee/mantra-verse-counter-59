
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { initializeDatabase } from "@/utils/indexedDBUtils";
import ModernCard from "./ModernCard";
import EmailAuthTabs from "./EmailAuthTabs";

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
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleContinueAsGuest = () => {
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
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
            🔐 Secure Email + PIN Authentication
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            One email, one sacred practice account. Your spiritual data stays secure and private.
          </p>
        </div>
        
        <EmailAuthTabs 
          onAuthSuccess={handleAuthSuccess}
          onContinueAsGuest={handleContinueAsGuest}
        />
        
        <div className="mt-6 lg:mt-8 pt-4 border-t border-gray-200/50 dark:border-zinc-700/50">
          <p className="text-xs lg:text-sm text-center text-gray-500 dark:text-gray-400">
            Your spiritual practice data is stored locally on your device for privacy and security.
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default WelcomeScreen;
