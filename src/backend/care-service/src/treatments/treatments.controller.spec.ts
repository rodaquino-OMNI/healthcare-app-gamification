/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { TreatmentsController } from './treatments.controller';
import { TreatmentsService } from './treatments.service';
import { TracingService } from '@app/shared/tracing/tracing.service';

describe('TreatmentsController', () => {
  let controller: TreatmentsController;

  const mockTreatmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTracingService = {
    createSpan: jest.fn().mockImplementation((_name: string, fn: () => any) => fn()),
  };

  const mockTreatmentPlan = {
    id: 'plan-test-123',
    name: 'Hypertension Management',
    description: 'Daily monitoring',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    progress: 0,
    userId: 'user-test-123',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatmentsController],
      providers: [
        {
          provide: TreatmentsService,
          useValue: mockTreatmentsService,
        },
        {
          provide: TracingService,
          useValue: mockTracingService,
        },
      ],
    }).compile();

    controller = module.get<TreatmentsController>(TreatmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-test-123';
    const createDto = {
      name: 'Hypertension Management',
      careActivityId: 'activity-test-123',
      startDate: new Date('2024-01-01'),
    };

    it('should call treatmentsService.create and return result', async () => {
      mockTreatmentsService.create.mockResolvedValue(mockTreatmentPlan);

      const result = await controller.create(userId, createDto as any);

      expect(mockTreatmentsService.create).toHaveBeenCalledWith(userId, createDto);
      expect(result).toEqual(mockTreatmentPlan);
    });

    it('should propagate errors from treatmentsService.create', async () => {
      mockTreatmentsService.create.mockRejectedValue(new Error('Invalid care activity'));

      await expect(controller.create(userId, createDto as any)).rejects.toThrow(
        'Invalid care activity',
      );
    });
  });

  describe('findAll', () => {
    const userId = 'user-test-123';

    it('should call treatmentsService.findAll with userId and filter', async () => {
      const plans = [mockTreatmentPlan];
      mockTreatmentsService.findAll.mockResolvedValue(plans);

      const result = await controller.findAll(userId, {});

      expect(mockTreatmentsService.findAll).toHaveBeenCalledWith(userId, {});
      expect(result).toEqual(plans);
    });

    it('should return empty array when no plans match', async () => {
      mockTreatmentsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(userId, {});

      expect(result).toEqual([]);
    });

    it('should forward filterDto to the service', async () => {
      mockTreatmentsService.findAll.mockResolvedValue([]);
      const filterDto = { where: { progress: 50 } } as any;

      await controller.findAll(userId, filterDto);

      expect(mockTreatmentsService.findAll).toHaveBeenCalledWith(userId, filterDto);
    });
  });

  describe('findOne', () => {
    it('should call treatmentsService.findOne with id and return result', async () => {
      mockTreatmentsService.findOne.mockResolvedValue(mockTreatmentPlan);

      const result = await controller.findOne('plan-test-123');

      expect(mockTreatmentsService.findOne).toHaveBeenCalledWith('plan-test-123');
      expect(result).toEqual(mockTreatmentPlan);
    });

    it('should propagate not found errors', async () => {
      mockTreatmentsService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    const updateDto = { name: 'Updated Plan', progress: 50 };

    it('should call treatmentsService.update with id and dto', async () => {
      const updatedPlan = { ...mockTreatmentPlan, ...updateDto };
      mockTreatmentsService.update.mockResolvedValue(updatedPlan);

      const result = await controller.update('plan-test-123', updateDto as any);

      expect(mockTreatmentsService.update).toHaveBeenCalledWith('plan-test-123', updateDto);
      expect(result.name).toBe('Updated Plan');
    });

    it('should propagate errors from update', async () => {
      mockTreatmentsService.update.mockRejectedValue(new Error('Treatment plan not found'));

      await expect(
        controller.update('nonexistent-id', updateDto as any),
      ).rejects.toThrow('Treatment plan not found');
    });
  });

  describe('remove', () => {
    it('should call treatmentsService.remove with id and return result', async () => {
      mockTreatmentsService.remove.mockResolvedValue(mockTreatmentPlan);

      const result = await controller.remove('plan-test-123');

      expect(mockTreatmentsService.remove).toHaveBeenCalledWith('plan-test-123');
      expect(result).toEqual(mockTreatmentPlan);
    });

    it('should propagate not found errors', async () => {
      mockTreatmentsService.remove.mockRejectedValue(new Error('Treatment plan not found'));

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        'Treatment plan not found',
      );
    });
  });
});
