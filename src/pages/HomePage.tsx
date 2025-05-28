
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Hand, Infinity, Clock, Sparkles, Calendar, Om } from "lucide-react";
import { isUserLoggedIn, getUserData } from "@/utils/spiritualIdUtils";
import ThemeToggle from "@/components/ThemeToggle";
import WelcomeScreen from "@/components/WelcomeScreen";
import ProfileHeader from "@/components/ProfileHeader";
import WelcomePopup from "@/components/WelcomePopup";
import ActiveDaysButton from "@/components/ActiveDaysButton";
import { getLifetimeCount, getTodayCount } from "@/utils/indexedDBUtils";
import { toast } from "@/components/ui/sonner";
import ModernCard from "@/components/ModernCard";
import StatsCard from "@/components/StatsCard";
import ActionCard from "@/components/ActionCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [lifetimeCount, setLifetimeCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          const lifetime = await getLifetimeCount();
          const today = await getTodayCount();
          
          setLifetimeCount(lifetime);
          setTodayCount(today);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("There was an error loading your data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (!isLoggedIn) {
    if (isLoading || isMigrating) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
          <div className="mb-6 text-orange-600 dark:text-orange-400 text-xl font-medium">
            {isMigrating ? "Setting up your spiritual journey..." : "Loading..."}
          </div>
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 dark:border-orange-800 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
        <header className="py-6 lg:py-8 text-center relative">
          <div className="absolute right-4 lg:right-8 top-4 lg:top-6">
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl lg:text-3xl">🕉️</span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Naam Jaapa Counter
              </h1>
              <p className="text-sm lg:text-base text-orange-700 dark:text-orange-300 font-medium">
                नाम जप काउंटर
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-base lg:text-lg">Track your sacred mantra repetitions</p>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 pb-12">
          <WelcomeScreen />
        </main>
        
        <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm lg:text-base">
          <p>Created with 🧡 for spiritual practice | ॐ</p>
        </footer>
      </div>
    );
  }

  const userData = getUserData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
        <div className="mb-6 text-orange-600 dark:text-orange-400 text-xl font-medium">
          Loading your spiritual journey...
        </div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 dark:border-orange-800 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800">
      <WelcomePopup />
      
      {/* Header */}
      <header className="relative px-4 lg:px-8 pt-6 lg:pt-8 pb-4 lg:pb-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl lg:text-3xl">🕉️</span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Naam Jaapa Counter
              </h1>
              <p className="text-xs lg:text-sm text-orange-700 dark:text-orange-300">
                {userData ? `Namaste, ${userData.name} Ji` : 'नाम जप काउंटर'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <ThemeToggle />
            <ProfileHeader />
          </div>
        </div>
      </header>
      
      <main className="px-4 lg:px-8 pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Spiritual Quote Section */}
          <div className="mb-6 lg:mb-8">
            <ModernCard className="p-4 lg:p-6 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50">
              <div className="text-center">
                <p className="text-orange-800 dark:text-orange-200 text-sm lg:text-base italic mb-2">
                  "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे, हरे राम हरे राम राम राम हरे हरे"
                </p>
                <p className="text-orange-600 dark:text-orange-400 text-xs lg:text-sm">
                  Chant the holy names and be liberated
                </p>
              </div>
            </ModernCard>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <StatsCard
              title="Lifetime Jaap"
              value={lifetimeCount}
              subtitle="Total Count"
              icon={Infinity}
              gradient="bg-gradient-to-br from-orange-400 to-red-500"
            />
            
            <StatsCard
              title="Today's Jaap"
              value={todayCount}
              subtitle="Daily Count"
              icon={Clock}
              gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
            />
            
            {/* Desktop only - additional stats cards */}
            <div className="hidden lg:block">
              <StatsCard
                title="This Week"
                value={Math.floor(lifetimeCount * 0.1)}
                subtitle="Weekly Progress"
                icon={Calendar}
                gradient="bg-gradient-to-br from-blue-400 to-blue-600"
              />
            </div>
            
            <div className="hidden lg:block">
              <StatsCard
                title="Daily Average"
                value={Math.floor(lifetimeCount / 30)}
                subtitle="Per Day"
                icon={Sparkles}
                gradient="bg-gradient-to-br from-purple-400 to-purple-600"
              />
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 dark:text-white px-1">Choose Your Practice Method</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Manual Counter Card */}
              <ActionCard
                title="Manual Jaap Counter"
                description="Tap screen, earphone or volume buttons to count"
                hindiDescription="स्क्रीन, ईयरफोन या वॉल्यूम बटन दबाकर गिनती करें"
                icon={Hand}
                gradient="bg-gradient-to-br from-orange-400 to-red-500"
                onClick={() => navigate('/manual')}
              />
              
              {/* Audio Counter Card */}
              <ActionCard
                title="Voice Jaap Counter"
                description="Chant mantras with pauses for automatic counting"
                hindiDescription="मंत्र जाप करें, रुकें, स्वचालित गिनती होगी"
                icon={Mic}
                gradient="bg-gradient-to-br from-blue-400 to-purple-500"
                onClick={() => navigate('/audio')}
              />
            </div>
          </div>

          {/* Spiritual Practice Tracking */}
          <div className="mt-6 lg:mt-8">
            <ModernCard 
              onClick={() => navigate('/active-days')}
              className="p-6 lg:p-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer hover:scale-[1.02] transition-all duration-300"
              glowEffect
            >
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-1 lg:mb-2">Track Your Spiritual Journey</h3>
                  <p className="text-sm lg:text-base text-emerald-100">View your practice streaks and active days | अपनी साधना देखें</p>
                </div>
                <div className="text-2xl lg:text-3xl">🕉️</div>
              </div>
            </ModernCard>
          </div>

          {/* Popular Mantras Guide */}
          <div className="mt-6 lg:mt-8">
            <ModernCard className="p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4">Popular Mantras for Jaap</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="font-medium text-orange-800 dark:text-orange-200">Hare Krishna Maha Mantra</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="font-medium text-orange-800 dark:text-orange-200">Om Namah Shivaya</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">ॐ नमः शिवाय</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="font-medium text-orange-800 dark:text-orange-200">Gayatri Mantra</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">ॐ भूर्भुवः स्वः</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="font-medium text-orange-800 dark:text-orange-200">Om Gam Ganapataye</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">ॐ गं गणपतये नमः</p>
                  </div>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-orange-200/50 dark:border-zinc-700/50 py-4 lg:py-6">
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm lg:text-base">
          Created with 🧡 for spiritual practice | ॐ नमो भगवते वासुदेवाय
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
