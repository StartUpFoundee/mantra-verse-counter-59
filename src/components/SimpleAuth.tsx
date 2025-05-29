
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { dataFortress } from "@/utils/dataFortress";
import { User, Shield } from "lucide-react";

interface SimpleAuthProps {
  onAuthSuccess: () => void;
}

const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthSuccess }) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        id: `USER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: "local@localhost",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        syncEnabled: false,
        isLocal: true
      };
      
      // Save user data and enable auto-login
      localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
      dataFortress.saveUserForAutoLogin(userData);
      
      toast.success(`Welcome ${userData.name}! Your data is protected with Fort Knox security.`);
      onAuthSuccess();
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Failed to create user account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
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
    dataFortress.saveUserForAutoLogin(guestUser);
    toast.success("Welcome Guest! Your data is protected locally.");
    onAuthSuccess();
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">
            🔒 Secure Local Access
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your data stays on your device with triple backup protection
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-amber-200 focus:border-amber-400"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateUser();
              }
            }}
          />
        </div>
        
        <Button
          onClick={handleCreateUser}
          disabled={!name.trim() || isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <User className="w-4 h-4 mr-2" />
          {isLoading ? "Creating..." : "Create Local Account"}
        </Button>
        
        <div className="text-center">
          <span className="text-gray-400 text-sm">or</span>
        </div>
        
        <Button
          onClick={handleGuestLogin}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};

export default SimpleAuth;
