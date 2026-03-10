import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { TracingService } from '../../../shared/src/tracing/tracing.service';

describe('LeaderboardController', () => {
    let controller: LeaderboardController;
    let leaderboardService: LeaderboardService;

    const mockLeaderboardData = [
        { rank: 1, userId: 'user-3', level: 7, xp: 680, achievements: 3 },
        { rank: 2, userId: 'user-1', level: 5, xp: 450, achievements: 1 },
        { rank: 3, userId: 'user-2', level: 3, xp: 275, achievements: 0 },
    ];

    const mockLeaderboardService = {
        getLeaderboard: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    };

    const mockTracingService = {
        createSpan: jest.fn().mockImplementation((_name: string, fn: () => any) => fn()),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [LeaderboardController],
            providers: [
                { provide: LeaderboardService, useValue: mockLeaderboardService },
                { provide: LoggerService, useValue: mockLoggerService },
                { provide: TracingService, useValue: mockTracingService },
            ],
        }).compile();

        controller = module.get<LeaderboardController>(LeaderboardController);
        leaderboardService = module.get<LeaderboardService>(LeaderboardService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // ----------------------------------------------------------------
    // getLeaderboard
    // ----------------------------------------------------------------
    describe('getLeaderboard', () => {
        it('should return leaderboard data for the health journey', async () => {
            mockLeaderboardService.getLeaderboard.mockResolvedValue(mockLeaderboardData);

            const result = await controller.getLeaderboard('health');

            expect(mockLeaderboardService.getLeaderboard).toHaveBeenCalledWith('health');
            expect(result).toEqual(mockLeaderboardData);
        });

        it('should return leaderboard data for the care journey', async () => {
            mockLeaderboardService.getLeaderboard.mockResolvedValue(mockLeaderboardData);

            const result = await controller.getLeaderboard('care');

            expect(mockLeaderboardService.getLeaderboard).toHaveBeenCalledWith('care');
            expect(result).toBeDefined();
        });

        it('should log the incoming request with journey name', async () => {
            mockLeaderboardService.getLeaderboard.mockResolvedValue(mockLeaderboardData);

            await controller.getLeaderboard('plan');

            expect(mockLoggerService.log).toHaveBeenCalledWith(
                expect.stringContaining('plan'),
                'LeaderboardController'
            );
        });

        it('should propagate errors thrown by the leaderboard service', async () => {
            mockLeaderboardService.getLeaderboard.mockRejectedValue(new Error('Cache failure'));

            await expect(controller.getLeaderboard('health')).rejects.toThrow('Cache failure');
        });

        it('should return empty array when no profiles exist for journey', async () => {
            mockLeaderboardService.getLeaderboard.mockResolvedValue([]);

            const result = await controller.getLeaderboard('health');

            expect(result).toEqual([]);
        });
    });
});
