import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { HealthResolvers } from './health.resolvers';

describe('HealthResolvers', () => {
    let resolvers: HealthResolvers;
    let httpService: jest.Mocked<HttpService>;

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    beforeEach(async () => {
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
});
