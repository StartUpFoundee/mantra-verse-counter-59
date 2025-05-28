
/**
 * Email-based identity utilities for secure frontend authentication
 */

/**
 * Generate a secure SHA256-based identity from email and PIN
 */
export const generateEmailBasedID = async (email: string, pin: string): Promise<string> => {
  const normalizedEmail = email.toLowerCase().trim();
  const combinedString = `${normalizedEmail}:${pin}`;
  
  // Use Web Crypto API for SHA256 hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(combinedString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return with prefix for identification
  return `EM_${hashHex}`;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate PIN format (4 digits)
 */
export const validatePin = (pin: string): boolean => {
  const pinRegex = /^\d{4}$/;
  return pinRegex.test(pin);
};

/**
 * Extract email from email-based ID (for display purposes)
 * Note: This is not possible with hashed IDs, so we'll store email separately
 */
export const isEmailBasedID = (id: string): boolean => {
  return id.startsWith('EM_');
};

/**
 * Verify if provided email and PIN match the stored identity
 */
export const verifyEmailPinIdentity = async (
  email: string, 
  pin: string, 
  storedId: string
): Promise<boolean> => {
  const generatedId = await generateEmailBasedID(email, pin);
  return generatedId === storedId;
};
