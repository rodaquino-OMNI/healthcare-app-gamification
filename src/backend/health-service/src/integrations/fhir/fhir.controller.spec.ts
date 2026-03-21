/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { Test, TestingModule } from '@nestjs/testing';

import { FhirController } from './fhir.controller';
import { FhirService } from './fhir.service';

describe('FhirController', () => {
    let controller: FhirController;

    const mockFhirService = {
        getPatientRecord: jest.fn(),
        getMedicalHistory: jest.fn(),
        getHealthMetricsFromFhir: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [FhirController],
            providers: [
                {
                    provide: FhirService,
                    useValue: mockFhirService,
                },
            ],
        }).compile();

        controller = module.get<FhirController>(FhirController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getPatientRecord', () => {
        const patientId = 'patient-test-123';
        const mockReq = { user: { id: patientId } };

        const mockPatientRecord = {
            id: patientId,
            name: 'Test Patient',
            birthDate: '1990-01-01',
        };

        it('should call fhirService.getPatientRecord with patientId and userId', async () => {
            mockFhirService.getPatientRecord.mockResolvedValue(mockPatientRecord);

            const result = await controller.getPatientRecord(patientId, mockReq as any);

            expect(mockFhirService.getPatientRecord).toHaveBeenCalledWith(
                patientId,
                mockReq.user.id
            );
            expect(result).toEqual(mockPatientRecord);
        });

        it('should propagate errors from fhirService.getPatientRecord', async () => {
            mockFhirService.getPatientRecord.mockRejectedValue(new Error('Forbidden'));

            await expect(controller.getPatientRecord(patientId, mockReq as any)).rejects.toThrow(
                'Forbidden'
            );
        });
    });

    describe('getMedicalHistory', () => {
        const patientId = 'patient-test-123';
        const mockReq = { user: { id: patientId } };

        const mockHistory = [{ id: 'event-1', type: 'DIAGNOSIS', date: '2024-01-01' }];

        it('should call fhirService.getMedicalHistory with correct arguments', async () => {
            mockFhirService.getMedicalHistory.mockResolvedValue(mockHistory);

            const result = await controller.getMedicalHistory(patientId, mockReq as any);

            expect(mockFhirService.getMedicalHistory).toHaveBeenCalledWith(
                patientId,
                mockReq.user.id
            );
            expect(result).toEqual(mockHistory);
        });

        it('should propagate service errors', async () => {
            mockFhirService.getMedicalHistory.mockRejectedValue(new Error('FHIR error'));

            await expect(controller.getMedicalHistory(patientId, mockReq as any)).rejects.toThrow(
                'FHIR error'
            );
        });
    });

    describe('getHealthMetrics', () => {
        const patientId = 'patient-test-123';
        const metricType = 'HEART_RATE';
        const mockReq = { user: { id: patientId } };

        const mockMetrics = [{ type: 'HEART_RATE', value: 72, unit: 'bpm' }];

        it('should call fhirService.getHealthMetricsFromFhir with correct arguments', async () => {
            mockFhirService.getHealthMetricsFromFhir.mockResolvedValue(mockMetrics);

            const result = await controller.getHealthMetrics(patientId, metricType, mockReq as any);

            expect(mockFhirService.getHealthMetricsFromFhir).toHaveBeenCalledWith(
                patientId,
                metricType,
                mockReq.user.id
            );
            expect(result).toEqual(mockMetrics);
        });

        it('should return empty array when no metrics found', async () => {
            mockFhirService.getHealthMetricsFromFhir.mockResolvedValue([]);

            const result = await controller.getHealthMetrics(patientId, metricType, mockReq as any);

            expect(result).toEqual([]);
        });

        it('should propagate service errors', async () => {
            mockFhirService.getHealthMetricsFromFhir.mockRejectedValue(new Error('Access denied'));

            await expect(
                controller.getHealthMetrics(patientId, metricType, mockReq as any)
            ).rejects.toThrow('Access denied');
        });
    });
});
