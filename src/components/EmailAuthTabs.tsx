
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EmailPinAuth from "./EmailPinAuth";

interface EmailAuthTabsProps {
  onAuthSuccess: () => void;
  onContinueAsGuest: () => void;
}

const EmailAuthTabs: React.FC<EmailAuthTabsProps> = ({ onAuthSuccess, onContinueAsGuest }) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");

  return (
    <div className="w-full max-w-lg mx-auto">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "login" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-zinc-700/50">
          <TabsTrigger 
            value="signup" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Create Account
          </TabsTrigger>
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Sign In
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signup" className="mt-6">
          <EmailPinAuth onAuthSuccess={onAuthSuccess} isLogin={false} />
        </TabsContent>
        
        <TabsContent value="login" className="mt-6">
          <EmailPinAuth onAuthSuccess={onAuthSuccess} isLogin={true} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          onClick={onContinueAsGuest}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};

export default EmailAuthTabs;
