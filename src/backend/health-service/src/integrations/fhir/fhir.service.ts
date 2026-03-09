/* eslint-disable */
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';

import { FHIRAdapter } from '@app/health/integrations/fhir/fhir.adapter';

interface FhirObservation {
    valueQuantity?: { value?: number; unit?: string };
    effectiveDateTime?: string;
    note?: Array<{ text?: string }>;
}

/**
 * Handles the retrieval of patient data from FHIR-compliant systems
 * and emits events when new data is available.
 */
@Injectable()
export class FhirService {
    /**
     * Initializes the FhirService.
     *
     * @param fhirAdapter - The adapter for communicating with FHIR-compliant systems
     * @param logger - Logger service for consistent logging
     * @param eventEmitter - Event emitter for publishing data retrieval events
     */
    constructor(
        private readonly fhirAdapter: FHIRAdapter,
        private readonly logger: LoggerService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    /**
     * Retrieves a patient record from a FHIR-compliant system.
     *
     * @param patientId - The unique identifier of the patient
     * @param requestingUserId - The ID of the user making the request
     * @returns A promise that resolves to the patient record
     */
    async getPatientRecord(patientId: string, requestingUserId: string): Promise<unknown> {
        if (patientId !== requestingUserId) {
            throw new ForbiddenException("Access denied: cannot access another patient's records");
        }

        this.logger.log(`Retrieving patient record for patient ID: ${patientId}`, 'FhirService');

        try {
            const patientRecord = await this.fhirAdapter.getPatientRecord(patientId);

            this.eventEmitter.emit('patient.record.retrieved', {
                patientId,
                data: patientRecord,
                timestamp: new Date(),
            });

            return patientRecord;
        } catch (error) {
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Failed to retrieve patient record for patient ID: ${patientId}`, stack, 'FhirService');

            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(
                'Failed to retrieve patient record',
                ErrorType.EXTERNAL,
                'HEALTH_004',
                { patientId, error: (error as Error).message },
                HttpStatus.BAD_GATEWAY
            );
        }
    }

    /**
     * Retrieves a patient's medical history from a FHIR-compliant system.
     *
     * @param patientId - The unique identifier of the patient
     * @param requestingUserId - The ID of the user making the request
     * @returns A promise that resolves to an array of medical events
     */
    async getMedicalHistory(patientId: string, requestingUserId: string): Promise<unknown[]> {
        if (patientId !== requestingUserId) {
            throw new ForbiddenException("Access denied: cannot access another patient's records");
        }

        this.logger.log(`Retrieving medical history for patient ID: ${patientId}`, 'FhirService');

        try {
            const medicalEvents = await this.fhirAdapter.getMedicalHistory(patientId);

            this.eventEmitter.emit('medical.history.retrieved', {
                patientId,
                events: medicalEvents,
                count: (medicalEvents as unknown[]).length,
                timestamp: new Date(),
            });

            return medicalEvents as unknown[];
        } catch (error) {
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Failed to retrieve medical history for patient ID: ${patientId}`, stack, 'FhirService');

            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(
                'Failed to retrieve medical history',
                ErrorType.EXTERNAL,
                'HEALTH_005',
                { patientId, error: (error as Error).message },
                HttpStatus.BAD_GATEWAY
            );
        }
    }

    /**
     * Retrieves health metrics from a FHIR-compliant system.
     *
     * @param patientId - The unique identifier of the patient
     * @param metricType - The type of health metric to retrieve
     * @param requestingUserId - The ID of the user making the request
     * @param dateRange - Optional date range to filter metrics
     * @returns A promise that resolves to an array of health metrics
     */
    getHealthMetricsFromFhir(
        patientId: string,
        metricType: string,
        requestingUserId: string,
        dateRange?: object
    ): unknown[] {
        if (patientId !== requestingUserId) {
            throw new ForbiddenException("Access denied: cannot access another patient's records");
        }

        this.logger.log(`Retrieving health metrics of type ${metricType} for patient ID: ${patientId}`, 'FhirService');

        try {
            // Construct the appropriate FHIR query based on metricType and dateRange
            const _query = {
                patient: patientId,
                code: this.mapMetricTypeToFhirCode(metricType),
                ...(dateRange ? { date: dateRange } : {}),
            };

            // Placeholder for actual implementation
            const observations: FhirObservation[] = [];

            const metrics = observations.map((obs) => this.transformObservationToMetric(obs, patientId, metricType));

            this.eventEmitter.emit('health.metrics.retrieved', {
                patientId,
                metricType,
                metrics,
                count: metrics.length,
                timestamp: new Date(),
            });

            return metrics;
        } catch (error) {
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to retrieve health metrics of type ${metricType} for patient ID: ${patientId}`,
                stack,
                'FhirService'
            );

            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(
                'Failed to retrieve health metrics',
                ErrorType.EXTERNAL,
                'HEALTH_006',
                { patientId, metricType, error: (error as Error).message },
                HttpStatus.BAD_GATEWAY
            );
        }
    }

    /**
     * Maps an internal metric type to a FHIR code.
     *
     * @param metricType - The internal metric type
     * @returns The corresponding FHIR code
     */
    private mapMetricTypeToFhirCode(metricType: string): string {
        const codeMap: Record<string, string> = {
            HEART_RATE: '8867-4',
            BLOOD_PRESSURE: '85354-9',
            BLOOD_GLUCOSE: '2339-0',
            WEIGHT: '29463-7',
            HEIGHT: '8302-2',
            STEPS: '41950-7',
            TEMPERATURE: '8310-5',
        };

        return codeMap[metricType] || metricType;
    }

    /**
     * Transforms a FHIR observation to an internal metric.
     *
     * @param observation - The FHIR observation
     * @param patientId - The patient identifier
     * @param metricType - The metric type
     * @returns The transformed metric
     */
    private transformObservationToMetric(
        observation: FhirObservation,
        patientId: string,
        metricType: string
    ): Record<string, unknown> {
        return {
            userId: patientId,
            type: metricType,
            value: observation.valueQuantity?.value ?? 0,
            unit: observation.valueQuantity?.unit ?? '',
            timestamp: new Date(observation.effectiveDateTime ?? new Date()),
            source: 'FHIR',
            notes: observation.note?.map((n) => n.text ?? '').join('\n') ?? null,
            isAbnormal: false,
        };
    }
}
