import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';

describe('QuestsController', () => {
    let controller: QuestsController;
    let questsService: QuestsService;

    const mockQuest = {
        id: 'quest-1',
        title: 'Daily Walk',
        description: 'Walk 10,000 steps in a day',
        journey: 'health',
        icon: 'walk',
        xpReward: 100,
    };

    const mockUserQuest = {
        id: 'user-quest-1',
        profileId: 'profile-1',
        questId: 'quest-1',
        progress: 0,
        completed: false,
        quest: mockQuest,
    };

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    const mockQuestsService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        startQuest: jest.fn(),
        completeQuest: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuestsController],
            providers: [{ provide: QuestsService, useValue: mockQuestsService }],
        }).compile();

        controller = module.get<QuestsController>(QuestsController);
        questsService = module.get<QuestsService>(QuestsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // ----------------------------------------------------------------
    // findAll
    // ----------------------------------------------------------------
    describe('findAll', () => {
        it('should return all quests', async () => {
            mockQuestsService.findAll.mockResolvedValue([mockQuest]);

            const result = await controller.findAll({}, {});

            expect(mockQuestsService.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockQuest);
        });

        it('should return empty array when no quests exist', async () => {
            mockQuestsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll({}, {});

            expect(result).toEqual([]);
        });

        it('should propagate service errors', async () => {
            mockQuestsService.findAll.mockRejectedValue(new Error('DB error'));

            await expect(controller.findAll({}, {})).rejects.toThrow('DB error');
        });
    });

    // ----------------------------------------------------------------
    // findOne
    // ----------------------------------------------------------------
    describe('findOne', () => {
        it('should return a quest by ID', async () => {
            mockQuestsService.findOne.mockResolvedValue(mockQuest);

            const result = await controller.findOne('quest-1');

            expect(mockQuestsService.findOne).toHaveBeenCalledWith('quest-1');
            expect(result).toEqual(mockQuest);
        });

        it('should throw NotFoundException when quest is not found', async () => {
            mockQuestsService.findOne.mockResolvedValue(null);

            await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
        });

        it('should propagate NotFoundException from the service', async () => {
            mockQuestsService.findOne.mockRejectedValue(new NotFoundException('Not found'));

            await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    // ----------------------------------------------------------------
    // startQuest
    // ----------------------------------------------------------------
    describe('startQuest', () => {
        it('should start a quest for the authenticated user', async () => {
            mockQuestsService.startQuest.mockResolvedValue(mockUserQuest);

            const result = await controller.startQuest('quest-1', mockUser);

            expect(mockQuestsService.startQuest).toHaveBeenCalledWith('user-1', 'quest-1');
            expect(result).toEqual(mockUserQuest);
        });

        it('should propagate errors from the service', async () => {
            mockQuestsService.startQuest.mockRejectedValue(new Error('Start failed'));

            await expect(controller.startQuest('quest-1', mockUser)).rejects.toThrow('Start failed');
        });
    });

    // ----------------------------------------------------------------
    // completeQuest
    // ----------------------------------------------------------------
    describe('completeQuest', () => {
        it('should complete a quest for the authenticated user', async () => {
            const completedQuest = { ...mockUserQuest, progress: 100, completed: true };
            mockQuestsService.completeQuest.mockResolvedValue(completedQuest);

            const result = await controller.completeQuest('quest-1', mockUser);

            expect(mockQuestsService.completeQuest).toHaveBeenCalledWith('user-1', 'quest-1');
            expect(result.completed).toBe(true);
        });

        it('should propagate NotFoundException when quest is not started', async () => {
            mockQuestsService.completeQuest.mockRejectedValue(new NotFoundException('Quest not started'));

            await expect(controller.completeQuest('quest-1', mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});
