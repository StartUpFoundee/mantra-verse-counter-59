
export interface MantraCategory {
  id: string;
  name: string;
  range: { min: number; max: number };
  color: string;
  bgColor: string;
  description: string;
}

export const mantraCategories: MantraCategory[] = [
  {
    id: "beginner",
    name: "Beginner",
    range: { min: 1, max: 10 },
    color: "text-blue-600",
    bgColor: "bg-blue-200/70 dark:bg-blue-800/50",
    description: "1-10 mantras"
  },
  {
    id: "seeker",
    name: "Seeker",
    range: { min: 11, max: 27 },
    color: "text-green-600",
    bgColor: "bg-green-200/70 dark:bg-green-800/50",
    description: "11-27 mantras"
  },
  {
    id: "devoted",
    name: "Devoted",
    range: { min: 28, max: 54 },
    color: "text-yellow-600",
    bgColor: "bg-yellow-200/70 dark:bg-yellow-800/50",
    description: "28-54 mantras"
  },
  {
    id: "dedicated",
    name: "Dedicated",
    range: { min: 55, max: 107 },
    color: "text-orange-600",
    bgColor: "bg-orange-200/70 dark:bg-orange-800/50",
    description: "55-107 mantras"
  },
  {
    id: "enlightened",
    name: "Enlightened",
    range: { min: 108, max: 216 },
    color: "text-purple-600",
    bgColor: "bg-purple-200/70 dark:bg-purple-800/50",
    description: "108-216 mantras"
  },
  {
    id: "master",
    name: "Master",
    range: { min: 217, max: Infinity },
    color: "text-pink-600",
    bgColor: "bg-pink-200/70 dark:bg-pink-800/50",
    description: "217+ mantras"
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
