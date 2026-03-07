import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service for encrypting and decrypting PHI (Protected Health Information)
 * fields using AES-256-GCM authenticated encryption with per-record salts.
 *
 * Complies with LGPD Art.46 requirements for technical security measures
 * to protect personal and sensitive health data at rest.
 */
@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly encryptionKey: string;

    constructor(private configService: ConfigService) {
        const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
        if (!encryptionKey) {
            throw new Error('ENCRYPTION_KEY environment variable is required for PHI encryption');
        }
        this.encryptionKey = encryptionKey;
    }

    /**
     * Encrypts a plaintext string using AES-256-GCM with a per-record random salt.
     * Returns a string in the format: salt:iv:authTag:ciphertext (all hex-encoded).
     */
    encrypt(plaintext: string): string {
        const salt = crypto.randomBytes(32);
        const key = crypto.scryptSync(this.encryptionKey, salt, 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    }

    /**
     * Decrypts an AES-256-GCM encrypted string.
     * Expects the format: salt:iv:authTag:ciphertext (all hex-encoded).
     */
    decrypt(encryptedText: string): string {
        const [saltHex, ivHex, authTagHex, ciphertext] = encryptedText.split(':');
        if (!saltHex || !ivHex || !authTagHex || !ciphertext) {
            throw new Error('Invalid encrypted text format');
        }
        const salt = Buffer.from(saltHex, 'hex');
        const key = crypto.scryptSync(this.encryptionKey, salt, 32);
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    /**
     * Checks whether a value appears to be in our encrypted format.
     * Format: 64-hex-salt : 32-hex-iv : 32-hex-authTag : hex-ciphertext
     */
    isEncrypted(value: string): boolean {
        return /^[0-9a-f]{64}:[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+$/.test(value);
    }
}
