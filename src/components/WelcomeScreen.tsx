
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { initializeDatabase } from "@/utils/indexedDBUtils";
import { dataFortress } from "@/utils/dataFortress";
import ModernCard from "./ModernCard";
import SimpleAuth from "./SimpleAuth";
import BackupManager from "./BackupManager";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Cloud } from "lucide-react";

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMigrating, setIsMigrating] = useState(false);
  const [showBackupManager, setShowBackupManager] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsMigrating(true);
      await initializeDatabase();
      
      // Try auto-login with Fort Knox system
      const autoLoginUser = dataFortress.autoLogin();
      if (autoLoginUser) {
        toast.success(`Welcome back, ${autoLoginUser.name}!`);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        return;
      }
      
      console.log("🔒 Fort Knox data protection system ready");
      setIsMigrating(false);
    };
    init();
  }, [location, navigate]);

  if (isMigrating) {
    return (
      <ModernCard className="w-full max-w-md mx-auto p-8 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-orange-400 text-lg mb-6">🔒 Initializing Fort Knox Security...</div>
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

  if (showBackupManager) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Button 
          onClick={() => setShowBackupManager(false)}
          variant="outline"
          className="mb-4"
        >
          ← Back to Welcome
        </Button>
        <BackupManager />
      </div>
    );
  }

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

        {/* Fort Knox Security Features */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6 border border-amber-200/50 dark:border-amber-700/50">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800 dark:text-amber-200">🔒 Fort Knox Data Protection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-green-700 dark:text-green-300">Triple Backup System</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 dark:text-blue-300">Auto-Save Every 10s</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-300">Zero Data Loss</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <SimpleAuth onAuthSuccess={handleAuthSuccess} />

          <Button
            onClick={() => setShowBackupManager(true)}
            variant="outline"
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/20"
          >
            <Shield className="w-4 h-4 mr-2" />
            Advanced Backup Manager
          </Button>
        </div>
        
        <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Auto-login remembers you forever using browser fingerprint</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Triple backup ensures zero data loss</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Single window enforcement prevents conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">ℹ</span>
            <span>All data stored locally with military-grade protection</span>
          </div>
        </div>
        
        <div className="mt-6 lg:mt-8 pt-4 border-t border-gray-200/50 dark:border-zinc-700/50">
          <p className="text-xs lg:text-sm text-center text-gray-500 dark:text-gray-400">
            🔒 Fort Knox security ensures your spiritual practice data is never lost. Auto-save and triple backup system protects every mantra count.
          </p>
        </div>
      </ModernCard>
    </div>
  );
};

export default WelcomeScreen;
