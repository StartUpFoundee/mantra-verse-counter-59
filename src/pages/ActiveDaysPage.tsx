
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Flame, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivityData, getStreakData } from "@/utils/activityUtils";
import { mantraCategories, getCategoryColor, getCategorySymbol } from "@/utils/categoryUtils";
import ModernCard from "@/components/ModernCard";

interface ActivityData {
  [date: string]: number;
}

interface StreakData {
  currentStreak: number;
  maxStreak: number;
  totalActiveDays: number;
}

const ActiveDaysPage: React.FC = () => {
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    maxStreak: 0,
    totalActiveDays: 0
  });
  const [hoveredDay, setHoveredDay] = useState<{date: string, count: number} | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading activity data...");
      const activity = await getActivityData();
      const streaks = await getStreakData();
      setActivityData(activity);
      setStreakData(streaks);
      console.log("Loaded activity data:", activity);
      console.log("Loaded streak data:", streaks);
    };
    loadData();
  }, []);

  const generateCalendarData = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= today) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const count = activityData[dateStr] || 0;
      const isToday = dateStr === today.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        count,
        isToday,
        dayOfWeek: currentDay.getDay(),
        month: currentDay.getMonth(),
        dayOfMonth: currentDay.getDate(),
        displayDate: new Date(currentDay)
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarData();

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-zinc-900 dark:via-black dark:to-zinc-800 p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-center">
          Active Days
        </h1>
        <div className="w-28"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12 max-w-6xl mx-auto">
        <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-orange-400/20 to-red-500/20 border-orange-300/30 dark:border-orange-600/30" gradient>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-orange-600 dark:text-orange-400 mb-1">Current Streak</h3>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{streakData.currentStreak}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">days in a row</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-emerald-400/20 to-green-500/20 border-emerald-300/30 dark:border-emerald-600/30" gradient>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Max Streak</h3>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{streakData.maxStreak}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">personal best</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard className="p-6 lg:p-8 bg-gradient-to-br from-purple-400/20 to-indigo-500/20 border-purple-300/30 dark:border-purple-600/30" gradient>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-purple-600 dark:text-purple-400 mb-1">Total Active Days</h3>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{streakData.totalActiveDays}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">lifetime practice</p>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Achievement Categories Legend */}
      <div className="max-w-6xl mx-auto mb-6">
        <ModernCard className="p-4 lg:p-6 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mantraCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-zinc-700/50 dark:to-zinc-600/50">
                <div className="text-2xl">{category.symbol}</div>
                <div>
                  <div className={`text-sm font-bold ${category.color} dark:text-white`}>{category.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{category.description}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{category.achievement}</div>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>

      {/* Calendar Grid */}
      <div className="max-w-6xl mx-auto">
        <ModernCard className="p-6 lg:p-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl border-amber-200/50 dark:border-amber-700/50" gradient>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 lg:w-7 lg:h-7 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Activity Calendar</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Your spiritual practice journey over the past year</p>
          </div>

          <div className="space-y-4">
            {/* Weekday Labels */}
            <div className="flex gap-1 lg:gap-2 ml-12 lg:ml-16">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="w-6 h-6 lg:w-8 lg:h-8 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex gap-1 lg:gap-2 overflow-x-auto pb-4">
              {Array.from({ length: 53 }, (_, weekIndex) => {
                return (
                  <div key={weekIndex} className="flex flex-col gap-1 lg:gap-2">
                    {/* Month label */}
                    {weekIndex === 0 || (calendarDays[weekIndex * 7] && calendarDays[weekIndex * 7].displayDate.getDate() <= 7) ? (
                      <div className="h-4 lg:h-6 text-xs text-gray-500 dark:text-gray-400 mb-1 lg:mb-2 min-w-[48px] lg:min-w-[64px]">
                        {calendarDays[weekIndex * 7] && ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][calendarDays[weekIndex * 7].month]}
                      </div>
                    ) : (
                      <div className="h-4 lg:h-6 mb-1 lg:mb-2"></div>
                    )}
                    
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const dayData = calendarDays[weekIndex * 7 + dayIndex];
                      if (!dayData) return <div key={dayIndex} className="w-6 h-6 lg:w-8 lg:h-8"></div>;
                      
                      const symbol = getCategorySymbol(dayData.count);
                      const bgColor = dayData.count > 0 ? getCategoryColor(dayData.count) : "bg-gray-100 dark:bg-gray-700";
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-amber-400 relative flex items-center justify-center text-xs lg:text-sm border border-gray-200 dark:border-gray-600 ${bgColor} ${dayData.isToday ? 'ring-2 ring-amber-500' : ''}`}
                          onMouseEnter={(e) => {
                            setHoveredDay({ date: dayData.date, count: dayData.count });
                            handleMouseMove(e);
                          }}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setHoveredDay(null)}
                        >
                          {symbol && <span className="opacity-90 text-lg">{symbol}</span>}
                          {!symbol && dayData.count > 0 && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/50 rounded-xl px-4 py-3 text-sm pointer-events-none shadow-xl"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 50,
          }}
        >
          <div className="text-gray-900 dark:text-white font-medium mb-1">
            {new Date(hoveredDay.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="text-amber-600 dark:text-amber-400">
            {hoveredDay.count} mantras completed
          </div>
          {getCategorySymbol(hoveredDay.count) && (
            <div className="text-gray-700 dark:text-gray-300 text-xs mt-1">
              Achievement: {getCategorySymbol(hoveredDay.count)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveDaysPage;
