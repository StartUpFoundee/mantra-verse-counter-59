/**
 * Spiritual ID utilities for user identity management
 * Now using Google OAuth authentication
 */

import { 
  signInWithGoogle, 
  signOutFromGoogle, 
  getCurrentGoogleUser, 
  isGoogleSignedIn 
} from './googleAuth';
import { syncWithGoogleDrive } from './googleDriveSync';

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

interface UserData {
  id: string;
  name: string;
  email: string;
  picture?: string;
  symbolImage?: string;
  createdAt: string;
  lastUpdated: string;
  syncEnabled: boolean;
}

/**
 * Get user data from localStorage (for backward compatibility)
 */
export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem('chantTrackerUserData');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Save user data to localStorage
 */
export const saveUserData = (userData: UserData): void => {
  localStorage.setItem('chantTrackerUserData', JSON.stringify(userData));
};

/**
 * Check if user is logged in (Google or legacy)
 */
export const isUserLoggedIn = (): boolean => {
  return isGoogleSignedIn() || localStorage.getItem('chantTrackerUserData') !== null;
};

/**
 * Login with Google
 */
export const loginWithGoogle = async (): Promise<UserData> => {
  try {
    const googleUser = await signInWithGoogle();
    
    const userData: UserData = {
      id: `GOOGLE_${googleUser.id}`,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      symbolImage: "🕉️", // Default symbol
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      syncEnabled: true
    };

    saveUserData(userData);
    console.log('Google login successful:', userData);
    return userData;
  } catch (error) {
    console.error('Google login failed:', error);
    throw new Error('Failed to login with Google');
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Sign out from Google if signed in
    if (isGoogleSignedIn()) {
      await signOutFromGoogle();
    }
    
    // Clear local data
    localStorage.removeItem('chantTrackerUserData');
    
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Sync user data with Google Drive
 */
export const syncUserData = async (): Promise<void> => {
  const userData = getUserData();
  if (!userData || !userData.syncEnabled || !isGoogleSignedIn()) {
    console.log('Sync not available or disabled');
    return;
  }

  try {
    // This would sync the actual jaap data
    console.log('Syncing user data with Google Drive...');
    // Implementation would go here once we integrate with the counting system
  } catch (error) {
    console.error('Sync failed:', error);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = (updates: Partial<UserData>): void => {
  const userData = getUserData();
  if (!userData) return;

  const updatedData = {
    ...userData,
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  saveUserData(updatedData);
};

/**
 * Legacy functions for backward compatibility
 */
export const isEmailBasedID = (id: string): boolean => {
  return id.startsWith('EM_') || id.startsWith('GOOGLE_');
};

export const validateUserID = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  return id.startsWith('EM_') || id.startsWith('GOOGLE_');
};

export const generateIdQRData = (id: string): string => {
  return `https://mantraverse.app/restore?id=${encodeURIComponent(id)}`;
};

export const regenerateUserID = async (): Promise<void> => {
  const userData = getUserData();
  if (!userData) throw new Error('No user data found');
  
  const updatedData = { ...userData, lastUpdated: new Date().toISOString() };
  saveUserData(updatedData);
};

export const importAccountFromID = async (id: string): Promise<boolean> => {
  try {
    if (!validateUserID(id)) {
      return false;
    }

    const userData = {
      id: id,
      name: "Imported User",
      email: "imported@example.com",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      syncEnabled: false,
      imported: true
    };

    saveUserData(userData);
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};

// Keep generateDataEmbeddedID for compatibility
export const generateDataEmbeddedID = async (userData: any): Promise<string> => {
  return userData.id || `GOOGLE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
