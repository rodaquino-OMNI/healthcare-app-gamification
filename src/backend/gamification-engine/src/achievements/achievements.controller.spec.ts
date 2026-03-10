/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';

describe('AchievementsController', () => {
    let controller: AchievementsController;
    let achievementsService: AchievementsService;

    const mockAchievement = {
        id: 'achievement-1',
        title: 'First Steps',
        description: 'Complete your first health check',
        journey: 'health',
        icon: 'star',
        xpReward: 100,
    };

    const mockPaginatedResponse = {
        data: [mockAchievement],
        meta: { total: 1, page: 1, limit: 10 },
    };

    const mockAchievementsService = {
        findAll: jest.fn(),
        findById: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AchievementsController],
            providers: [{ provide: AchievementsService, useValue: mockAchievementsService }],
        }).compile();

        controller = module.get<AchievementsController>(AchievementsController);
        achievementsService = module.get<AchievementsService>(AchievementsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return paginated list of achievements', async () => {
            mockAchievementsService.findAll.mockResolvedValue(mockPaginatedResponse);

            const result = await controller.findAll({ page: 1, limit: 10 }, {});

            expect(mockAchievementsService.findAll).toHaveBeenCalledWith({}, { page: 1, limit: 10 });
            expect(result).toEqual(mockPaginatedResponse);
        });

        it('should pass filter parameters to the service', async () => {
            mockAchievementsService.findAll.mockResolvedValue(mockPaginatedResponse);
            const filter = { journey: 'health', where: {} };

            await controller.findAll({ page: 1, limit: 5 }, filter as any);

            expect(mockAchievementsService.findAll).toHaveBeenCalledWith(filter, { page: 1, limit: 5 });
        });

        it('should return empty result when no achievements match', async () => {
            mockAchievementsService.findAll.mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 10 } });

            const result = await controller.findAll({ page: 1, limit: 10 }, {});

            expect(result.data).toHaveLength(0);
        });

        it('should propagate AppException from the service', async () => {
            const exception = new AppException('Query failed', 'TECHNICAL' as any, 'ACH_001', {});
            mockAchievementsService.findAll.mockRejectedValue(exception);

            await expect(controller.findAll({ page: 1, limit: 10 }, {})).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return an achievement for a valid ID', async () => {
            mockAchievementsService.findById.mockResolvedValue(mockAchievement);

            const result = await controller.findOne('achievement-1');

            expect(mockAchievementsService.findById).toHaveBeenCalledWith('achievement-1');
            expect(result).toEqual(mockAchievement);
        });

        it('should propagate AppException when achievement is not found', async () => {
            const exception = new AppException('Not found', 'BUSINESS' as any, 'ACH_002', {});
            mockAchievementsService.findById.mockRejectedValue(exception);

            await expect(controller.findOne('nonexistent')).rejects.toThrow(AppException);
        });

        it('should propagate unexpected errors from the service', async () => {
            mockAchievementsService.findById.mockRejectedValue(new Error('DB connection lost'));

            await expect(controller.findOne('achievement-1')).rejects.toThrow('DB connection lost');
        });
    });
});
