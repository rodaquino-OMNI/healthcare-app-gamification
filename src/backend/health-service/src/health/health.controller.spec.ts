import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
    let controller: HealthController;
    let service: HealthService;

    const mockHealthService = {
        createHealthMetric: jest.fn(),
        updateHealthMetric: jest.fn(),
    };

    const mockMetric = {
        id: 'metric-123',
        userId: 'user-123',
        type: 'HEART_RATE',
        value: 72,
        unit: 'bpm',
        timestamp: new Date(),
        source: 'USER_INPUT',
        notes: null,
        isAbnormal: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthService,
                    useValue: mockHealthService,
                },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
        service = module.get<HealthService>(HealthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createHealthMetric', () => {
        const createDto = {
            type: 'HEART_RATE',
            value: 72,
            unit: 'bpm',
            source: 'USER_INPUT',
        };

        it('should create a health metric and return it', async () => {
            mockHealthService.createHealthMetric.mockResolvedValue(mockMetric);

            const result = await controller.createHealthMetric('record-123', createDto as any);

            expect(result).toEqual(mockMetric);
            expect(service.createHealthMetric).toHaveBeenCalledWith('record-123', createDto);
        });

        it('should propagate validation errors', async () => {
            mockHealthService.createHealthMetric.mockRejectedValue(
                new Error('Metric value cannot be negative')
            );

            await expect(
                controller.createHealthMetric('record-123', { ...createDto, value: -1 } as any)
            ).rejects.toThrow('Metric value cannot be negative');
        });

        it('should propagate range validation errors', async () => {
            mockHealthService.createHealthMetric.mockRejectedValue(
                new Error('HEART_RATE value must be between 30 and 250')
            );

            await expect(
                controller.createHealthMetric('record-123', { ...createDto, value: 300 } as any)
            ).rejects.toThrow('HEART_RATE value must be between 30 and 250');
        });
    });

    describe('updateHealthMetric', () => {
        const updateDto = {
            value: 80,
        };

        it('should update a health metric and return it', async () => {
            const updatedMetric = { ...mockMetric, value: 80 };
            mockHealthService.updateHealthMetric.mockResolvedValue(updatedMetric);

            const result = await controller.updateHealthMetric('metric-123', updateDto as any);

            expect(result).toEqual(updatedMetric);
            expect(service.updateHealthMetric).toHaveBeenCalledWith('metric-123', updateDto);
        });

        it('should propagate not found errors', async () => {
            mockHealthService.updateHealthMetric.mockRejectedValue(
                new Error('Health metric with ID metric-999 not found')
            );

            await expect(
                controller.updateHealthMetric('metric-999', updateDto as any)
            ).rejects.toThrow('Health metric with ID metric-999 not found');
        });

        it('should propagate range validation on update', async () => {
            mockHealthService.updateHealthMetric.mockRejectedValue(
                new Error('HEART_RATE value must be between 30 and 250')
            );

            await expect(
                controller.updateHealthMetric('metric-123', { value: 999 } as any)
            ).rejects.toThrow('HEART_RATE value must be between 30 and 250');
        });
    });
});
