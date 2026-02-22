import { Test, TestingModule } from '@nestjs/testing';
import { PrivacyService } from './privacy.service';
import { PrismaService } from '../database/prisma.service';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

/**
 * Builds a mock user object used as a Prisma query return value.
 */
function buildMockUser(overrides: Partial<Record<string, any>> = {}) {
  return {
    id: 'user-priv-001',
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '+5511999999999',
    cpf: '123.456.789-00',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  appointment: { findMany: jest.fn() },
  medication: { findMany: jest.fn() },
  healthMetric: { findMany: jest.fn() },
  healthGoal: { findMany: jest.fn() },
  claim: { findMany: jest.fn() },
  plan: { findMany: jest.fn() },
  deviceConnection: { findMany: jest.fn() },
  notification: { findMany: jest.fn() },
  gameProfile: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  medicalEvent: { findMany: jest.fn() },
  treatmentPlan: { findMany: jest.fn() },
  telemedicineSession: { findMany: jest.fn() },
  $transaction: jest.fn(),
};

describe('PrivacyService', () => {
  let service: PrivacyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivacyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PrivacyService>(PrivacyService);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Shared helper: set up all parallel queries for getMyData
  // ─────────────────────────────────────────────────────────────────────────

  function setupGetMyDataMocks(user: Record<string, any> | null) {
    mockPrismaService.user.findUnique.mockResolvedValue(user);
    mockPrismaService.appointment.findMany.mockResolvedValue([]);
    mockPrismaService.medication.findMany.mockResolvedValue([]);
    mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
    mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
    mockPrismaService.claim.findMany.mockResolvedValue([]);
    mockPrismaService.plan.findMany.mockResolvedValue([]);
    mockPrismaService.deviceConnection.findMany.mockResolvedValue([]);
    mockPrismaService.notification.findMany.mockResolvedValue([]);
    mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);
    mockPrismaService.medicalEvent.findMany.mockResolvedValue([]);
    mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);
    mockPrismaService.telemedicineSession.findMany.mockResolvedValue([]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // getMyData — Art. 18-II (Access)
  // ─────────────────────────────────────────────────────────────────────────

  describe('getMyData', () => {
    const userId = 'user-priv-001';

    it('returns a data object containing user and all health records', async () => {
      const mockUser = buildMockUser();
      const mockAppointments = [{ id: 'appt-1', userId }];
      const mockMedications = [{ id: 'med-1', userId }];
      const mockMetrics = [{ id: 'metric-1', userId, type: 'HEART_RATE', value: 72 }];

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.appointment.findMany.mockResolvedValue(mockAppointments);
      mockPrismaService.medication.findMany.mockResolvedValue(mockMedications);
      mockPrismaService.healthMetric.findMany.mockResolvedValue(mockMetrics);
      mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
      mockPrismaService.claim.findMany.mockResolvedValue([]);
      mockPrismaService.plan.findMany.mockResolvedValue([]);
      mockPrismaService.deviceConnection.findMany.mockResolvedValue([]);
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);
      mockPrismaService.medicalEvent.findMany.mockResolvedValue([]);
      mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);
      mockPrismaService.telemedicineSession.findMany.mockResolvedValue([]);

      const result = await service.getMyData(userId) as Record<string, any>;

      expect(result.user).toEqual(mockUser);
      expect(result.appointments).toEqual(mockAppointments);
      expect(result.medications).toEqual(mockMedications);
      expect(result.healthMetrics).toEqual(mockMetrics);
      expect(result).toHaveProperty('healthGoals');
      expect(result).toHaveProperty('claims');
      expect(result).toHaveProperty('plans');
      expect(result).toHaveProperty('deviceConnections');
      expect(result).toHaveProperty('notifications');
      expect(result).toHaveProperty('gameProfile');
      expect(result).toHaveProperty('medicalEvents');
      expect(result).toHaveProperty('treatmentPlans');
      expect(result).toHaveProperty('telemedicineSessions');
    });

    it('queries user with only allowed select fields', async () => {
      setupGetMyDataMocks(buildMockUser());

      await service.getMyData(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('throws PRIVACY_001 (NOT_FOUND) when user does not exist', async () => {
      setupGetMyDataMocks(null);

      try {
        await service.getMyData(userId);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('PRIVACY_001');
        expect(error.message).toContain('not found');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // exportAsFhirBundle — Art. 18-V (Portability)
  // ─────────────────────────────────────────────────────────────────────────

  describe('exportAsFhirBundle', () => {
    const userId = 'user-priv-002';

    it('returns a FHIR R4 Bundle with the correct structure', async () => {
      const mockUser = buildMockUser({ id: userId });
      setupGetMyDataMocks(mockUser);

      const result = await service.exportAsFhirBundle(userId) as Record<string, any>;

      expect(result.resourceType).toBe('Bundle');
      expect(result.type).toBe('collection');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('entry');
      expect(Array.isArray(result.entry)).toBe(true);
    });

    it('includes a Patient resource in the bundle entry', async () => {
      const mockUser = buildMockUser({ id: userId });
      setupGetMyDataMocks(mockUser);

      const result = await service.exportAsFhirBundle(userId) as Record<string, any>;

      const patientEntry = result.entry.find(
        (e: any) => e.resource.resourceType === 'Patient',
      );
      expect(patientEntry).toBeDefined();
      expect(patientEntry.resource.id).toBe(userId);
      expect(patientEntry.resource.name[0].text).toBe(mockUser.name);
      expect(patientEntry.fullUrl).toBe(`urn:uuid:${userId}`);
    });

    it('includes Observation resources for each health metric', async () => {
      const mockUser = buildMockUser({ id: userId });
      const metric = {
        id: 'metric-fhir-1',
        userId,
        type: 'HEART_RATE',
        value: 78,
        unit: 'bpm',
        timestamp: new Date().toISOString(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.healthMetric.findMany.mockResolvedValue([metric]);
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.medication.findMany.mockResolvedValue([]);
      mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
      mockPrismaService.claim.findMany.mockResolvedValue([]);
      mockPrismaService.plan.findMany.mockResolvedValue([]);
      mockPrismaService.deviceConnection.findMany.mockResolvedValue([]);
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);
      mockPrismaService.medicalEvent.findMany.mockResolvedValue([]);
      mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);
      mockPrismaService.telemedicineSession.findMany.mockResolvedValue([]);

      const result = await service.exportAsFhirBundle(userId) as Record<string, any>;

      const obsEntry = result.entry.find(
        (e: any) => e.resource.resourceType === 'Observation',
      );
      expect(obsEntry).toBeDefined();
      expect(obsEntry.resource.id).toBe(metric.id);
      expect(obsEntry.resource.status).toBe('final');
      expect(obsEntry.resource.valueQuantity.value).toBe(metric.value);
    });

    it('includes MedicationStatement resources for each medication', async () => {
      const mockUser = buildMockUser({ id: userId });
      const medication = {
        id: 'med-fhir-1',
        userId,
        name: 'Aspirina',
        active: true,
        dosage: '100mg',
        frequency: 'daily',
        startDate: new Date().toISOString(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.healthMetric.findMany.mockResolvedValue([]);
      mockPrismaService.medication.findMany.mockResolvedValue([medication]);
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.healthGoal.findMany.mockResolvedValue([]);
      mockPrismaService.claim.findMany.mockResolvedValue([]);
      mockPrismaService.plan.findMany.mockResolvedValue([]);
      mockPrismaService.deviceConnection.findMany.mockResolvedValue([]);
      mockPrismaService.notification.findMany.mockResolvedValue([]);
      mockPrismaService.gameProfile.findUnique.mockResolvedValue(null);
      mockPrismaService.medicalEvent.findMany.mockResolvedValue([]);
      mockPrismaService.treatmentPlan.findMany.mockResolvedValue([]);
      mockPrismaService.telemedicineSession.findMany.mockResolvedValue([]);

      const result = await service.exportAsFhirBundle(userId) as Record<string, any>;

      const medEntry = result.entry.find(
        (e: any) => e.resource.resourceType === 'MedicationStatement',
      );
      expect(medEntry).toBeDefined();
      expect(medEntry.resource.id).toBe(medication.id);
      expect(medEntry.resource.status).toBe('active');
      expect(medEntry.resource.medicationCodeableConcept.text).toBe(medication.name);
    });

    it('throws PRIVACY_001 (NOT_FOUND) when user does not exist', async () => {
      setupGetMyDataMocks(null);

      try {
        await service.exportAsFhirBundle(userId);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('PRIVACY_001');
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // deleteMyData — Art. 18-VI (Erasure)
  // ─────────────────────────────────────────────────────────────────────────

  describe('deleteMyData', () => {
    const userId = 'user-priv-003';

    it('executes deletion in a transaction and returns deletedCounts', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(buildMockUser({ id: userId }));

      const capturedCounts: Record<string, number> = {};
      mockPrismaService.$transaction.mockImplementation(async (callback: any) => {
        const mockTx = {
          gameProfile: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
          notification: {
            deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          notificationPreference: {
            deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          telemedicineSession: {
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
          appointment: {
            deleteMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
          medication: {
            deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          treatmentPlan: {
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
          deviceConnection: {
            deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          healthMetric: {
            deleteMany: jest.fn().mockResolvedValue({ count: 10 }),
          },
          healthGoal: {
            deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          medicalEvent: {
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
          claim: {
            deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          plan: {
            findMany: jest.fn().mockResolvedValue([]),
            deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          document: {
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
          auditLog: {
            updateMany: jest.fn().mockResolvedValue({ count: 5 }),
          },
          user: {
            delete: jest.fn().mockResolvedValue({}),
          },
        };
        await callback(mockTx);
        // Expose what the service stored in deletedCounts
        Object.assign(capturedCounts, { notification: 2 });
      });

      const result = await service.deleteMyData(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('deletedCounts');
    });

    it('throws PRIVACY_002 (NOT_FOUND) when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      try {
        await service.deleteMyData(userId);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('PRIVACY_002');
        expect(error.message).toContain('not found');
      }
    });

    it('does not call $transaction when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      try {
        await service.deleteMyData(userId);
      } catch {
        // expected
      }

      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // rectifyMyData — Art. 18-III (Rectification)
  // ─────────────────────────────────────────────────────────────────────────

  describe('rectifyMyData', () => {
    const userId = 'user-priv-004';

    it('updates user name and returns the updated record', async () => {
      const updated = buildMockUser({ id: userId, name: 'Maria Souza' });
      mockPrismaService.user.update.mockResolvedValue(updated);

      const result = await service.rectifyMyData(userId, { name: 'Maria Souza' }) as Record<string, any>;

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { name: 'Maria Souza' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          cpf: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result.name).toBe('Maria Souza');
    });

    it('updates user phone and returns the updated record', async () => {
      const updated = buildMockUser({ id: userId, phone: '+5511888888888' });
      mockPrismaService.user.update.mockResolvedValue(updated);

      const result = await service.rectifyMyData(userId, { phone: '+5511888888888' }) as Record<string, any>;

      expect(result.phone).toBe('+5511888888888');
    });

    it('checks email uniqueness before updating email', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      const updated = buildMockUser({ id: userId, email: 'newemail@example.com' });
      mockPrismaService.user.update.mockResolvedValue(updated);

      await service.rectifyMyData(userId, { email: 'newemail@example.com' });

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'newemail@example.com',
          NOT: { id: userId },
        },
      });
    });

    it('throws PRIVACY_003 (VALIDATION) when email is already in use', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: 'other-user', email: 'taken@example.com' });

      try {
        await service.rectifyMyData(userId, { email: 'taken@example.com' });
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.code).toBe('PRIVACY_003');
        expect(error.message).toContain('already in use');
      }
    });

    it('throws PRIVACY_004 (VALIDATION) when no fields are provided', async () => {
      try {
        await service.rectifyMyData(userId, {});
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.code).toBe('PRIVACY_004');
        expect(error.message).toContain('At least one field');
      }
    });

    it('does not call user.update when PRIVACY_004 is thrown', async () => {
      try {
        await service.rectifyMyData(userId, {});
      } catch {
        // expected
      }

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('updates multiple fields in a single call', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      const updated = buildMockUser({ id: userId, name: 'Updated Name', email: 'updated@example.com' });
      mockPrismaService.user.update.mockResolvedValue(updated);

      await service.rectifyMyData(userId, {
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '+5511777777777',
      });

      const callArgs = mockPrismaService.user.update.mock.calls[0][0];
      expect(callArgs.data).toEqual({
        name: 'Updated Name',
        email: 'updated@example.com',
        phone: '+5511777777777',
      });
    });
  });
});
