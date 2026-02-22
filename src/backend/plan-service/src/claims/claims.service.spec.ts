import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { PlansService } from '../plans/plans.service';
import { KafkaProducer } from '@app/shared/kafka/kafka.producer';
import { AppException } from '@app/shared/exceptions/exceptions.types';

const mockPrismaService = {
  claim: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockPlansService = {
  findOne: jest.fn(),
};

const mockKafkaProducer = {
  send: jest.fn().mockResolvedValue(undefined),
};

describe('ClaimsService', () => {
  let service: ClaimsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PlansService, useValue: mockPlansService },
        { provide: KafkaProducer, useValue: mockKafkaProducer },
      ],
    }).compile();

    service = module.get<ClaimsService>(ClaimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'test-user-id';
    const planId = 'test-plan-id';
    const createClaimDto = {
      planId,
      type: 'medical_visit',
      amount: 150.50,
      userId,
    } as any;

    it('should create and return a new claim', async () => {
      const plan = { id: planId, userId };
      const createdClaim = {
        id: 'test-claim-id',
        userId,
        planId,
        type: 'medical_visit',
        amount: 150.50,
        status: 'submitted',
        submittedAt: new Date(),
      };

      mockPlansService.findOne.mockResolvedValue(plan);
      mockPrismaService.claim.create.mockResolvedValue(createdClaim);

      const result = await service.create(userId, createClaimDto);

      expect(result).toEqual(createdClaim);
      expect(mockPrismaService.claim.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId, planId, status: 'submitted' }),
        })
      );
    });

    it('should publish a Kafka event after creating claim', async () => {
      const plan = { id: planId, userId };
      const createdClaim = {
        id: 'test-claim-id',
        userId,
        planId,
        type: 'medical_visit',
        amount: 150.50,
        status: 'submitted',
        submittedAt: new Date(),
      };

      mockPlansService.findOne.mockResolvedValue(plan);
      mockPrismaService.claim.create.mockResolvedValue(createdClaim);

      await service.create(userId, createClaimDto);

      expect(mockKafkaProducer.send).toHaveBeenCalledWith(
        'plan.claims',
        expect.objectContaining({ eventType: 'claim.submitted' })
      );
    });

    it('should throw AppException when user does not own the plan', async () => {
      const plan = { id: planId, userId: 'other-user-id' };
      mockPlansService.findOne.mockResolvedValue(plan);

      await expect(service.create(userId, createClaimDto)).rejects.toBeInstanceOf(AppException);
    });

    it('should throw AppException on DB error during creation', async () => {
      const plan = { id: planId, userId };
      mockPlansService.findOne.mockResolvedValue(plan);
      mockPrismaService.claim.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(userId, createClaimDto)).rejects.toBeInstanceOf(AppException);
    });
  });

  describe('findAll', () => {
    const userId = 'test-user-id';

    it('should return paginated claims for a user', async () => {
      const claims = [
        { id: 'claim-1', userId, status: 'submitted' },
        { id: 'claim-2', userId, status: 'approved' },
      ];
      mockPrismaService.claim.count.mockResolvedValue(2);
      mockPrismaService.claim.findMany.mockResolvedValue(claims);

      const result = await service.findAll(userId);

      expect(result.data).toEqual(claims);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
    });

    it('should apply filter criteria when provided', async () => {
      mockPrismaService.claim.count.mockResolvedValue(1);
      mockPrismaService.claim.findMany.mockResolvedValue([]);

      const filter = { where: { status: 'submitted' } };
      await service.findAll(userId, filter as any);

      expect(mockPrismaService.claim.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId, status: 'submitted' }),
        })
      );
    });

    it('should apply pagination when provided', async () => {
      mockPrismaService.claim.count.mockResolvedValue(20);
      mockPrismaService.claim.findMany.mockResolvedValue([]);

      const pagination = { page: 2, limit: 5 };
      const result = await service.findAll(userId, undefined, pagination as any);

      expect(result.limit).toBe(5);
      expect(result.page).toBe(2);
    });

    it('should throw AppException on DB error', async () => {
      mockPrismaService.claim.count.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll(userId)).rejects.toBeInstanceOf(AppException);
    });
  });

  describe('findOne', () => {
    it('should return a claim by id', async () => {
      const claim = { id: 'test-claim-id', userId: 'test-user-id', status: 'submitted' };
      mockPrismaService.claim.findUnique.mockResolvedValue(claim);

      const result = await service.findOne('test-claim-id');

      expect(result).toEqual(claim);
      expect(mockPrismaService.claim.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-claim-id' },
      });
    });

    it('should throw AppException when claim not found', async () => {
      mockPrismaService.claim.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toBeInstanceOf(AppException);
    });

    it('should throw AppException on DB error', async () => {
      mockPrismaService.claim.findUnique.mockRejectedValue(new Error('DB error'));

      await expect(service.findOne('test-id')).rejects.toBeInstanceOf(AppException);
    });
  });

  describe('update', () => {
    it('should update a claim in submitted status', async () => {
      const existingClaim = {
        id: 'test-claim-id',
        status: 'submitted',
        statusHistory: [],
      };
      const updateDto = { notes: 'Updated notes' } as any;
      const updatedClaim = { ...existingClaim, notes: 'Updated notes' };

      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);
      mockPrismaService.claim.update.mockResolvedValue(updatedClaim);

      const result = await service.update('test-claim-id', updateDto);

      expect(result).toEqual(updatedClaim);
    });

    it('should publish Kafka event after update', async () => {
      const existingClaim = {
        id: 'test-claim-id',
        status: 'submitted',
        statusHistory: [],
      };
      const updateDto = { notes: 'Updated' } as any;
      const updatedClaim = { ...existingClaim };

      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);
      mockPrismaService.claim.update.mockResolvedValue(updatedClaim);

      await service.update('test-claim-id', updateDto);

      expect(mockKafkaProducer.send).toHaveBeenCalledWith(
        'plan.claims',
        expect.objectContaining({ eventType: 'claim.updated' })
      );
    });

    it('should throw AppException when claim status is not updatable', async () => {
      const existingClaim = { id: 'test-claim-id', status: 'paid', statusHistory: [] };
      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);

      const updateDto = { notes: 'Some note' } as any;

      await expect(service.update('test-claim-id', updateDto)).rejects.toBeInstanceOf(AppException);
    });

    it('should throw AppException for invalid status transition', async () => {
      const existingClaim = {
        id: 'test-claim-id',
        status: 'submitted',
        statusHistory: [],
      };
      const updateDto = { status: 'paid' } as any;

      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);

      await expect(service.update('test-claim-id', updateDto)).rejects.toBeInstanceOf(AppException);
    });

    it('should throw AppException when claim not found', async () => {
      mockPrismaService.claim.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', {} as any)).rejects.toBeInstanceOf(AppException);
    });
  });

  describe('remove', () => {
    it('should delete a claim in submitted status', async () => {
      const existingClaim = { id: 'test-claim-id', status: 'submitted', userId: 'test-user' };
      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);
      mockPrismaService.claim.delete.mockResolvedValue(existingClaim);

      const result = await service.remove('test-claim-id');

      expect(result).toBe(true);
      expect(mockPrismaService.claim.delete).toHaveBeenCalledWith({
        where: { id: 'test-claim-id' },
      });
    });

    it('should publish Kafka event after deletion', async () => {
      const existingClaim = { id: 'test-claim-id', status: 'submitted', userId: 'test-user' };
      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);
      mockPrismaService.claim.delete.mockResolvedValue(existingClaim);

      await service.remove('test-claim-id');

      expect(mockKafkaProducer.send).toHaveBeenCalledWith(
        'plan.claims',
        expect.objectContaining({ eventType: 'claim.deleted' })
      );
    });

    it('should throw AppException when claim is not in submitted status', async () => {
      const existingClaim = { id: 'test-claim-id', status: 'approved' };
      mockPrismaService.claim.findUnique.mockResolvedValue(existingClaim);

      await expect(service.remove('test-claim-id')).rejects.toBeInstanceOf(AppException);
    });

    it('should throw AppException when claim not found', async () => {
      mockPrismaService.claim.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toBeInstanceOf(AppException);
    });
  });
});
