/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { LoggerService } from '@app/shared/logging/logger.service';
import { Test, TestingModule } from '@nestjs/testing';

import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

describe('InsightsController', () => {
    let controller: InsightsController;

    const mockInsightsService = {
        generateUserInsights: jest.fn(),
    };

    const mockLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        setContext: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [InsightsController],
            providers: [
                {
                    provide: InsightsService,
                    useValue: mockInsightsService,
                },
                {
                    provide: LoggerService,
                    useValue: mockLogger,
                },
            ],
        }).compile();

        controller = module.get<InsightsController>(InsightsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getInsights', () => {
        const mockUser = { id: 'user-test-123', email: 'test@example.com' };
        const mockReq = { user: mockUser };

        const mockInsights = {
            metricsCount: 10,
            goalsCount: 2,
            recommendations: ['Stay hydrated', 'Get some exercise'],
        };

        it('should call insightsService.generateUserInsights with user id', async () => {
            mockInsightsService.generateUserInsights.mockResolvedValue(mockInsights);

            const result = await controller.getInsights(mockReq as any, mockUser);

            expect(mockInsightsService.generateUserInsights).toHaveBeenCalledWith(mockUser.id);
            expect(result).toEqual(mockInsights);
        });

        it('should return generated insights', async () => {
            mockInsightsService.generateUserInsights.mockResolvedValue(mockInsights);

            const result = await controller.getInsights(mockReq as any, mockUser);

            expect(result).toHaveProperty('metricsCount');
            expect(result).toHaveProperty('recommendations');
        });

        it('should propagate errors from insightsService.generateUserInsights', async () => {
            mockInsightsService.generateUserInsights.mockRejectedValue(
                new Error('Failed to generate insights')
            );

            await expect(controller.getInsights(mockReq as any, mockUser)).rejects.toThrow(
                'Failed to generate insights'
            );
        });

        it('should log the request before calling the service', async () => {
            mockInsightsService.generateUserInsights.mockResolvedValue(mockInsights);

            await controller.getInsights(mockReq as any, mockUser);

            expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(mockUser.id));
        });
    });
});
