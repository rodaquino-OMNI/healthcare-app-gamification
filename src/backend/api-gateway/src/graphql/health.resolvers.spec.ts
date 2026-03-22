import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { HealthResolvers } from './health.resolvers';

describe('HealthResolvers', () => {
    let resolvers: HealthResolvers;
    let httpService: jest.Mocked<HttpService>;

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    const mockCacheManager = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        del: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        mockCacheManager.get.mockResolvedValue(null);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HealthResolvers,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('http://health-service:3002'),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        resolvers = module.get<HealthResolvers>(HealthResolvers);
        httpService = module.get(HttpService);
    });

    it('should be defined', () => {
        expect(resolvers).toBeDefined();
    });

    describe('getHealthMetrics', () => {
        it('should return health metrics for a user', async () => {
            const mockData = [{ id: 'metric-1', type: 'heart_rate' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getHealthMetrics(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });

        it('should pass filter parameters', async () => {
            const mockData = [{ id: 'metric-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            await resolvers.getHealthMetrics(
                mockUser,
                'user-1',
                ['heart_rate'],
                undefined,
                undefined,
                'wearable'
            );

            expect(httpService.get).toHaveBeenCalledWith(
                expect.stringContaining('types=heart_rate')
            );
        });
    });

    describe('getHealthGoals', () => {
        it('should return health goals', async () => {
            const mockData = [{ id: 'goal-1', status: 'active' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getHealthGoals(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getMedicalHistory', () => {
        it('should return medical history', async () => {
            const mockData = [{ id: 'event-1', type: 'condition' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getMedicalHistory(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getConnectedDevices', () => {
        it('should return connected devices', async () => {
            const mockData = [{ id: 'device-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getConnectedDevices(mockUser, 'user-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('createHealthMetric', () => {
        it('should create a health metric', async () => {
            const mockData = { id: 'metric-new' };
            httpService.post.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.createHealthMetric(mockUser, 'record-1', { value: 72 });

            expect(result).toEqual(mockData);
        });
    });

    // -------------------------------------------------------------------------
    // Error handling and edge case tests
    // -------------------------------------------------------------------------
    describe('getHealthMetrics - error handling', () => {
        it('should propagate errors from health service', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Service Unavailable')));

            await expect(resolvers.getHealthMetrics(mockUser, 'user-1')).rejects.toThrow(
                'Service Unavailable'
            );
        });

        it('should pass startDate and endDate parameters', async () => {
            httpService.get.mockReturnValue(of({ data: [] } as never));
            const start = new Date('2024-01-01');
            const end = new Date('2024-01-31');

            await resolvers.getHealthMetrics(mockUser, 'user-1', undefined, start, end);

            expect(httpService.get).toHaveBeenCalledWith(
                expect.stringContaining('startDate=2024-01-01')
            );
            expect(httpService.get).toHaveBeenCalledWith(
                expect.stringContaining('endDate=2024-01-31')
            );
        });
    });

    describe('getHealthGoals - edge cases', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.getHealthGoals(mockUser, 'user-1')).rejects.toThrow('Not Found');
        });

        it('should pass status and type filter params', async () => {
            httpService.get.mockReturnValue(of({ data: [] } as never));

            await resolvers.getHealthGoals(mockUser, 'user-1', 'active', 'weight');

            expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('status=active'));
            expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('type=weight'));
        });
    });

    describe('getMedicalHistory - error handling', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Forbidden')));

            await expect(resolvers.getMedicalHistory(mockUser, 'user-1')).rejects.toThrow(
                'Forbidden'
            );
        });
    });

    describe('getConnectedDevices - error handling', () => {
        it('should propagate errors', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.getConnectedDevices(mockUser, 'user-1')).rejects.toThrow(
                'Not Found'
            );
        });
    });

    describe('createHealthMetric - error handling', () => {
        it('should propagate errors', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('Bad Request')));

            await expect(resolvers.createHealthMetric(mockUser, 'record-1', {})).rejects.toThrow(
                'Bad Request'
            );
        });
    });
});
