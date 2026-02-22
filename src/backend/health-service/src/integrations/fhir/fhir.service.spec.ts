/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { FhirService } from './fhir.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';

describe('FhirService', () => {
  let service: FhirService;

  const mockFhirAdapter = {
    getPatientRecord: jest.fn(),
    getMedicalHistory: jest.fn(),
    searchObservations: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    setContext: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FhirService,
        {
          provide: 'FHIRAdapter',
          useValue: mockFhirAdapter,
        },
        {
          provide: 'LoggerService',
          useValue: mockLogger,
        },
        {
          provide: 'EventEmitter2',
          useValue: mockEventEmitter,
        },
      ],
    })
      .overrideProvider('FHIRAdapter')
      .useValue(mockFhirAdapter)
      .overrideProvider('LoggerService')
      .useValue(mockLogger)
      .overrideProvider('EventEmitter2')
      .useValue(mockEventEmitter)
      .compile();

    service = module.get<FhirService>(FhirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPatientRecord', () => {
    const patientId = 'patient-test-123';
    const requestingUserId = 'patient-test-123';

    const mockPatientRecord = {
      id: patientId,
      name: 'Test Patient',
      birthDate: '1990-01-01',
      gender: 'male',
    };

    it('should return patient record when patientId matches requestingUserId', async () => {
      mockFhirAdapter.getPatientRecord.mockResolvedValue(mockPatientRecord);

      const result = await service.getPatientRecord(patientId, requestingUserId);

      expect(result).toEqual(mockPatientRecord);
      expect(mockFhirAdapter.getPatientRecord).toHaveBeenCalledWith(patientId);
    });

    it('should throw ForbiddenException when patientId does not match requestingUserId', async () => {
      await expect(
        service.getPatientRecord(patientId, 'different-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should emit patient.record.retrieved event after retrieval', async () => {
      mockFhirAdapter.getPatientRecord.mockResolvedValue(mockPatientRecord);

      await service.getPatientRecord(patientId, requestingUserId);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'patient.record.retrieved',
        expect.objectContaining({
          patientId,
          data: mockPatientRecord,
          timestamp: expect.any(Date),
        }),
      );
    });

    it('should throw AppException when fhirAdapter.getPatientRecord fails', async () => {
      mockFhirAdapter.getPatientRecord.mockRejectedValue(
        new Error('FHIR server unavailable'),
      );

      await expect(
        service.getPatientRecord(patientId, requestingUserId),
      ).rejects.toThrow(AppException);
    });

    it('should re-throw AppException if adapter throws one', async () => {
      const originalException = new AppException(
        'Custom FHIR error',
        'EXTERNAL' as any,
        'HEALTH_004',
        {},
      );
      mockFhirAdapter.getPatientRecord.mockRejectedValue(originalException);

      await expect(
        service.getPatientRecord(patientId, requestingUserId),
      ).rejects.toThrow(AppException);
    });
  });

  describe('getMedicalHistory', () => {
    const patientId = 'patient-test-123';
    const requestingUserId = 'patient-test-123';

    const mockMedicalEvents = [
      { id: 'event-1', type: 'DIAGNOSIS', date: '2024-01-01' },
      { id: 'event-2', type: 'PROCEDURE', date: '2024-02-01' },
    ];

    it('should return medical history for authorized patient', async () => {
      mockFhirAdapter.getMedicalHistory.mockResolvedValue(mockMedicalEvents);

      const result = await service.getMedicalHistory(patientId, requestingUserId);

      expect(result).toEqual(mockMedicalEvents);
    });

    it('should throw ForbiddenException when user accesses another patient record', async () => {
      await expect(
        service.getMedicalHistory(patientId, 'unauthorized-user'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should emit medical.history.retrieved event with count', async () => {
      mockFhirAdapter.getMedicalHistory.mockResolvedValue(mockMedicalEvents);

      await service.getMedicalHistory(patientId, requestingUserId);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'medical.history.retrieved',
        expect.objectContaining({
          patientId,
          events: mockMedicalEvents,
          count: mockMedicalEvents.length,
        }),
      );
    });

    it('should throw AppException when fhirAdapter.getMedicalHistory fails', async () => {
      mockFhirAdapter.getMedicalHistory.mockRejectedValue(
        new Error('Service timeout'),
      );

      await expect(
        service.getMedicalHistory(patientId, requestingUserId),
      ).rejects.toThrow(AppException);
    });
  });

  describe('getHealthMetricsFromFhir', () => {
    const patientId = 'patient-test-123';
    const requestingUserId = 'patient-test-123';
    const metricType = 'HEART_RATE';

    it('should return empty array when no FHIR observations exist', async () => {
      const result = await service.getHealthMetricsFromFhir(
        patientId,
        metricType,
        requestingUserId,
      );

      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw ForbiddenException when unauthorized user requests metrics', async () => {
      await expect(
        service.getHealthMetricsFromFhir(patientId, metricType, 'unauthorized-user'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should emit health.metrics.retrieved event', async () => {
      await service.getHealthMetricsFromFhir(patientId, metricType, requestingUserId);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'health.metrics.retrieved',
        expect.objectContaining({
          patientId,
          metricType,
          count: expect.any(Number),
        }),
      );
    });

    it('should accept dateRange parameter', async () => {
      const dateRange = { start: '2024-01-01', end: '2024-01-31' };

      const result = await service.getHealthMetricsFromFhir(
        patientId,
        metricType,
        requestingUserId,
        dateRange,
      );

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
