
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw, Target } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import TargetSelector from "@/components/TargetSelector";
import CompletionAlert from "@/components/CompletionAlert";
import { getLifetimeCount, getTodayCount, updateMantraCounts } from "@/utils/indexedDBUtils";
import { recordDailyActivity } from "@/utils/activityUtils";

const ManualCounter: React.FC = () => {
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [showCompletionAlert, setShowCompletionAlert] = useState<boolean>(false);
  const [lifetimeCount, setLifetimeCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved counts from IndexedDB on component mount
  useEffect(() => {
    const loadCounts = async () => {
      try {
        setIsLoading(true);
        const lifetime = await getLifetimeCount();
        const today = await getTodayCount();
        
        setLifetimeCount(lifetime);
        setTodayCount(today);
      } catch (error) {
        console.error("Error loading counts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCounts();
  }, []);

  // Add volume button and headphone button support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Volume up/down buttons and media keys
      if (event.code === 'AudioVolumeUp' || 
          event.code === 'AudioVolumeDown' || 
          event.code === 'MediaPlayPause' ||
          event.code === 'MediaNextTrack' ||
          event.code === 'MediaPreviousTrack') {
        event.preventDefault();
        handleIncrement();
      }
    };

    // Listen for hardware button presses
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentCount, targetCount]);

  useEffect(() => {
    // Check if target is reached
    if (targetCount !== null && currentCount >= targetCount && targetCount > 0) {
      handleCompletion();
    }
  }, [currentCount, targetCount]);

  const handleCompletion = () => {
    setShowCompletionAlert(true);
  };

  const handleSelectTarget = (target: number) => {
    setTargetCount(target);
    setCurrentCount(0);
    setShowCompletionAlert(false);
  };

  const triggerVibration = () => {
    // Trigger mobile vibration if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]); // Short-pause-short vibration pattern
    }
  };

  const handleIncrement = async () => {
    const newCount = currentCount + 1;
    setCurrentCount(newCount);
    
    // Trigger vibration
    triggerVibration();
    
    // Update counts in IndexedDB and record daily activity
    try {
      const { lifetimeCount: newLifetime, todayCount: newToday } = await updateMantraCounts(1);
      setLifetimeCount(newLifetime);
      setTodayCount(newToday);
      
      // Record daily activity for the calendar
      await recordDailyActivity(1);
      
      toast.success(`Mantra counted: ${newCount} 🕉️`, {
        duration: 1000,
      });
    } catch (error) {
      console.error("Error updating counts:", error);
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      setCurrentCount(currentCount - 1);
      toast.info("Count decreased", {
        duration: 800,
      });
    }
  };

  const resetCounter = () => {
    setCurrentCount(0);
    setShowCompletionAlert(false);
    toast.info("Counter reset", {
      duration: 800,
    });
  };

  const handleReset = () => {
    resetCounter();
    setTargetCount(null);
  };

  const progressPercentage = targetCount ? (currentCount / targetCount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-12">
        <div className="text-amber-400 text-lg mb-4">Loading your spiritual journey...</div>
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (targetCount === null) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <TargetSelector onSelectTarget={handleSelectTarget} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      <div className="mb-6 text-center w-full">
        <div className="text-amber-400 text-xl lg:text-2xl mb-2">{currentCount} / {targetCount}</div>
        <div className="text-sm text-gray-400">{Math.round(progressPercentage)}% complete</div>
      </div>
      
      <div className="stats w-full flex gap-4 mb-8">
        <div className="stat flex-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xs text-gray-500 dark:text-gray-400">Lifetime</h3>
          <p className="text-lg lg:text-xl font-bold text-amber-600 dark:text-amber-400">{lifetimeCount}</p>
        </div>
        
        <div className="stat flex-1 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg">
          <h3 className="text-xs text-gray-500 dark:text-gray-400">Today</h3>
          <p className="text-lg lg:text-xl font-bold text-amber-600 dark:text-amber-400">{todayCount}</p>
        </div>
      </div>
      
      <div className="counter-display relative mb-10">
        <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
          <div className="text-white text-center">
            <div className="text-4xl lg:text-5xl mb-3">ॐ</div>
            <div className="text-4xl lg:text-5xl font-bold">{currentCount}</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6 mb-8">
        <Button
          onClick={handleDecrement}
          variant="outline"
          size="icon"
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 border-2 border-orange-300 dark:border-orange-600 shadow-lg"
          disabled={currentCount === 0}
        >
          <Minus className="w-6 h-6 lg:w-7 lg:h-7 text-orange-600 dark:text-orange-400" />
        </Button>
        
        <Button
          onClick={handleIncrement}
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-8 h-8 lg:w-10 lg:h-10" />
        </Button>
        
        <Button
          onClick={resetCounter}
          variant="outline"
          size="icon"
          className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 border-2 border-gray-300 dark:border-gray-600 shadow-lg"
        >
          <RotateCcw className="w-6 h-6 lg:w-7 lg:h-7 text-gray-600 dark:text-gray-400" />
        </Button>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg">
          🙏 Tap + button or use volume/headphone buttons
        </p>
        <p className="text-amber-600 dark:text-amber-400 text-sm lg:text-base mt-1">
          + बटन दबाएं या वॉल्यूम/हेडफोन बटन का उपयोग करें
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
          📳 Phone will vibrate on each count
        </p>
      </div>
      
      <Button 
        variant="outline" 
        className="bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-700 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-600 backdrop-blur-sm"
        onClick={handleReset}
      >
        <Target className="w-4 h-4 mr-2" />
        Change Target
      </Button>

      <CompletionAlert 
        isOpen={showCompletionAlert} 
        targetCount={targetCount} 
        onClose={() => setShowCompletionAlert(false)} 
      />
    </div>
  );
};

export default ManualCounter;
