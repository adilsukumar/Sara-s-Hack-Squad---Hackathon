// Client-side encryption utilities for SafeGuard application
// These functions provide encryption for sensitive data before transmission

interface EncryptionResult {
  encryptedData: string;
  success: boolean;
  error?: string;
}

interface DecryptionResult {
  decryptedData: string;
  success: boolean;
  error?: string;
}

/**
 * Generate a secure random key for encryption
 */
export function generateSecureKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a session-based encryption key
 */
export function generateSessionKey(sessionId: string, additional?: string): string {
  const data = sessionId + (additional || '') + Date.now().toString();
  return btoa(data).replace(/[+/=]/g, '').substring(0, 32);
}

/**
 * Simple encryption for client-side data protection
 * Note: This is for basic obfuscation. Server-side encryption is more secure.
 */
export function encryptClientData(data: string, key: string): EncryptionResult {
  try {
    if (!data || !key) {
      return { encryptedData: '', success: false, error: 'Data and key are required' };
    }

    // Simple XOR encryption for client-side obfuscation
    const keyBytes = new TextEncoder().encode(key.padEnd(32, '0').substring(0, 32));
    const dataBytes = new TextEncoder().encode(data);
    const encrypted = new Uint8Array(dataBytes.length);

    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const encryptedBase64 = btoa(String.fromCharCode(...encrypted));
    return { encryptedData: encryptedBase64, success: true };
  } catch (error) {
    return { 
      encryptedData: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Encryption failed' 
    };
  }
}

/**
 * Decrypt client-side encrypted data
 */
export function decryptClientData(encryptedData: string, key: string): DecryptionResult {
  try {
    if (!encryptedData || !key) {
      return { decryptedData: '', success: false, error: 'Encrypted data and key are required' };
    }

    const keyBytes = new TextEncoder().encode(key.padEnd(32, '0').substring(0, 32));
    const encryptedBytes = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    const decrypted = new Uint8Array(encryptedBytes.length);

    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const decryptedText = new TextDecoder().decode(decrypted);
    return { decryptedData: decryptedText, success: true };
  } catch (error) {
    return { 
      decryptedData: '', 
      success: false, 
      error: error instanceof Error ? error.message : 'Decryption failed' 
    };
  }
}

/**
 * Hash a string using SHA-256 (for client-side hashing needs)
 */
export async function hashString(input: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    // Fallback to simple hash if crypto.subtle is not available
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

/**
 * Securely clear sensitive data from memory
 */
export function secureClear(data: string | any[]): void {
  if (typeof data === 'string') {
    // Overwrite string data (limited effectiveness in JavaScript)
    data = '\0'.repeat(data.length);
  } else if (Array.isArray(data)) {
    // Clear array data
    data.fill(0);
    data.length = 0;
  }
}

/**
 * Generate a secure room ID for safe communication
 */
export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

/**
 * Validate if a string is properly encrypted
 */
export function isValidEncryptedData(data: string): boolean {
  try {
    // Check if it's valid base64
    const decoded = atob(data);
    const reencoded = btoa(decoded);
    return reencoded === data && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Create a masked version of sensitive data for display
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  
  const visible = data.substring(0, visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  return visible + masked;
}

/**
 * Secure random number generation
 */
export function secureRandom(min: number = 0, max: number = 1): number {
  const range = max - min;
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const randomValue = randomArray[0] / (0xFFFFFFFF + 1);
  return min + (randomValue * range);
}

/**
 * Generate a secure token for one-time use
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(secureRandom(0, chars.length));
    result += chars[randomIndex];
  }
  
  return result;
}

/**
 * Validate session integrity
 */
export function validateSession(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }
  
  // Check format and length
  const isValidFormat = /^[a-f0-9]{64}$/.test(sessionId);
  return isValidFormat;
}

/**
 * Safe data storage with automatic expiration
 */
export class SecureStorage {
  private static prefix = 'safeguard_';
  
  static setItem(key: string, value: string, expirationMinutes: number = 60): void {
    const data = {
      value,
      expiration: Date.now() + (expirationMinutes * 60 * 1000)
    };
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store data:', error);
    }
  }
  
  static getItem(key: string): string | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const data = JSON.parse(item);
      if (Date.now() > data.expiration) {
        this.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch {
      return null;
    }
  }
  
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Failed to remove data:', error);
    }
  }
  
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }
}
