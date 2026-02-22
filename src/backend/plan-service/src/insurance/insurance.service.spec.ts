import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceService } from './insurance.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { ProcedureType, VerifyCoverageDto } from './dto/verify-coverage.dto';
import { AppException } from '@app/shared/exceptions/exceptions.types';

const mockLoggerService = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const mockTracingService = {
  createSpan: jest.fn().mockImplementation((_name, fn) => fn()),
};

describe('InsuranceService', () => {
  let service: InsuranceService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsuranceService,
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: TracingService, useValue: mockTracingService },
      ],
    }).compile();

    service = module.get<InsuranceService>(InsuranceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyCoverage', () => {
    it('should return true for CONSULTATION procedure type', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'CON-001',
        procedureType: ProcedureType.CONSULTATION,
        planId: 'test-plan-id',
      };

      const result = await service.verifyCoverage(dto);

      expect(result).toBe(true);
    });

    it('should return true for EXAM procedure type', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'EX-001',
        procedureType: ProcedureType.EXAM,
        planId: 'test-plan-id',
      };

      const result = await service.verifyCoverage(dto);

      expect(result).toBe(true);
    });

    it('should return true for PREVENTIVE procedure type', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'PREV-001',
        procedureType: ProcedureType.PREVENTIVE,
        planId: 'test-plan-id',
      };

      const result = await service.verifyCoverage(dto);

      expect(result).toBe(true);
    });

    it('should return true for EMERGENCY procedure type', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'EM-001',
        procedureType: ProcedureType.EMERGENCY,
        planId: 'test-plan-id',
      };

      const result = await service.verifyCoverage(dto);

      expect(result).toBe(true);
    });

    it('should return true for in-network THERAPY procedure', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'THER-001',
        procedureType: ProcedureType.THERAPY,
        planId: 'test-plan-id',
        isInNetwork: true,
      };

      const result = await service.verifyCoverage(dto);

      expect(result).toBe(true);
    });

    it('should return false for out-of-network THERAPY procedure', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'THER-001',
        procedureType: ProcedureType.THERAPY,
        planId: 'test-plan-id',
        isInNetwork: false,
      };

      const result = await service.verifyCoverage(dto);

      expect(result).toBe(false);
    });

    it('should log coverage verification result', async () => {
      const dto: VerifyCoverageDto = {
        procedureCode: 'CON-001',
        procedureType: ProcedureType.CONSULTATION,
        planId: 'test-plan-id',
      };

      await service.verifyCoverage(dto);

      expect(mockLoggerService.log).toHaveBeenCalled();
    });

    it('should throw AppException when tracing span throws an unexpected error', async () => {
      mockTracingService.createSpan.mockImplementationOnce(() => {
        throw new Error('Unexpected tracing error');
      });

      const dto: VerifyCoverageDto = {
        procedureCode: 'CON-001',
        procedureType: ProcedureType.CONSULTATION,
        planId: 'test-plan-id',
      };

      await expect(service.verifyCoverage(dto)).rejects.toThrow();

      mockTracingService.createSpan.mockImplementation((_name, fn) => fn());
    });
  });
});
