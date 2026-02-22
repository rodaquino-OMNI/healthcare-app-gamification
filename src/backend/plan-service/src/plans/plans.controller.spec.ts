import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { LoggerService } from '@app/shared/logging/logger.service';

const mockPlansService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockLoggerService = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

describe('PlansController', () => {
  let controller: PlansController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [
        { provide: PlansService, useValue: mockPlansService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (POST /plans)', () => {
    it('should call plansService.create with the body data', async () => {
      const createPlanData = {
        name: 'Premium Plan',
        type: 'premium',
        coverageDetails: {},
      };
      const createdPlan = { id: 'test-plan-id', ...createPlanData };

      mockPlansService.create.mockResolvedValue(createdPlan);

      const result = await controller.create(createPlanData);

      expect(result).toEqual(createdPlan);
      expect(mockPlansService.create).toHaveBeenCalledWith(createPlanData);
    });

    it('should propagate service errors', async () => {
      mockPlansService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create({ name: 'Plan' })).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll (GET /plans)', () => {
    it('should return an array of plans', async () => {
      const plans = [
        { id: 'plan-1', name: 'Plan A' },
        { id: 'plan-2', name: 'Plan B' },
      ];
      mockPlansService.findAll.mockResolvedValue(plans);

      const pagination = { limit: 10, page: 1 } as any;
      const filter = {} as any;
      const result = await controller.findAll(pagination, filter);

      expect(result).toEqual(plans);
      expect(mockPlansService.findAll).toHaveBeenCalledWith(pagination, filter);
    });

    it('should pass pagination and filter parameters to service', async () => {
      mockPlansService.findAll.mockResolvedValue([]);

      const pagination = { limit: 5, page: 2 } as any;
      const filter = { where: { type: 'basic' } } as any;

      await controller.findAll(pagination, filter);

      expect(mockPlansService.findAll).toHaveBeenCalledWith(pagination, filter);
    });

    it('should propagate service errors', async () => {
      mockPlansService.findAll.mockRejectedValue(new Error('Query failed'));

      await expect(controller.findAll({} as any, {} as any)).rejects.toThrow('Query failed');
    });
  });

  describe('findOne (GET /plans/:id)', () => {
    it('should return a single plan by id', async () => {
      const plan = { id: 'test-plan-id', name: 'Test Plan' };
      mockPlansService.findOne.mockResolvedValue(plan);

      const result = await controller.findOne('test-plan-id');

      expect(result).toEqual(plan);
      expect(mockPlansService.findOne).toHaveBeenCalledWith('test-plan-id');
    });

    it('should propagate not found errors from service', async () => {
      mockPlansService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne('non-existent-id')).rejects.toThrow('Not found');
    });
  });

  describe('update (PUT /plans/:id)', () => {
    it('should update and return the plan', async () => {
      const updateData = { name: 'Updated Plan' };
      const updatedPlan = { id: 'test-plan-id', name: 'Updated Plan' };

      mockPlansService.update.mockResolvedValue(updatedPlan);

      const result = await controller.update('test-plan-id', updateData);

      expect(result).toEqual(updatedPlan);
      expect(mockPlansService.update).toHaveBeenCalledWith('test-plan-id', updateData);
    });

    it('should propagate service errors during update', async () => {
      mockPlansService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update('test-id', { name: 'New' })).rejects.toThrow('Update failed');
    });
  });

  describe('remove (DELETE /plans/:id)', () => {
    it('should call plansService.remove with the correct id', async () => {
      mockPlansService.remove.mockResolvedValue(undefined);

      await controller.remove('test-plan-id');

      expect(mockPlansService.remove).toHaveBeenCalledWith('test-plan-id');
    });

    it('should return undefined after successful deletion', async () => {
      mockPlansService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('test-plan-id');

      expect(result).toBeUndefined();
    });

    it('should propagate service errors during removal', async () => {
      mockPlansService.remove.mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.remove('test-id')).rejects.toThrow('Deletion failed');
    });
  });
});
