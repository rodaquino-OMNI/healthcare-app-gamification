import { Test, TestingModule } from '@nestjs/testing';
import { CostSimulatorController } from './cost-simulator.controller';
import { CostSimulatorService } from './cost-simulator.service';
import { ProcedureType, CodingStandard, SimulateCostDto } from './dto/simulate-cost.dto';

const mockCostSimulatorService = {
  simulateCost: jest.fn(),
};

describe('CostSimulatorController', () => {
  let controller: CostSimulatorController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostSimulatorController],
      providers: [
        { provide: CostSimulatorService, useValue: mockCostSimulatorService },
      ],
    }).compile();

    controller = module.get<CostSimulatorController>(CostSimulatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('simulateCost (POST /cost-simulator)', () => {
    const validPlanId = 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6';

    it('should return cost simulation result for a consultation', async () => {
      const dto: SimulateCostDto = {
        procedureCode: '99213',
        procedureType: ProcedureType.CONSULTATION,
        estimatedFullCost: 200,
        planId: validPlanId,
        networkType: 'in-network',
      };

      const simulationResult = {
        procedureCode: '99213',
        procedureType: ProcedureType.CONSULTATION,
        estimatedFullCost: 200,
        coveragePercentage: 80,
        coveredAmount: 160,
        outOfPocketAmount: 40,
        networkType: 'in-network',
        planId: validPlanId,
        costBreakdown: { professionalFee: 180, facilityFee: 20 },
        coverageAdjustments: { networkAdjustment: 0, facilityAdjustment: 0, recurringDiscount: 0 },
        simulatedAt: new Date().toISOString(),
        isRecurring: false,
        occurrences: 1,
        codingStandard: 'Unknown',
        facilityId: undefined,
      };

      mockCostSimulatorService.simulateCost.mockResolvedValue(simulationResult);

      const result = await controller.simulateCost(dto);

      expect(result).toEqual(simulationResult);
      expect(mockCostSimulatorService.simulateCost).toHaveBeenCalledWith(dto);
    });

    it('should pass the full DTO to the service', async () => {
      const dto: SimulateCostDto = {
        procedureCode: 'SUR-001',
        codingStandard: CodingStandard.CPT,
        procedureType: ProcedureType.SURGERY,
        estimatedFullCost: 5000,
        planId: validPlanId,
        networkType: 'out-of-network',
        isRecurring: false,
      };

      const mockResult = { coveredAmount: 2000, outOfPocketAmount: 3000 };
      mockCostSimulatorService.simulateCost.mockResolvedValue(mockResult);

      await controller.simulateCost(dto);

      expect(mockCostSimulatorService.simulateCost).toHaveBeenCalledWith(dto);
    });

    it('should handle recurring procedure simulation', async () => {
      const dto: SimulateCostDto = {
        procedureCode: 'THER-001',
        procedureType: ProcedureType.THERAPY,
        estimatedFullCost: 100,
        planId: validPlanId,
        networkType: 'in-network',
        isRecurring: true,
        occurrences: 10,
      };

      const simulationResult = {
        procedureCode: 'THER-001',
        coveragePercentage: 60,
        coveredAmount: 60,
        outOfPocketAmount: 40,
        isRecurring: true,
        occurrences: 10,
        coverageAdjustments: { networkAdjustment: 0, facilityAdjustment: 0, recurringDiscount: 10 },
        simulatedAt: new Date().toISOString(),
      };

      mockCostSimulatorService.simulateCost.mockResolvedValue(simulationResult);

      const result = await controller.simulateCost(dto);

      expect(result).toEqual(simulationResult);
    });

    it('should handle preventive procedure with 100% coverage', async () => {
      const dto: SimulateCostDto = {
        procedureCode: 'PREV-001',
        procedureType: ProcedureType.PREVENTIVE,
        estimatedFullCost: 150,
        planId: validPlanId,
        networkType: 'in-network',
      };

      const simulationResult = {
        coveragePercentage: 100,
        coveredAmount: 150,
        outOfPocketAmount: 0,
      };

      mockCostSimulatorService.simulateCost.mockResolvedValue(simulationResult);

      const result = await controller.simulateCost(dto);

      expect(result.coveragePercentage).toBe(100);
      expect(result.outOfPocketAmount).toBe(0);
    });

    it('should propagate service errors to the caller', async () => {
      const dto: SimulateCostDto = {
        procedureCode: '99213',
        procedureType: ProcedureType.CONSULTATION,
        estimatedFullCost: 200,
        planId: validPlanId,
      };

      mockCostSimulatorService.simulateCost.mockRejectedValue(
        new Error('Failed to simulate procedure cost')
      );

      await expect(controller.simulateCost(dto)).rejects.toThrow('Failed to simulate procedure cost');
    });
  });
});
