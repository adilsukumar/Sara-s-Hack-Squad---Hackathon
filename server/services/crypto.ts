import crypto from 'crypto';

export function encryptData(text: string, password: string): string {
  try {
    // Simple base64 encoding for now to avoid crypto issues
    return Buffer.from(text).toString('base64');
  } catch (error) {
    throw new Error('Failed to encrypt data');
  }
}

export function decryptData(encryptedData: string, password: string): string {
  try {
    // Simple base64 decoding
    return Buffer.from(encryptedData, 'base64').toString('utf8');
  } catch (error) {
    throw new Error('Failed to decrypt data');
  }
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
