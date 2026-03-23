/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { Test, TestingModule } from '@nestjs/testing';

import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityType } from './dto/create-activity-record.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';

describe('ActivityController', () => {
    let controller: ActivityController;

    const mockActivityService = {
        listActivityRecords: jest.fn(),
        getActivityRecord: jest.fn(),
        createActivityRecord: jest.fn(),
        updateActivityRecord: jest.fn(),
        getActivitySummary: jest.fn(),
        getActivityGoals: jest.fn(),
    };

    const mockUser = { id: 'user-test-123' };
    const mockReq = { user: mockUser };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActivityController],
            providers: [
                {
                    provide: ActivityService,
                    useValue: mockActivityService,
                },
            ],
        }).compile();

        controller = module.get<ActivityController>(ActivityController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('listActivityRecords', () => {
        const filters: FilterActivityDto = { limit: 10, offset: 0 };
        const mockResult = {
            data: [
                {
                    id: 'rec-1',
                    userId: mockUser.id,
                    type: ActivityType.STEPS,
                    value: 5000,
                    unit: 'steps',
                    date: new Date(),
                },
            ],
            pagination: { limit: 10, offset: 0, total: 1 },
        };

        it('should return paginated activity records', async () => {
            mockActivityService.listActivityRecords.mockResolvedValue(mockResult);

            const result = await controller.listActivityRecords(mockReq, filters);

            expect(mockActivityService.listActivityRecords).toHaveBeenCalledWith(
                mockUser.id,
                filters
            );
            expect(result).toEqual(mockResult);
        });

        it('should propagate service errors', async () => {
            mockActivityService.listActivityRecords.mockRejectedValue(new Error('DB error'));

            await expect(controller.listActivityRecords(mockReq, filters)).rejects.toThrow(
                'DB error'
            );
        });
    });

    describe('getActivityRecord', () => {
        const recordId = 'rec-test-123';
        const mockRecord = {
            id: recordId,
            userId: mockUser.id,
            type: ActivityType.STEPS,
            value: 3000,
            unit: 'steps',
        };

        it('should return a single activity record', async () => {
            mockActivityService.getActivityRecord.mockResolvedValue(mockRecord);

            const result = await controller.getActivityRecord(mockReq, recordId);

            expect(mockActivityService.getActivityRecord).toHaveBeenCalledWith(
                mockUser.id,
                recordId
            );
            expect(result).toEqual(mockRecord);
        });

        it('should propagate NotFoundException from service', async () => {
            mockActivityService.getActivityRecord.mockRejectedValue(new Error('Not found'));

            await expect(controller.getActivityRecord(mockReq, recordId)).rejects.toThrow(
                'Not found'
            );
        });
    });

    describe('createActivityRecord', () => {
        const dto = {
            type: ActivityType.STEPS,
            value: 8000,
            unit: 'steps',
            date: new Date(),
        } as any;

        const mockCreated = { id: 'new-rec-1', userId: mockUser.id, ...dto };

        it('should create and return an activity record', async () => {
            mockActivityService.createActivityRecord.mockResolvedValue(mockCreated);

            const result = await controller.createActivityRecord(mockReq, dto);

            expect(mockActivityService.createActivityRecord).toHaveBeenCalledWith(mockUser.id, dto);
            expect(result).toEqual(mockCreated);
        });

        it('should propagate errors from service', async () => {
            mockActivityService.createActivityRecord.mockRejectedValue(
                new Error('Validation failed')
            );

            await expect(controller.createActivityRecord(mockReq, dto)).rejects.toThrow(
                'Validation failed'
            );
        });
    });

    describe('getActivitySummary', () => {
        const mockSummary = {
            date: '2026-03-23',
            totalSteps: 8000,
            totalCalories: 320,
            totalDistanceKm: 5.6,
            activeMinutes: 45,
        };

        it('should return daily activity summary', async () => {
            mockActivityService.getActivitySummary.mockResolvedValue(mockSummary);

            const result = await controller.getActivitySummary(mockReq);

            expect(mockActivityService.getActivitySummary).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockSummary);
        });

        it('should return zeros when no activity recorded today', async () => {
            const emptySummary = {
                date: '2026-03-23',
                totalSteps: 0,
                totalCalories: 0,
                totalDistanceKm: 0,
                activeMinutes: 0,
            };
            mockActivityService.getActivitySummary.mockResolvedValue(emptySummary);

            const result = await controller.getActivitySummary(mockReq);

            expect(result.totalSteps).toBe(0);
        });
    });

    describe('getActivityGoals', () => {
        const mockGoals = [
            {
                id: 'goal-1',
                userId: mockUser.id,
                type: ActivityType.STEPS,
                target: 10000,
                unit: 'steps',
            },
        ];

        it('should return activity goals', async () => {
            mockActivityService.getActivityGoals.mockResolvedValue(mockGoals);

            const result = await controller.getActivityGoals(mockReq);

            expect(mockActivityService.getActivityGoals).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockGoals);
        });
    });

    describe('updateActivityRecord', () => {
        const recordId = 'rec-test-456';
        const updateDto = { value: 9500 } as any;
        const mockUpdated = { id: recordId, userId: mockUser.id, value: 9500 };

        it('should update and return the activity record', async () => {
            mockActivityService.updateActivityRecord.mockResolvedValue(mockUpdated);

            const result = await controller.updateActivityRecord(mockReq, recordId, updateDto);

            expect(mockActivityService.updateActivityRecord).toHaveBeenCalledWith(
                mockUser.id,
                recordId,
                updateDto
            );
            expect(result).toEqual(mockUpdated);
        });
    });
});
