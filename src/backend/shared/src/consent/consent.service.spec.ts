import { Test, TestingModule } from '@nestjs/testing';
import { ConsentService } from './consent.service';
import { PrismaService } from '../database/prisma.service';
import { ConsentType } from './dto/create-consent.dto';
import { ConsentStatus } from './dto/update-consent.dto';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

const mockPrismaService = {
  consentRecord: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

describe('ConsentService', () => {
  let service: ConsentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ConsentService>(ConsentService);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // createConsent
  // ─────────────────────────────────────────────────────────────────────────

  describe('createConsent', () => {
    const userId = 'user-001';
    const dto = {
      consentType: ConsentType.HEALTH_DATA_SHARING,
      purpose: 'Share health data with physician',
      dataCategories: ['health_metrics', 'prescriptions'],
      expiresAt: '2027-01-01T00:00:00.000Z',
    };

    it('creates a consent record with all required fields', async () => {
      const createdRecord = {
        id: 'consent-001',
        userId,
        consentType: dto.consentType,
        purpose: dto.purpose,
        dataCategories: dto.dataCategories,
        expiresAt: new Date(dto.expiresAt),
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        status: ConsentStatus.ACTIVE,
        grantedAt: new Date(),
      };
      mockPrismaService.consentRecord.create.mockResolvedValue(createdRecord);

      const result = await service.createConsent(userId, dto, '127.0.0.1', 'Mozilla/5.0');

      expect(mockPrismaService.consentRecord.create).toHaveBeenCalledWith({
        data: {
          userId,
          consentType: dto.consentType,
          purpose: dto.purpose,
          dataCategories: dto.dataCategories,
          expiresAt: new Date(dto.expiresAt),
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
        },
      });
      expect(result).toEqual(createdRecord);
    });

    it('stores IP address and user agent in the record', async () => {
      const ip = '192.168.1.100';
      const userAgent = 'TestAgent/1.0';
      mockPrismaService.consentRecord.create.mockResolvedValue({ id: 'consent-002' });

      await service.createConsent(userId, dto, ip, userAgent);

      const callArgs = mockPrismaService.consentRecord.create.mock.calls[0][0];
      expect(callArgs.data.ipAddress).toBe(ip);
      expect(callArgs.data.userAgent).toBe(userAgent);
    });

    it('sets ipAddress and userAgent to null when not provided', async () => {
      mockPrismaService.consentRecord.create.mockResolvedValue({ id: 'consent-003' });

      await service.createConsent(userId, dto);

      const callArgs = mockPrismaService.consentRecord.create.mock.calls[0][0];
      expect(callArgs.data.ipAddress).toBeNull();
      expect(callArgs.data.userAgent).toBeNull();
    });

    it('sets expiresAt to null when dto.expiresAt is not provided', async () => {
      const dtoNoExpiry = { ...dto, expiresAt: undefined };
      mockPrismaService.consentRecord.create.mockResolvedValue({ id: 'consent-004' });

      await service.createConsent(userId, dtoNoExpiry);

      const callArgs = mockPrismaService.consentRecord.create.mock.calls[0][0];
      expect(callArgs.data.expiresAt).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getUserConsents
  // ─────────────────────────────────────────────────────────────────────────

  describe('getUserConsents', () => {
    it('returns an array of consent records for the user', async () => {
      const userId = 'user-002';
      const consents = [
        { id: 'c1', userId, consentType: ConsentType.DATA_PROCESSING },
        { id: 'c2', userId, consentType: ConsentType.MARKETING },
      ];
      mockPrismaService.consentRecord.findMany.mockResolvedValue(consents);

      const result = await service.getUserConsents(userId);

      expect(mockPrismaService.consentRecord.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { grantedAt: 'desc' },
      });
      expect(result).toEqual(consents);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when user has no consents', async () => {
      mockPrismaService.consentRecord.findMany.mockResolvedValue([]);

      const result = await service.getUserConsents('user-no-consents');

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // getActiveConsent
  // ─────────────────────────────────────────────────────────────────────────

  describe('getActiveConsent', () => {
    const userId = 'user-003';
    const consentType = ConsentType.TELEMEDICINE;

    it('returns the active consent record when one exists', async () => {
      const activeConsent = {
        id: 'active-consent-001',
        userId,
        consentType,
        status: ConsentStatus.ACTIVE,
      };
      mockPrismaService.consentRecord.findFirst.mockResolvedValue(activeConsent);

      const result = await service.getActiveConsent(userId, consentType);

      expect(mockPrismaService.consentRecord.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          consentType,
          status: ConsentStatus.ACTIVE,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: expect.any(Date) } },
          ],
        },
        orderBy: { grantedAt: 'desc' },
      });
      expect(result).toEqual(activeConsent);
    });

    it('returns null when no active consent exists for the type', async () => {
      mockPrismaService.consentRecord.findFirst.mockResolvedValue(null);

      const result = await service.getActiveConsent(userId, consentType);

      expect(result).toBeNull();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // hasActiveConsent
  // ─────────────────────────────────────────────────────────────────────────

  describe('hasActiveConsent', () => {
    const userId = 'user-004';
    const consentType = ConsentType.RESEARCH;

    it('returns true when the user has an active consent', async () => {
      mockPrismaService.consentRecord.findFirst.mockResolvedValue({ id: 'c1' });

      const result = await service.hasActiveConsent(userId, consentType);

      expect(result).toBe(true);
    });

    it('returns false when the user has no active consent', async () => {
      mockPrismaService.consentRecord.findFirst.mockResolvedValue(null);

      const result = await service.hasActiveConsent(userId, consentType);

      expect(result).toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // revokeConsent
  // ─────────────────────────────────────────────────────────────────────────

  describe('revokeConsent', () => {
    const userId = 'user-005';
    const consentId = 'consent-revoke-001';

    it('revokes the consent record and sets status to REVOKED', async () => {
      const existing = { id: consentId, userId, status: ConsentStatus.ACTIVE };
      const updated = { ...existing, status: ConsentStatus.REVOKED, revokedAt: new Date() };
      mockPrismaService.consentRecord.findUnique.mockResolvedValue(existing);
      mockPrismaService.consentRecord.update.mockResolvedValue(updated);

      const result = await service.revokeConsent(userId, consentId);

      expect(mockPrismaService.consentRecord.findUnique).toHaveBeenCalledWith({
        where: { id: consentId },
      });
      expect(mockPrismaService.consentRecord.update).toHaveBeenCalledWith({
        where: { id: consentId },
        data: {
          status: ConsentStatus.REVOKED,
          revokedAt: expect.any(Date),
        },
      });
      expect(result.status).toBe(ConsentStatus.REVOKED);
    });

    it('throws CONSENT_001 (NOT_FOUND) when the consent record does not exist', async () => {
      mockPrismaService.consentRecord.findUnique.mockResolvedValue(null);

      try {
        await service.revokeConsent(userId, consentId);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('CONSENT_001');
        expect(error.message).toContain('not found');
      }
    });

    it('throws CONSENT_002 (FORBIDDEN) when consent belongs to a different user', async () => {
      const existing = { id: consentId, userId: 'other-user-id', status: ConsentStatus.ACTIVE };
      mockPrismaService.consentRecord.findUnique.mockResolvedValue(existing);

      try {
        await service.revokeConsent(userId, consentId);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.FORBIDDEN);
        expect(error.code).toBe('CONSENT_002');
        expect(error.message).toContain('another user');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // revokeAllConsents
  // ─────────────────────────────────────────────────────────────────────────

  describe('revokeAllConsents', () => {
    const userId = 'user-006';

    it('revokes all active consents for the user and returns count', async () => {
      mockPrismaService.consentRecord.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.revokeAllConsents(userId);

      expect(mockPrismaService.consentRecord.updateMany).toHaveBeenCalledWith({
        where: {
          userId,
          status: ConsentStatus.ACTIVE,
        },
        data: {
          status: ConsentStatus.REVOKED,
          revokedAt: expect.any(Date),
        },
      });
      expect(result).toBe(3);
    });

    it('returns 0 when user has no active consents', async () => {
      mockPrismaService.consentRecord.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.revokeAllConsents(userId);

      expect(result).toBe(0);
    });
  });
});
