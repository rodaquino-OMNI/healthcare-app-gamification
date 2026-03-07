import { Test, TestingModule } from '@nestjs/testing';
import { ClaimsService } from '../src/claims/claims.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { PlansService } from '../src/plans/plans.service';
import { KafkaProducer } from '@app/shared/kafka/kafka.producer';
import { AppException } from '@app/shared/exceptions/exceptions.types';

const ID = 'claim-lc-001';
const UID = 'user-lc-001';
const PID = 'plan-lc-001';
const base = {
  id: ID, userId: UID, planId: PID, type: 'medical_visit',
  amount: 250.0, procedureCode: '99213', status: 'submitted',
  statusHistory: [] as any[], submittedAt: new Date('2026-01-15'),
};

const mockPrisma = {
  claim: {
    findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(),
    create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn(),
  },
  $transaction: jest.fn(),
};
const mockPlans = { findOne: jest.fn() };
const mockKafka = { send: jest.fn().mockResolvedValue(undefined) };

describe('Claims Lifecycle Integration', () => {
  let svc: ClaimsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        ClaimsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PlansService, useValue: mockPlans },
        { provide: KafkaProducer, useValue: mockKafka },
      ],
    }).compile();
    svc = mod.get<ClaimsService>(ClaimsService);
  });

  it('should submit claim with SUBMITTED status and emit Kafka event', async () => {
    mockPlans.findOne.mockResolvedValue({ id: PID, userId: UID });
    mockPrisma.claim.create.mockResolvedValue({ ...base });
    const result = await svc.create(UID, {
      planId: PID, type: 'medical_visit', amount: 250.0,
    } as any);

    expect(result.status).toBe('submitted');
    expect(mockPrisma.claim.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: UID, status: 'submitted' }),
      }),
    );
    expect(mockKafka.send).toHaveBeenCalledWith('plan.claims',
      expect.objectContaining({
        eventType: 'claim.submitted',
        claim: expect.objectContaining({ id: ID, status: 'submitted' }),
      }),
    );
  });

  it('should transition SUBMITTED -> APPROVED with approvedAt timestamp', async () => {
    mockPrisma.claim.findUnique.mockResolvedValue({ ...base });
    mockPrisma.claim.update.mockResolvedValue({ ...base, status: 'approved' });
    const result = await svc.update(ID, { status: 'approved' } as any);

    expect(result.status).toBe('approved');
    expect(mockPrisma.claim.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'approved', approvedAt: expect.any(Date),
          statusHistory: expect.arrayContaining([
            expect.objectContaining({ status: 'approved' }),
          ]),
        }),
      }),
    );
  });

  it('should transition SUBMITTED -> REJECTED with rejection reason', async () => {
    mockPrisma.claim.findUnique.mockResolvedValue({ ...base });
    mockPrisma.claim.update.mockResolvedValue({ ...base, status: 'rejected' });
    const result = await svc.update(ID, {
      status: 'rejected', notes: 'Not covered',
    } as any);

    expect(result.status).toBe('rejected');
    expect(mockPrisma.claim.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'rejected', rejectedAt: expect.any(Date),
          statusHistory: expect.arrayContaining([
            expect.objectContaining({ status: 'rejected', note: 'Not covered' }),
          ]),
        }),
      }),
    );
  });

  it('should reject invalid REJECTED -> APPROVED transition', async () => {
    mockPrisma.claim.findUnique.mockResolvedValue(
      { ...base, status: 'rejected' },
    );
    await expect(
      svc.update(ID, { status: 'approved' } as any),
    ).rejects.toBeInstanceOf(AppException);
    expect(mockPrisma.claim.update).not.toHaveBeenCalled();
    expect(mockKafka.send).not.toHaveBeenCalled();
  });

  it('should emit claim.updated Kafka event on valid status change', async () => {
    mockPrisma.claim.findUnique.mockResolvedValue({ ...base });
    mockPrisma.claim.update.mockResolvedValue({ ...base, status: 'under_review' });
    await svc.update(ID, { status: 'under_review' } as any);

    expect(mockKafka.send).toHaveBeenCalledTimes(1);
    expect(mockKafka.send).toHaveBeenCalledWith('plan.claims',
      expect.objectContaining({
        eventType: 'claim.updated',
        timestamp: expect.any(String),
        claim: expect.objectContaining({
          id: ID, userId: UID, planId: PID,
          status: 'under_review', amount: 250.0,
        }),
      }),
    );
  });

  it('should complete full lifecycle: submit -> review -> approve', async () => {
    mockPlans.findOne.mockResolvedValue({ id: PID, userId: UID });
    mockPrisma.claim.create.mockResolvedValue({ ...base });
    expect((await svc.create(UID, {
      planId: PID, type: 'medical_visit', amount: 250.0,
    } as any)).status).toBe('submitted');
    // Under review (from submitted state)
    mockPrisma.claim.findUnique.mockResolvedValue({ ...base, status: 'submitted' });
    mockPrisma.claim.update.mockResolvedValue({ ...base, status: 'under_review' });
    expect((await svc.update(ID, { status: 'under_review' } as any)).status)
      .toBe('under_review');
    // Approve (from submitted state — update() guard requires submitted/information_required)
    mockPrisma.claim.findUnique.mockResolvedValue(
      { ...base, status: 'submitted', statusHistory: [] },
    );
    mockPrisma.claim.update.mockResolvedValue({ ...base, status: 'approved' });
    expect((await svc.update(ID, { status: 'approved' } as any)).status)
      .toBe('approved');
    expect(mockKafka.send).toHaveBeenCalledTimes(3); // 1 create + 2 updates
  });

  it('should reject PAID -> APPROVED (terminal state)', async () => {
    mockPrisma.claim.findUnique.mockResolvedValue({ ...base, status: 'paid' });
    await expect(svc.update(ID, { status: 'approved' } as any))
      .rejects.toBeInstanceOf(AppException);
    expect(mockPrisma.claim.update).not.toHaveBeenCalled();
  });
});
