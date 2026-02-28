import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const mockConfigService = { get: jest.fn().mockReturnValue('test-encryption-key-32chars') };

  beforeEach(async () => {
    mockConfigService.get.mockReturnValue('test-encryption-key-32chars');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get(EncryptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('throws an error when ENCRYPTION_KEY is missing', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(
        Test.createTestingModule({
          providers: [
            EncryptionService,
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile(),
      ).rejects.toThrow(Error);
    });

    it('throws an error when ENCRYPTION_KEY is an empty string', async () => {
      mockConfigService.get.mockReturnValue('');

      await expect(
        Test.createTestingModule({
          providers: [
            EncryptionService,
            { provide: ConfigService, useValue: mockConfigService },
          ],
        }).compile(),
      ).rejects.toThrow(Error);
    });

    it('initializes successfully when ENCRYPTION_KEY is provided', () => {
      expect(service).toBeInstanceOf(EncryptionService);
    });
  });

  describe('encrypt', () => {
    it('returns a string in salt:iv:authTag:ciphertext hex format', () => {
      const plaintext = 'hello world';
      const result = service.encrypt(plaintext);

      expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/);

      const parts = result.split(':');
      expect(parts).toHaveLength(4);
      expect(parts[0]).toHaveLength(64); // 32-byte salt = 64 hex chars
      expect(parts[1]).toHaveLength(32); // 16-byte IV = 32 hex chars
      expect(parts[2]).toHaveLength(32); // 16-byte authTag = 32 hex chars
      expect(parts[3].length).toBeGreaterThan(0);
    });

    it('produces different ciphertexts for the same input due to random IV', () => {
      const plaintext = 'same plaintext';
      const encrypted1 = service.encrypt(plaintext);
      const encrypted2 = service.encrypt(plaintext);

      expect(encrypted1).not.toEqual(encrypted2);
    });

    it('encrypts various plaintext values without throwing', () => {
      const values = ['some data', '', '{"key":"value"}', 'special !@#$%'];
      values.forEach((value) => {
        expect(() => service.encrypt(value)).not.toThrow();
      });
    });
  });

  describe('decrypt', () => {
    it('decrypts an encrypted value back to the original plaintext', () => {
      const plaintext = 'sensitive patient data';
      const encrypted = service.encrypt(plaintext);
      const decrypted = service.decrypt(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    it('round-trips various plaintext values correctly', () => {
      const testValues = [
        'simple string',
        '{"field":"value","number":42}',
        'special chars: !@#$%^&*()',
        '1234567890',
        'a',
      ];

      testValues.forEach((value) => {
        const encrypted = service.encrypt(value);
        const decrypted = service.decrypt(encrypted);
        expect(decrypted).toBe(value);
      });
    });

    it('throws on invalid format with missing parts (no colons)', () => {
      expect(() => service.decrypt('onlyonepart')).toThrow();
    });

    it('throws on invalid format with only two colon-separated parts', () => {
      expect(() => service.decrypt('aaaa:bbbb')).toThrow();
    });

    it('throws on invalid format with three colon-separated parts (old format)', () => {
      expect(() => service.decrypt('aaaa:bbbb:cccc')).toThrow();
    });

    it('throws when the auth tag has been tampered with', () => {
      const encrypted = service.encrypt('original value');
      const parts = encrypted.split(':');
      parts[2] = 'deadbeefdeadbeefdeadbeefdeadbeef';
      const tampered = parts.join(':');

      expect(() => service.decrypt(tampered)).toThrow();
    });

    it('throws when the ciphertext has been tampered with', () => {
      const encrypted = service.encrypt('original value');
      const parts = encrypted.split(':');
      const firstByte = parseInt(parts[3].slice(0, 2), 16);
      const flipped = (firstByte ^ 0xff).toString(16).padStart(2, '0');
      parts[3] = flipped + parts[3].slice(2);
      const tampered = parts.join(':');

      expect(() => service.decrypt(tampered)).toThrow();
    });

    it('throws when the IV has been replaced', () => {
      const encrypted = service.encrypt('original value');
      const parts = encrypted.split(':');
      parts[1] = '00000000000000000000000000000000';
      const tampered = parts.join(':');

      expect(() => service.decrypt(tampered)).toThrow();
    });
  });

  describe('isEncrypted', () => {
    it('returns true for a value produced by encrypt()', () => {
      const encrypted = service.encrypt('test value');
      expect(service.isEncrypted(encrypted)).toBe(true);
    });

    it('returns true for multiple encrypted values produced by the service', () => {
      const values = ['hello', 'world', '12345', 'test data'];
      values.forEach((value) => {
        const encrypted = service.encrypt(value);
        expect(service.isEncrypted(encrypted)).toBe(true);
      });
    });

    it('returns false for a plain text string', () => {
      expect(service.isEncrypted('plain text')).toBe(false);
    });

    it('returns false for an empty string', () => {
      expect(service.isEncrypted('')).toBe(false);
    });

    it('returns false for a string with only one colon-separated part', () => {
      expect(service.isEncrypted('aabbccdd')).toBe(false);
    });

    it('returns false for a string with two colon-separated parts', () => {
      expect(service.isEncrypted('aabbcc:ddeeff')).toBe(false);
    });

    it('returns false for old three-part format', () => {
      expect(service.isEncrypted('a'.repeat(32) + ':' + 'b'.repeat(32) + ':' + 'c'.repeat(10))).toBe(false);
    });

    it('returns false for a string containing non-hex characters', () => {
      expect(service.isEncrypted('zzzzzz:aabbcc:ddeeff')).toBe(false);
    });

    it('returns false for a JSON object string', () => {
      expect(service.isEncrypted('{"key":"value"}')).toBe(false);
    });
  });
});
