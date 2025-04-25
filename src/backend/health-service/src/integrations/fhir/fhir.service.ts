import { Injectable } from '@nestjs/common'; // NestJS Common 9.0.0+
import { EventEmitter2 } from 'eventemitter2'; // EventEmitter2 6.4.0+

import { Configuration } from 'src/backend/health-service/src/config/configuration';
import { HealthMetric } from 'src/backend/health-service/src/health/entities/health-metric.entity';
import { MedicalEvent } from 'src/backend/health-service/src/health/entities/medical-event.entity';
import { Service } from 'src/backend/shared/src/interfaces/service.interface';
import { AppException, ErrorType } from 'src/backend/shared/src/exceptions/exceptions.types';
import { FHIRAdapter } from 'src/backend/health-service/src/integrations/fhir/fhir.adapter';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';

/**
 * Handles the retrieval of patient data from FHIR-compliant systems and emits events when new data is available.
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
   * @returns A promise that resolves to the patient record
   */
  async getPatientRecord(patientId: string): Promise<any> {
    // Log the retrieval attempt
    this.logger.log(`Retrieving patient record for patient ID: ${patientId}`, 'FhirService');
    
    try {
      // Call the FHIR adapter to retrieve the patient record
      const patientRecord = await this.fhirAdapter.getPatientRecord(patientId);
      
      // Emit a 'patient.record.retrieved' event with the patient data
      this.eventEmitter.emit('patient.record.retrieved', {
        patientId,
        data: patientRecord,
        timestamp: new Date()
      });
      
      // Return the patient record
      return patientRecord;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve patient record for patient ID: ${patientId}`,
        error.stack,
        'FhirService'
      );
      
      if (error instanceof AppException) {
        throw error;
      }
      
      throw new AppException(
        'Failed to retrieve patient record',
        ErrorType.EXTERNAL,
        'HEALTH_004',
        { patientId },
        error
      );
    }
  }

  /**
   * Retrieves a patient's medical history from a FHIR-compliant system.
   * 
   * @param patientId - The unique identifier of the patient
   * @returns A promise that resolves to an array of medical events
   */
  async getMedicalHistory(patientId: string): Promise<any[]> {
    // Log the medical history retrieval attempt
    this.logger.log(`Retrieving medical history for patient ID: ${patientId}`, 'FhirService');
    
    try {
      // Call the FHIR adapter to retrieve the medical history
      const medicalEvents = await this.fhirAdapter.getMedicalHistory(patientId);
      
      // Emit a 'medical.history.retrieved' event with the medical events
      this.eventEmitter.emit('medical.history.retrieved', {
        patientId,
        events: medicalEvents,
        count: medicalEvents.length,
        timestamp: new Date()
      });
      
      // Return the array of medical events
      return medicalEvents;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve medical history for patient ID: ${patientId}`,
        error.stack,
        'FhirService'
      );
      
      if (error instanceof AppException) {
        throw error;
      }
      
      throw new AppException(
        'Failed to retrieve medical history',
        ErrorType.EXTERNAL,
        'HEALTH_005',
        { patientId },
        error
      );
    }
  }

  /**
   * Retrieves health metrics from a FHIR-compliant system.
   * 
   * @param patientId - The unique identifier of the patient
   * @param metricType - The type of health metric to retrieve
   * @param dateRange - Optional date range to filter metrics
   * @returns A promise that resolves to an array of health metrics
   */
  async getHealthMetricsFromFhir(
    patientId: string,
    metricType: string,
    dateRange?: object
  ): Promise<any[]> {
    // Log the health metrics retrieval attempt
    this.logger.log(
      `Retrieving health metrics of type ${metricType} for patient ID: ${patientId}`,
      'FhirService'
    );
    
    try {
      // Construct the appropriate FHIR query based on metricType and dateRange
      const query = {
        patient: patientId,
        code: this.mapMetricTypeToFhirCode(metricType),
        // Add date range parameters if provided
        ...(dateRange ? { date: dateRange } : {})
      };
      
      // Call the FHIR adapter to retrieve the health metrics
      // Note: In a real implementation, this would call an appropriate method on the adapter
      // or use a generic search method to retrieve FHIR Observation resources
      const observations: any[] = []; // Placeholder for actual implementation
      
      // Transform the FHIR observations into the internal HealthMetric format
      const metrics = observations.map(obs => this.transformObservationToMetric(obs, patientId, metricType));
      
      // Emit a 'health.metrics.retrieved' event with the health metrics
      this.eventEmitter.emit('health.metrics.retrieved', {
        patientId,
        metricType,
        metrics,
        count: metrics.length,
        timestamp: new Date()
      });
      
      // Return the array of health metrics
      return metrics;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve health metrics of type ${metricType} for patient ID: ${patientId}`,
        error.stack,
        'FhirService'
      );
      
      if (error instanceof AppException) {
        throw error;
      }
      
      throw new AppException(
        'Failed to retrieve health metrics',
        ErrorType.EXTERNAL,
        'HEALTH_006',
        { patientId, metricType },
        error
      );
    }
  }
  
  /**
   * Maps an internal metric type to a FHIR code.
   * 
   * @param metricType - The internal metric type
   * @returns The corresponding FHIR code
   * @private
   */
  private mapMetricTypeToFhirCode(metricType: string): string {
    // This is a simplified mapping, a real implementation would be more comprehensive
    const codeMap: Record<string, string> = {
      'HEART_RATE': '8867-4', // LOINC code for heart rate
      'BLOOD_PRESSURE': '85354-9', // LOINC code for blood pressure panel
      'BLOOD_GLUCOSE': '2339-0', // LOINC code for glucose
      'WEIGHT': '29463-7', // LOINC code for body weight
      'HEIGHT': '8302-2', // LOINC code for body height
      'STEPS': '41950-7', // LOINC code for number of steps in 24 hour measured
      'TEMPERATURE': '8310-5' // LOINC code for body temperature
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
   * @private
   */
  private transformObservationToMetric(observation: any, patientId: string, metricType: string): any {
    // This is a placeholder transformation function
    // In a real implementation, this would extract relevant data from the FHIR observation
    // and map it to the internal HealthMetric format
    
    return {
      userId: patientId,
      type: metricType,
      value: observation.valueQuantity?.value || 0,
      unit: observation.valueQuantity?.unit || '',
      timestamp: new Date(observation.effectiveDateTime || new Date()),
      source: 'FHIR',
      notes: observation.note?.map((n: any) => n.text).join('\n') || null,
      isAbnormal: false
    };
  }
}