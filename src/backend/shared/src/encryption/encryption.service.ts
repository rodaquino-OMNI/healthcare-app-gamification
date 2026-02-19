import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * Service for encrypting and decrypting PHI (Protected Health Information)
 * fields using AES-256-GCM authenticated encryption.
 *
 * Complies with LGPD Art.46 requirements for technical security measures
 * to protect personal and sensitive health data at rest.
 */
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY environment variable is required for PHI encryption');
    }
    // Derive a 32-byte key from the provided secret using scrypt
    this.key = crypto.scryptSync(encryptionKey, 'austa-phi-salt', 32);
  }

  /**
   * Encrypts a plaintext string using AES-256-GCM.
   * Returns a string in the format: iv:authTag:ciphertext (all hex-encoded).
   */
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypts an AES-256-GCM encrypted string.
   * Expects the format: iv:authTag:ciphertext (all hex-encoded).
   */
  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, ciphertext] = encryptedText.split(':');
    if (!ivHex || !authTagHex || !ciphertext) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Checks whether a value appears to be in our encrypted format.
   * Used to handle legacy unencrypted data gracefully during migration.
   */
  isEncrypted(value: string): boolean {
    return /^[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+$/.test(value);
  }
}
