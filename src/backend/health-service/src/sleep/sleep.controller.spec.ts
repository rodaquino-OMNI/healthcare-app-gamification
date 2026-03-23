import { Test, TestingModule } from '@nestjs/testing';

import { CreateSleepRecordDto, SleepQuality } from './dto/create-sleep-record.dto';
import { FilterSleepDto } from './dto/filter-sleep.dto';
import { UpdateSleepRecordDto } from './dto/update-sleep-record.dto';
import { SleepController } from './sleep.controller';
import { SleepService } from './sleep.service';
import { MetricSource } from '../health/types/health.types';

const mockSleepService = {
    listSleepRecords: jest.fn(),
    getSleepRecord: jest.fn(),
    createSleepRecord: jest.fn(),
    updateSleepRecord: jest.fn(),
    getSleepTrends: jest.fn(),
    getSleepGoals: jest.fn(),
};

const mockUser = { id: 'user-123' };
const mockRequest = { user: mockUser };

const mockSleepRecord = {
    id: 'sleep-001',
    userId: 'user-123',
    date: new Date('2024-01-15'),
    durationMinutes: 480,
    quality: SleepQuality.GOOD,
    bedtime: new Date('2024-01-14T22:00:00Z'),
    wakeTime: new Date('2024-01-15T06:00:00Z'),
    stages: { light: 180, deep: 120, rem: 150, awake: 30 },
    notes: 'Slept well',
    source: MetricSource.USER_INPUT,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('SleepController', () => {
    let controller: SleepController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SleepController],
            providers: [
                {
                    provide: SleepService,
                    useValue: mockSleepService,
                },
            ],
        }).compile();

        controller = module.get<SleepController>(SleepController);
        jest.clearAllMocks();
    });

    describe('listSleepRecords', () => {
        it('should return paginated sleep records for the authenticated user', async () => {
            const filters: FilterSleepDto = { limit: 5, offset: 0 };
            const expected = {
                data: [mockSleepRecord],
                pagination: { limit: 5, offset: 0, total: 1 },
            };
            mockSleepService.listSleepRecords.mockResolvedValue(expected);

            const result = await controller.listSleepRecords(mockRequest, filters);

            expect(mockSleepService.listSleepRecords).toHaveBeenCalledWith('user-123', filters);
            expect(result).toEqual(expected);
        });

        it('should pass date range filters to the service', async () => {
            const filters: FilterSleepDto = {
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-01-31'),
            };
            mockSleepService.listSleepRecords.mockResolvedValue({
                data: [],
                pagination: { limit: 10, offset: 0, total: 0 },
            });

            await controller.listSleepRecords(mockRequest, filters);

            expect(mockSleepService.listSleepRecords).toHaveBeenCalledWith('user-123', filters);
        });
    });

    describe('getSleepRecord', () => {
        it('should return a single sleep record by ID', async () => {
            mockSleepService.getSleepRecord.mockResolvedValue(mockSleepRecord);

            const result = await controller.getSleepRecord(mockRequest, 'sleep-001');

            expect(mockSleepService.getSleepRecord).toHaveBeenCalledWith('user-123', 'sleep-001');
            expect(result).toEqual(mockSleepRecord);
        });

        it('should propagate NotFoundException from service', async () => {
            const { NotFoundException } = await import('@nestjs/common');
            mockSleepService.getSleepRecord.mockRejectedValue(
                new NotFoundException('Sleep record with ID nonexistent not found')
            );

            await expect(controller.getSleepRecord(mockRequest, 'nonexistent')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('createSleepRecord', () => {
        it('should create a new sleep record and return it', async () => {
            const dto: CreateSleepRecordDto = {
                date: new Date('2024-01-15'),
                durationMinutes: 480,
                quality: SleepQuality.GOOD,
                bedtime: new Date('2024-01-14T22:00:00Z'),
                wakeTime: new Date('2024-01-15T06:00:00Z'),
                stages: { light: 180, deep: 120, rem: 150, awake: 30 },
                notes: 'Slept well',
                source: MetricSource.USER_INPUT,
            };
            mockSleepService.createSleepRecord.mockResolvedValue(mockSleepRecord);

            const result = await controller.createSleepRecord(mockRequest, dto);

            expect(mockSleepService.createSleepRecord).toHaveBeenCalledWith('user-123', dto);
            expect(result).toEqual(mockSleepRecord);
        });

        it('should create a minimal sleep record without optional fields', async () => {
            const dto: CreateSleepRecordDto = {
                date: new Date('2024-01-15'),
                durationMinutes: 420,
                quality: SleepQuality.FAIR,
            };
            const minimalRecord = {
                ...mockSleepRecord,
                stages: null,
                bedtime: null,
                wakeTime: null,
            };
            mockSleepService.createSleepRecord.mockResolvedValue(minimalRecord);

            const result = await controller.createSleepRecord(mockRequest, dto);

            expect(mockSleepService.createSleepRecord).toHaveBeenCalledWith('user-123', dto);
            expect(result).toEqual(minimalRecord);
        });
    });

    describe('updateSleepRecord', () => {
        it('should update an existing sleep record', async () => {
            const dto: UpdateSleepRecordDto = {
                durationMinutes: 500,
                quality: SleepQuality.EXCELLENT,
            };
            const updated = {
                ...mockSleepRecord,
                durationMinutes: 500,
                quality: SleepQuality.EXCELLENT,
            };
            mockSleepService.updateSleepRecord.mockResolvedValue(updated);

            const result = await controller.updateSleepRecord(mockRequest, 'sleep-001', dto);

            expect(mockSleepService.updateSleepRecord).toHaveBeenCalledWith(
                'user-123',
                'sleep-001',
                dto
            );
            expect(result).toEqual(updated);
        });

        it('should propagate NotFoundException when record does not exist', async () => {
            const { NotFoundException } = await import('@nestjs/common');
            const dto: UpdateSleepRecordDto = { durationMinutes: 300 };
            mockSleepService.updateSleepRecord.mockRejectedValue(
                new NotFoundException('Sleep record with ID nonexistent not found')
            );

            await expect(
                controller.updateSleepRecord(mockRequest, 'nonexistent', dto)
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('getSleepTrends', () => {
        it('should return sleep trends for the authenticated user', async () => {
            const trends = {
                averageDuration: 450,
                averageQuality: 'GOOD',
                totalRecords: 15,
                weeklyData: [{ date: '2024-01-15', duration: 480, quality: 'GOOD' }],
            };
            mockSleepService.getSleepTrends.mockResolvedValue(trends);

            const result = await controller.getSleepTrends(mockRequest);

            expect(mockSleepService.getSleepTrends).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(trends);
        });
    });

    describe('getSleepGoals', () => {
        it('should return sleep goals for the authenticated user', async () => {
            const goals = [{ id: 'goal-1', type: 'SLEEP', targetValue: 480 }];
            mockSleepService.getSleepGoals.mockResolvedValue(goals);

            const result = await controller.getSleepGoals(mockRequest);

            expect(mockSleepService.getSleepGoals).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(goals);
        });
    });
});
