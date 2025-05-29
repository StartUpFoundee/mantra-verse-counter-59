
/**
 * Google OAuth authentication utilities
 */

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // User will need to set this

let isGapiLoaded = false;
let isGisLoaded = false;

/**
 * Load Google APIs
 */
export const loadGoogleAPIs = (): Promise<void> => {
  return new Promise((resolve) => {
    // Load GAPI
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      window.gapi.load('auth2', () => {
        isGapiLoaded = true;
        checkAndResolve();
      });
    };
    document.head.appendChild(gapiScript);

    // Load Google Identity Services
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      isGisLoaded = true;
      checkAndResolve();
    };
    document.head.appendChild(gisScript);

    function checkAndResolve() {
      if (isGapiLoaded && isGisLoaded) {
        resolve();
      }
    }
  });
};

/**
 * Initialize Google Auth
 */
export const initializeGoogleAuth = async (): Promise<void> => {
  if (!window.gapi || !window.google) {
    await loadGoogleAPIs();
  }

  await window.gapi.auth2.init({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive.file'
  });
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<GoogleUser> => {
  try {
    await initializeGoogleAuth();
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    const googleUser = await authInstance.signIn();
    
    const profile = googleUser.getBasicProfile();
    const user: GoogleUser = {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl()
    };

    console.log('Google sign-in successful:', user);
    return user;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw new Error('Failed to sign in with Google');
  }
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = async (): Promise<void> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    console.log('Google sign-out successful');
  } catch (error) {
    console.error('Google sign-out failed:', error);
    throw new Error('Failed to sign out from Google');
  }
};

/**
 * Check if user is signed in
 */
export const isGoogleSignedIn = (): boolean => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  } catch (error) {
    return false;
  }
};

/**
 * Get current Google user
 */
export const getCurrentGoogleUser = (): GoogleUser | null => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) return null;

    const googleUser = authInstance.currentUser.get();
    const profile = googleUser.getBasicProfile();
    
    return {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl()
    };
  } catch (error) {
    console.error('Failed to get current Google user:', error);
    return null;
  }
};

/**
 * Get access token for API calls
 */
export const getGoogleAccessToken = (): string | null => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) return null;

    const googleUser = authInstance.currentUser.get();
    return googleUser.getAuthResponse().access_token;
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};
