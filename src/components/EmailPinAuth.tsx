
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { generateEmailBasedID, validateEmail, validatePin } from "@/utils/emailIdentityUtils";
import { saveUserData } from "@/utils/spiritualIdUtils";
import { spiritualIcons } from "@/utils/spiritualIdUtils";
import SpiritualIconSelector from "./SpiritualIconSelector";
import ModernCard from "./ModernCard";

interface EmailPinAuthProps {
  onAuthSuccess: () => void;
  isLogin?: boolean;
}

const EmailPinAuth: React.FC<EmailPinAuthProps> = ({ onAuthSuccess, isLogin = false }) => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("om");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!validatePin(pin)) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }

    if (!isLogin && !name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      const userID = await generateEmailBasedID(email, pin);
      const iconObj = spiritualIcons.find(icon => icon.id === selectedIcon);

      const userData = {
        id: userID,
        email: email.toLowerCase(),
        name: name || "Spiritual Seeker",
        symbol: selectedIcon,
        symbolImage: iconObj?.symbol || "🕉️",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        chantingStats: {}
      };

      await saveUserData(userData);

      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      onAuthSuccess();
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernCard className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🕉️</div>
          <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-amber-600 dark:text-amber-400">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/80 dark:bg-zinc-900/80"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pin" className="text-amber-600 dark:text-amber-400">
            4-Digit PIN
          </Label>
          <Input
            id="pin"
            type="password"
            placeholder="1234"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
            className="bg-white/80 dark:bg-zinc-900/80"
          />
          <p className="text-xs text-gray-500">
            Choose a memorable 4-digit PIN for your account
          </p>
        </div>

        {!isLogin && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-amber-600 dark:text-amber-400">
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/80 dark:bg-zinc-900/80"
              />
            </div>

            <SpiritualIconSelector 
              selectedIcon={selectedIcon}
              onSelectIcon={setSelectedIcon}
            />
          </>
        )}

        <Button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
        </Button>
      </div>
    </ModernCard>
  );
};

export default EmailPinAuth;
