
/**
 * Spiritual ID utilities for user identity management
 * Now focused on email-based authentication only
 */

export interface SpiritualIcon {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
}

export const spiritualIcons: SpiritualIcon[] = [
  { id: "om", symbol: "🕉️", name: "Om", meaning: "Universal sound" },
  { id: "lotus", symbol: "🪷", name: "Lotus", meaning: "Purity and enlightenment" },
  { id: "peace", symbol: "☮️", name: "Peace", meaning: "Inner harmony" },
  { id: "dharma", symbol: "☸️", name: "Dharma Wheel", meaning: "Path of righteousness" },
  { id: "namaste", symbol: "🙏", name: "Namaste", meaning: "Divine greeting" },
  { id: "meditation", symbol: "🧘", name: "Meditation", meaning: "Inner reflection" }
];

/**
 * Get user data from localStorage
 */
export const getUserData = (): any => {
  const userData = localStorage.getItem('chantTrackerUserData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (userData: any): void => {
  localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
};

/**
 * Check if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  return localStorage.getItem('chantTrackerUserData') !== null;
};

/**
 * Logout user by removing data from localStorage
 */
export const logoutUser = (): void => {
  localStorage.removeItem('chantTrackerUserData');
};

/**
 * Check if an ID is email-based
 */
export const isEmailBasedID = (id: string): boolean => {
  return id.startsWith('EM_');
};
