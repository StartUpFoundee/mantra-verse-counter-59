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

/**
 * Validate user ID format
 */
export const validateUserID = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  return id.startsWith('EM_') && id.length > 10;
};

/**
 * Generate QR data for sharing ID
 */
export const generateIdQRData = (id: string): string => {
  return `https://mantraverse.app/restore?id=${encodeURIComponent(id)}`;
};

/**
 * Generate data-embedded ID (refresh existing ID with latest data)
 */
export const generateDataEmbeddedID = async (userData: any): Promise<string> => {
  // For email-based system, we keep the same ID format
  // Just return the existing ID since it's based on email+pin hash
  return userData.id || `EM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Regenerate user ID with latest data
 */
export const regenerateUserID = async (): Promise<void> => {
  const userData = getUserData();
  if (!userData) throw new Error('No user data found');
  
  // For email-based system, ID doesn't change
  // This function exists for compatibility but doesn't modify the ID
  const updatedData = { ...userData, lastUpdated: new Date().toISOString() };
  saveUserData(updatedData);
};

/**
 * Import account from ID
 */
export const importAccountFromID = async (id: string): Promise<boolean> => {
  try {
    if (!validateUserID(id)) {
      return false;
    }

    // For now, we'll create a basic user data structure
    // In a real implementation, this would decode embedded data from the ID
    const userData = {
      id: id,
      name: "Imported User",
      email: "imported@example.com",
      createdAt: new Date().toISOString(),
      imported: true
    };

    saveUserData(userData);
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};
