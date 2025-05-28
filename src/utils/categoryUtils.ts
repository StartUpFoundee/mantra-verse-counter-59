
export interface MantraCategory {
  id: string;
  name: string;
  range: { min: number; max: number };
  color: string;
  bgColor: string;
  description: string;
  symbol: string;
  achievement: string;
}

export const mantraCategories: MantraCategory[] = [
  {
    id: "starter",
    name: "Starter",
    range: { min: 1, max: 108 },
    color: "text-bronze-600",
    bgColor: "bg-orange-200/70 dark:bg-orange-800/50",
    description: "1-108 mantras",
    symbol: "🌱",
    achievement: "First Steps"
  },
  {
    id: "devotee",
    name: "Devotee", 
    range: { min: 109, max: 500 },
    color: "text-silver-600",
    bgColor: "bg-gray-300/70 dark:bg-gray-600/50",
    description: "109-500 mantras",
    symbol: "🕉️",
    achievement: "Devoted Practice"
  },
  {
    id: "seeker",
    name: "Seeker",
    range: { min: 501, max: 1000 },
    color: "text-amber-600",
    bgColor: "bg-amber-200/70 dark:bg-amber-800/50", 
    description: "501-1000 mantras",
    symbol: "🏆",
    achievement: "Golden Path"
  },
  {
    id: "master",
    name: "Master",
    range: { min: 1001, max: 1500 },
    color: "text-blue-600",
    bgColor: "bg-blue-200/70 dark:bg-blue-800/50",
    description: "1001-1500 mantras", 
    symbol: "💎",
    achievement: "Diamond Mind"
  },
  {
    id: "enlightened",
    name: "Enlightened",
    range: { min: 1501, max: 2100 },
    color: "text-purple-600",
    bgColor: "bg-purple-200/70 dark:bg-purple-800/50",
    description: "1501-2100 mantras",
    symbol: "👑",
    achievement: "Enlightened Soul"
  }
];

export const getCategoryForCount = (count: number): MantraCategory | null => {
  if (count === 0) return null;
  
  return mantraCategories.find(category => 
    count >= category.range.min && count <= category.range.max
  ) || null;
};

export const getCategoryColor = (count: number): string => {
  if (count === 0) return "bg-gray-200/50 dark:bg-gray-700/50";
  
  const category = getCategoryForCount(count);
  return category ? category.bgColor : "bg-gray-200/50 dark:bg-gray-700/50";
};

export const getCategorySymbol = (count: number): string => {
  if (count === 0) return "";
  
  const category = getCategoryForCount(count);
  return category ? category.symbol : "";
};
