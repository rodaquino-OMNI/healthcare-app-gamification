/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { Test, TestingModule } from '@nestjs/testing';

import { Reward } from './entities/reward.entity';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';

describe('RewardsController', () => {
    let controller: RewardsController;
    let _rewardsService: RewardsService;

    const mockReward: Partial<Reward> = {
        id: 'reward-1',
        title: 'Health Champion',
        description: 'Complete 30 days of healthy habits',
        xpReward: 500,
        icon: 'trophy',
        journey: 'health',
    };

    const mockRewardsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RewardsController],
            providers: [{ provide: RewardsService, useValue: mockRewardsService }],
        }).compile();

        controller = module.get<RewardsController>(RewardsController);
        _rewardsService = module.get<RewardsService>(RewardsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // ----------------------------------------------------------------
    // create
    // ----------------------------------------------------------------
    describe('create', () => {
        it('should create and return a new reward', async () => {
            mockRewardsService.create.mockResolvedValue(mockReward);

            const result = await controller.create(mockReward as any);

            expect(mockRewardsService.create).toHaveBeenCalledWith(mockReward);
            expect(result).toEqual(mockReward);
        });

        it('should propagate AppException when creation fails', async () => {
            const exception = new AppException('Failed', 'TECHNICAL' as any, 'REWARD_001', {});
            mockRewardsService.create.mockRejectedValue(exception);

            await expect(controller.create(mockReward as any)).rejects.toThrow(AppException);
        });

        it('should pass all provided fields to the service', async () => {
            mockRewardsService.create.mockResolvedValue(mockReward);

            await controller.create(mockReward as any);

            expect(mockRewardsService.create).toHaveBeenCalledWith(
                expect.objectContaining({ title: 'Health Champion', journey: 'health' })
            );
        });
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return all rewards', async () => {
            const rewards = [mockReward, { ...mockReward, id: 'reward-2', title: 'Care Star' }];
            mockRewardsService.findAll.mockResolvedValue(rewards);

            const result = await controller.findAll();

            expect(mockRewardsService.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no rewards exist', async () => {
            mockRewardsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
        });

        it('should propagate AppException from the service', async () => {
            const exception = new AppException('DB failed', 'TECHNICAL' as any, 'REWARD_002', {});
            mockRewardsService.findAll.mockRejectedValue(exception);

            await expect(controller.findAll()).rejects.toThrow(AppException);
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return a reward for a valid ID', async () => {
            mockRewardsService.findOne.mockResolvedValue(mockReward);

            const result = await controller.findOne('reward-1');

            expect(mockRewardsService.findOne).toHaveBeenCalledWith('reward-1');
            expect(result).toEqual(mockReward);
        });

        it('should propagate AppException when reward is not found', async () => {
            const exception = new AppException('Not found', 'BUSINESS' as any, 'REWARD_003', {});
            mockRewardsService.findOne.mockRejectedValue(exception);

            await expect(controller.findOne('nonexistent')).rejects.toThrow(AppException);
        });

        it('should propagate unexpected service errors', async () => {
            mockRewardsService.findOne.mockRejectedValue(new Error('Unexpected'));

            await expect(controller.findOne('reward-1')).rejects.toThrow('Unexpected');
        });
    });
});
