/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SymptomCheckerService } from './symptom-checker.service';
import { CheckSymptomsDto } from './dto/check-symptoms.dto';

// Mock the shared logger and tracing so the service can be instantiated
const mockLoggerService = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const mockTracingService = {
  createSpan: jest.fn().mockImplementation((_name: string, fn: () => any) => fn()),
};

// Provide both import aliases used in the source file
jest.mock('../../shared/src/logging/logger.service', () => ({
  LoggerService: jest.fn(),
}));

jest.mock('../../shared/src/tracing/tracing.service', () => ({
  TracingService: jest.fn(),
}));

describe('SymptomCheckerService', () => {
  let service: SymptomCheckerService;
  let configService: ConfigService;

  const defaultSymptomCheckerConfig = {
    enabled: true,
    emergencySymptoms: 'chest_pain,severe_bleeding,loss_of_consciousness',
    provider: 'internal',
    externalApi: { url: 'https://api.symptom-checker.example.com' },
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'care.symptomsChecker') return defaultSymptomCheckerConfig;
      if (key === 'care.integrations.emergencyServices') return { emergencyNumber: '192' };
      return undefined;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SymptomCheckerService,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: 'LoggerService',
          useValue: mockLoggerService,
        },
        {
          provide: 'TracingService',
          useValue: mockTracingService,
        },
      ],
    })
      .overrideProvider(SymptomCheckerService)
      .useFactory({
        factory: () =>
          new SymptomCheckerService(
            mockConfigService as any,
            mockLoggerService as any,
            mockTracingService as any
          ),
      })
      .compile();

    service = module.get<SymptomCheckerService>(SymptomCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // checkSymptoms — emergency path
  // ----------------------------------------------------------------
  describe('checkSymptoms (emergency symptoms)', () => {
    it('should return emergency guidance when emergency symptom is present', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['chest_pain', 'shortness_of_breath'] };

      const result = await service.checkSymptoms(dto);

      expect(result.severity).toBe('high');
      expect(result.careOptions.emergency).toBe(true);
      expect(result.careOptions.appointmentRecommended).toBe(false);
      expect(result.careOptions.telemedicineRecommended).toBe(false);
    });

    it('should include emergency number in emergency guidance', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['loss_of_consciousness'] };

      const result = await service.checkSymptoms(dto);

      expect(result.emergencyNumber).toBe('192');
    });
  });

  // ----------------------------------------------------------------
  // checkSymptoms — internal analysis
  // ----------------------------------------------------------------
  describe('checkSymptoms (internal analysis)', () => {
    it('should return low severity for a single non-emergency symptom', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['headache'] };

      const result = await service.checkSymptoms(dto);

      expect(result.severity).toBe('low');
      expect(result.careOptions.emergency).toBe(false);
    });

    it('should recommend telemedicine for 3 or more non-emergency symptoms', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['cough', 'fatigue', 'sore_throat'] };

      const result = await service.checkSymptoms(dto);

      expect(result.careOptions.telemedicineRecommended).toBe(true);
    });

    it('should recommend appointment for 5 or more non-emergency symptoms', async () => {
      const dto: CheckSymptomsDto = {
        symptoms: ['cough', 'fatigue', 'sore_throat', 'runny_nose', 'body_aches'],
      };

      const result = await service.checkSymptoms(dto);

      expect(result.careOptions.appointmentRecommended).toBe(true);
    });

    it('should include possible conditions in internal analysis result', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['fever', 'cough'] };

      const result = await service.checkSymptoms(dto);

      expect(result.possibleConditions).toBeDefined();
      expect(Array.isArray(result.possibleConditions)).toBe(true);
      expect(result.possibleConditions!.length).toBeGreaterThan(0);
    });

    it('should always include guidance text in the response', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['nausea'] };

      const result = await service.checkSymptoms(dto);

      expect(result.guidance).toBeDefined();
      expect(typeof result.guidance).toBe('string');
      expect(result.guidance.length).toBeGreaterThan(0);
    });
  });

  // ----------------------------------------------------------------
  // checkSymptoms — disabled checker
  // ----------------------------------------------------------------
  describe('checkSymptoms (disabled)', () => {
    it('should throw AppException when symptom checker is disabled', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'care.symptomsChecker') {
          return { ...defaultSymptomCheckerConfig, enabled: false };
        }
        return undefined;
      });

      const dto: CheckSymptomsDto = { symptoms: ['headache'] };

      await expect(service.checkSymptoms(dto)).rejects.toThrow();
    });
  });

  // ----------------------------------------------------------------
  // checkSymptoms — fever + cough combination
  // ----------------------------------------------------------------
  describe('checkSymptoms (fever + cough combination)', () => {
    it('should recommend appointment for fever + cough + shortness_of_breath', async () => {
      const dto: CheckSymptomsDto = {
        symptoms: ['fever', 'cough', 'shortness_of_breath'],
      };

      const result = await service.checkSymptoms(dto);

      expect(result.careOptions.appointmentRecommended).toBe(true);
    });

    it('should identify Common Cold as possible condition for fever + cough', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['fever', 'cough'] };

      const result = await service.checkSymptoms(dto);

      const hasColdCondition = result.possibleConditions?.some(c => c.name === 'Common Cold');
      expect(hasColdCondition).toBe(true);
    });

    it('should identify Migraine for headache + sensitivity_to_light', async () => {
      const dto: CheckSymptomsDto = { symptoms: ['headache', 'sensitivity_to_light'] };

      const result = await service.checkSymptoms(dto);

      const hasMigraine = result.possibleConditions?.some(c => c.name === 'Migraine');
      expect(hasMigraine).toBe(true);
    });
  });
});
