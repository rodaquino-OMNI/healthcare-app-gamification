import { PrismaService } from '@app/shared/database/prisma.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CycleService } from './cycle.service';
import { CreateCycleRecordDto } from './dto/create-cycle-record.dto';

describe('CycleService', () => {
    let service: CycleService;
    let prismaService: {
        cycleRecord: {
            findMany: jest.Mock;
            findFirst: jest.Mock;
            findUnique: jest.Mock;
            create: jest.Mock;
            update: jest.Mock;
            count: jest.Mock;
        };
    };
    let redisService: jest.Mocked<Pick<RedisService, 'get' | 'set' | 'del'>>;

    const mockUserId = 'user-abc';
    const mockRecordId = 'record-xyz';

    const makeRecord = (
        overrides: Partial<{
            id: string;
            userId: string;
            startDate: Date;
            endDate: Date | null;
            cycleLength: number | null;
            periodLength: number | null;
            flowIntensity: string | null;
            symptoms: unknown;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        }> = {}
    ) => ({
        id: mockRecordId,
        userId: mockUserId,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-05'),
        cycleLength: 28,
        periodLength: 5,
        flowIntensity: 'medium',
        symptoms: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    });

    beforeEach(async () => {
        prismaService = {
            cycleRecord: {
                findMany: jest.fn(),
                findFirst: jest.fn(),
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                count: jest.fn(),
            },
        };

        redisService = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(undefined),
        } as unknown as jest.Mocked<Pick<RedisService, 'get' | 'set' | 'del'>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CycleService,
                { provide: PrismaService, useValue: prismaService },
                { provide: RedisService, useValue: redisService },
            ],
        }).compile();

        service = module.get<CycleService>(CycleService);
    });

    describe('createCycleRecord', () => {
        it('should create a new cycle record and invalidate cache', async () => {
            const dto: CreateCycleRecordDto = {
                startDate: new Date('2026-03-15'),
                cycleLength: 28,
                periodLength: 5,
                flowIntensity: 'medium',
            };
            const created = makeRecord({ startDate: dto.startDate });
            prismaService.cycleRecord.create.mockResolvedValue(created);

            const result = await service.createCycleRecord(mockUserId, dto);

            expect(result).toEqual(created);
            expect(prismaService.cycleRecord.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ userId: mockUserId, startDate: dto.startDate }),
            });
            expect(redisService.del).toHaveBeenCalledTimes(3);
        });

        it('should create a cycle record with symptoms', async () => {
            const dto: CreateCycleRecordDto = {
                startDate: new Date('2026-03-15'),
                symptoms: [{ type: 'cramps', severity: 'mild', date: '2026-03-15' }],
            };
            const created = makeRecord({ symptoms: dto.symptoms });
            prismaService.cycleRecord.create.mockResolvedValue(created);

            await service.createCycleRecord(mockUserId, dto);

            expect(prismaService.cycleRecord.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ symptoms: dto.symptoms }),
            });
        });
    });

    describe('listCycleRecords', () => {
        it('should return paginated records with total count', async () => {
            const records = [makeRecord()];
            prismaService.cycleRecord.findMany.mockResolvedValue(records);
            prismaService.cycleRecord.count.mockResolvedValue(1);

            const result = await service.listCycleRecords(mockUserId, { limit: 10, offset: 0 });

            expect(result).toEqual({ records, total: 1, limit: 10, offset: 0 });
            expect(prismaService.cycleRecord.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: mockUserId }, take: 10, skip: 0 })
            );
        });

        it('should apply date range filter to queries', async () => {
            prismaService.cycleRecord.findMany.mockResolvedValue([]);
            prismaService.cycleRecord.count.mockResolvedValue(0);

            await service.listCycleRecords(mockUserId, {
                startDate: '2026-01-01',
                endDate: '2026-03-31',
            });

            expect(prismaService.cycleRecord.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        userId: mockUserId,
                        startDate: expect.any(Object),
                    }),
                })
            );
        });
    });

    describe('getCycleRecord', () => {
        it('should return the record when found', async () => {
            const record = makeRecord();
            prismaService.cycleRecord.findFirst.mockResolvedValue(record);

            const result = await service.getCycleRecord(mockUserId, mockRecordId);

            expect(result).toEqual(record);
            expect(prismaService.cycleRecord.findFirst).toHaveBeenCalledWith({
                where: { id: mockRecordId, userId: mockUserId },
            });
        });

        it('should throw NotFoundException when record does not exist', async () => {
            prismaService.cycleRecord.findFirst.mockResolvedValue(null);

            await expect(service.getCycleRecord(mockUserId, 'nonexistent')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('getPredictions', () => {
        it('should return cached prediction when available', async () => {
            const cachedPrediction = {
                predictedNextStart: new Date('2026-04-12').toISOString(),
                averageCycleLength: 28,
                averagePeriodLength: 5,
                confidence: 0.83,
            };
            (redisService.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedPrediction));

            const result = await service.getPredictions(mockUserId);

            expect(result).toEqual(cachedPrediction);
            expect(prismaService.cycleRecord.findMany).not.toHaveBeenCalled();
        });

        it('should calculate predictions from recent records when cache is empty', async () => {
            const records = [
                makeRecord({ startDate: new Date('2026-03-01'), cycleLength: 30 }),
                makeRecord({ id: 'r2', startDate: new Date('2026-02-01'), cycleLength: 26 }),
                makeRecord({ id: 'r3', startDate: new Date('2026-01-01'), cycleLength: 28 }),
            ];
            prismaService.cycleRecord.findMany.mockResolvedValue(records);

            const result = await service.getPredictions(mockUserId);

            expect(result.averageCycleLength).toBe(28);
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.predictedNextStart).toBeInstanceOf(Date);
            expect(redisService.set).toHaveBeenCalled();
        });

        it('should return default prediction when no records exist', async () => {
            prismaService.cycleRecord.findMany.mockResolvedValue([]);

            const result = await service.getPredictions(mockUserId);

            expect(result.averageCycleLength).toBe(28);
            expect(result.confidence).toBe(0);
        });
    });

    describe('getSymptomsSummary', () => {
        it('should aggregate symptom types and frequencies', async () => {
            const records = [
                {
                    symptoms: [
                        { type: 'cramps', severity: 'mild', date: '2026-03-01' },
                        { type: 'bloating', severity: 'moderate', date: '2026-03-01' },
                    ],
                },
                {
                    symptoms: [{ type: 'cramps', severity: 'severe', date: '2026-02-01' }],
                },
                { symptoms: null },
            ];
            prismaService.cycleRecord.findMany.mockResolvedValue(records);

            const result = await service.getSymptomsSummary(mockUserId);

            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ type: 'cramps', count: 2 }),
                    expect.objectContaining({ type: 'bloating', count: 1 }),
                ])
            );
            // sorted by frequency descending
            expect(result[0].type).toBe('cramps');
        });

        it('should return empty array when no symptom records exist', async () => {
            prismaService.cycleRecord.findMany.mockResolvedValue([]);

            const result = await service.getSymptomsSummary(mockUserId);

            expect(result).toEqual([]);
        });

        it('should use cached summary when available', async () => {
            const cached = [{ type: 'cramps', count: 5, severities: ['mild'] }];
            (redisService.get as jest.Mock).mockResolvedValue(JSON.stringify(cached));

            const result = await service.getSymptomsSummary(mockUserId);

            expect(result).toEqual(cached);
            expect(prismaService.cycleRecord.findMany).not.toHaveBeenCalled();
        });
    });

    describe('updateCycleRecord', () => {
        it('should update an existing cycle record', async () => {
            const existing = makeRecord();
            const updated = makeRecord({ flowIntensity: 'heavy' });
            prismaService.cycleRecord.findFirst.mockResolvedValue(existing);
            prismaService.cycleRecord.update.mockResolvedValue(updated);

            const result = await service.updateCycleRecord(mockUserId, mockRecordId, {
                flowIntensity: 'heavy',
            });

            expect(result).toEqual(updated);
            expect(prismaService.cycleRecord.update).toHaveBeenCalledWith({
                where: { id: mockRecordId },
                data: expect.objectContaining({ flowIntensity: 'heavy' }),
            });
            expect(redisService.del).toHaveBeenCalledTimes(3);
        });
    });
});
