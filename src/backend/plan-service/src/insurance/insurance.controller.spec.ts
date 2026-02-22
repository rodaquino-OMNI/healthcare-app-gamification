import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from '../insurance/insurance.service';
import { ProcedureType, VerifyCoverageDto } from './dto/verify-coverage.dto';

const mockInsuranceService = {
  verifyCoverage: jest.fn(),
};

describe('InsuranceController', () => {
  let controller: InsuranceController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceController],
      providers: [
        { provide: InsuranceService, useValue: mockInsuranceService },
      ],
    }).compile();

    controller = module.get<InsuranceController>(InsuranceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyCoverage (GET /insurance/coverage)', () => {
    it('should return true when procedure is covered', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'CON-001',
        procedureType: ProcedureType.CONSULTATION,
        planId: 'test-plan-id',
      };

      mockInsuranceService.verifyCoverage.mockResolvedValue(true);

      const result = await controller.verifyCoverage(dto);

      expect(result).toBe(true);
      expect(mockInsuranceService.verifyCoverage).toHaveBeenCalledWith(dto);
    });

    it('should return false when procedure is not covered', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'THER-001',
        procedureType: ProcedureType.THERAPY,
        planId: 'test-plan-id',
        isInNetwork: false,
      };

      mockInsuranceService.verifyCoverage.mockResolvedValue(false);

      const result = await controller.verifyCoverage(dto);

      expect(result).toBe(false);
    });

    it('should pass the full DTO to the service', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'EX-001',
        procedureType: ProcedureType.EXAM,
        planId: 'test-plan-id',
        providerId: 'test-provider-id',
        isInNetwork: true,
        description: 'Blood test',
      };

      mockInsuranceService.verifyCoverage.mockResolvedValue(true);

      await controller.verifyCoverage(dto);

      expect(mockInsuranceService.verifyCoverage).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors to the caller', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'SUR-001',
        procedureType: ProcedureType.SURGERY,
        planId: 'test-plan-id',
      };

      mockInsuranceService.verifyCoverage.mockRejectedValue(new Error('Coverage verification failed'));

      await expect(controller.verifyCoverage(dto)).rejects.toThrow('Coverage verification failed');
    });

    it('should handle emergency procedure type', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'EM-001',
        procedureType: ProcedureType.EMERGENCY,
        planId: 'test-plan-id',
      };

      mockInsuranceService.verifyCoverage.mockResolvedValue(true);

      const result = await controller.verifyCoverage(dto);

      expect(result).toBe(true);
    });
  });
});
