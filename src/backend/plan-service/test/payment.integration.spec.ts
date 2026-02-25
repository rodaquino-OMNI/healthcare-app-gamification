import { Test, TestingModule } from '@nestjs/testing';
import { PlansService } from '../src/plans/plans.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';

const mockPrisma = {
  plan: {
    findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(),
    update: jest.fn(), delete: jest.fn(), count: jest.fn(),
  },
  $transaction: jest.fn(),
};
const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() };
const mockTracing = {
  createSpan: jest.fn().mockImplementation((_n: string, fn: () => unknown) => fn()),
};

const PLAN_ID = 'plan-test-001';
const COVERED = 'CONS-001';
const UNCOVERED = 'DENT-999';
const CATEGORY = 'SUR-050';

const basePlan = {
  id: PLAN_ID, userId: 'user-001', planNumber: 'AUSTA-1234', type: 'individual',
  validityStart: new Date('2025-01-01'), validityEnd: new Date('2026-12-31'),
  journey: 'plan', createdAt: new Date(), updatedAt: new Date(),
};
const coverageDetails = {
  procedures: {
    [COVERED]: { covered: true, percentage: 80 },
    [UNCOVERED]: { covered: false, percentage: 0 },
  },
  categories: { SUR: { covered: true, percentage: 70 } },
  defaults: { consultations: 60 },
};

function mockPlanWith(details: object | null) {
  mockPrisma.plan.findUnique.mockResolvedValue({ ...basePlan, coverageDetails: details });
}

describe('Payment & Coverage Integration (PlansService)', () => {
  let service: PlansService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: mockLogger },
        { provide: TracingService, useValue: mockTracing },
      ],
    }).compile();
    service = module.get<PlansService>(PlansService);
  });

  describe('verifyCoverage', () => {
    it('should return true for a covered procedure', async () => {
      mockPlanWith(coverageDetails);
      const result = await service.verifyCoverage(PLAN_ID, COVERED);
      expect(result).toBe(true);
      expect(mockPrisma.plan.findUnique).toHaveBeenCalledWith({ where: { id: PLAN_ID } });
    });

    it('should return false for an uncovered procedure', async () => {
      mockPlanWith(coverageDetails);
      const result = await service.verifyCoverage(PLAN_ID, UNCOVERED);
      expect(result).toBe(false);
    });

    it('should fall back to category coverage when procedure not listed', async () => {
      mockPlanWith(coverageDetails);
      const result = await service.verifyCoverage(PLAN_ID, CATEGORY);
      expect(result).toBe(true);
    });

    it('should return false when coverageDetails is null', async () => {
      mockPlanWith(null);
      const result = await service.verifyCoverage(PLAN_ID, COVERED);
      expect(result).toBe(false);
    });
  });

  describe('calculateCoverage', () => {
    it('should return correct copay and coverage amounts', async () => {
      mockPlanWith(coverageDetails);
      const result = await service.calculateCoverage(PLAN_ID, COVERED, 500);
      expect(result).toEqual({ covered: true, coverageAmount: 400, copayAmount: 100 });
    });

    it('should use category percentage when procedure not listed', async () => {
      mockPlanWith(coverageDetails);
      const result = await service.calculateCoverage(PLAN_ID, CATEGORY, 1000);
      expect(result).toEqual({ covered: true, coverageAmount: 700, copayAmount: 300 });
    });

    it('should return full amount as copay for uncovered procedure', async () => {
      mockPlanWith(coverageDetails);
      const result = await service.calculateCoverage(PLAN_ID, UNCOVERED, 250);
      expect(result).toEqual({ covered: false, coverageAmount: 0, copayAmount: 250 });
    });

    it('should throw AppException when plan is not found', async () => {
      mockPrisma.plan.findUnique.mockResolvedValue(null);
      await expect(
        service.calculateCoverage('non-existent', COVERED, 100),
      ).rejects.toBeInstanceOf(AppException);
    });

    it('should return default result when coverageDetails is null', async () => {
      mockPlanWith(null);
      const result = await service.calculateCoverage(PLAN_ID, COVERED, 300);
      expect(result).toEqual({ covered: false, coverageAmount: 0, copayAmount: 300 });
    });
  });
});
