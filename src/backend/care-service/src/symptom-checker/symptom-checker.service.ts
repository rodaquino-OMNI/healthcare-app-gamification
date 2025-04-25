import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckSymptomsDto } from './dto/check-symptoms.dto';
import { AppException, ErrorType } from '../../shared/src/exceptions/exceptions.types';
import { LoggerService } from '../../shared/src/logging/logger.service';
import { TracingService } from '../../shared/src/tracing/tracing.service';
import { CARE_PROVIDER_UNAVAILABLE } from '../../shared/src/constants/error-codes.constants';

/**
 * Interface for symptom checker response
 */
interface SymptomCheckerResponse {
  severity: string;
  guidance: string;
  careOptions: {
    emergency: boolean;
    appointmentRecommended: boolean;
    telemedicineRecommended: boolean;
  };
  possibleConditions?: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
  emergencyNumber?: string;
  externalProviderName?: string;
}

/**
 * Service that provides symptom checking functionality.
 * Part of the Care Now journey, allowing users to input symptoms
 * and receive preliminary guidance.
 */
@Injectable()
export class SymptomCheckerService {
  /**
   * Initializes the SymptomCheckerService.
   * 
   * @param configService Configuration service for accessing application settings
   * @param logger Logger service for consistent logging
   * @param tracingService Tracing service for distributed tracing
   */
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
    private tracingService: TracingService
  ) {}

  /**
   * Checks the provided symptoms and returns preliminary guidance.
   * 
   * @param checkSymptomsDto DTO containing the symptoms to check
   * @returns Promise resolving to preliminary guidance based on the symptoms
   */
  async checkSymptoms(checkSymptomsDto: CheckSymptomsDto): Promise<SymptomCheckerResponse> {
    return this.tracingService.createSpan('symptom-checker.check-symptoms', async () => {
      this.logger.log(`Checking symptoms: ${JSON.stringify(checkSymptomsDto.symptoms)}`, 'SymptomCheckerService');
      
      try {
        // Get configuration for symptom checker
        const symptomsCheckerConfig = this.configService.get('care.symptomsChecker');
        
        // Check if the symptom checker is enabled
        if (!symptomsCheckerConfig.enabled) {
          throw new AppException(
            'Symptom checker is currently disabled',
            ErrorType.BUSINESS,
            CARE_PROVIDER_UNAVAILABLE
          );
        }
        
        // Check if any emergency symptoms are present
        const emergencySymptoms = symptomsCheckerConfig.emergencySymptoms.split(',');
        const hasEmergencySymptoms = checkSymptomsDto.symptoms.some(
          symptom => emergencySymptoms.includes(symptom)
        );
        
        if (hasEmergencySymptoms) {
          // Return emergency guidance
          const emergencyConfig = this.configService.get('care.integrations.emergencyServices');
          
          return {
            severity: 'high',
            guidance: 'Seek immediate medical attention or call emergency services.',
            emergencyNumber: emergencyConfig?.emergencyNumber || '192',
            careOptions: {
              emergency: true,
              appointmentRecommended: false,
              telemedicineRecommended: false
            }
          };
        }
        
        // Determine if we should use internal or external symptom checking
        if (symptomsCheckerConfig.provider === 'internal') {
          // Use internal rule-based symptom analysis
          return this.analyzeSymptoms(checkSymptomsDto.symptoms);
        } else {
          // Call external symptom checking API
          return this.callExternalSymptomAPI(checkSymptomsDto.symptoms, symptomsCheckerConfig.externalApi);
        }
      } catch (error) {
        this.logger.error(`Error checking symptoms: ${error.message}`, error.stack, 'SymptomCheckerService');
        
        if (error instanceof AppException) {
          throw error;
        }
        
        throw new AppException(
          'Failed to analyze symptoms',
          ErrorType.TECHNICAL,
          CARE_PROVIDER_UNAVAILABLE,
          { symptoms: checkSymptomsDto.symptoms },
          error
        );
      }
    });
  }
  
  /**
   * Analyzes symptoms using internal rule-based logic.
   * This is a simplified implementation for demonstration purposes.
   * In a production environment, this would use a more sophisticated symptom analysis algorithm.
   * 
   * @param symptoms Array of symptom identifiers
   * @returns Preliminary guidance based on symptoms
   * @private
   */
  private analyzeSymptoms(symptoms: string[]): SymptomCheckerResponse {
    // Basic severity determination based on symptom count and combinations
    let severity = 'low';
    let guidance = '';
    let appointmentRecommended = false;
    let telemedicineRecommended = false;
    
    // Simple severity determination based on number of symptoms
    if (symptoms.length >= 5) {
      severity = 'medium';
      appointmentRecommended = true;
    } else if (symptoms.length >= 3) {
      severity = 'medium';
      telemedicineRecommended = true;
    }
    
    // Look for specific combinations that might indicate common conditions
    if (symptoms.includes('fever') && symptoms.includes('cough')) {
      if (symptoms.includes('shortness_of_breath')) {
        severity = 'medium';
        appointmentRecommended = true;
      } else {
        telemedicineRecommended = true;
      }
    }
    
    if (symptoms.includes('headache') && symptoms.includes('fatigue')) {
      telemedicineRecommended = true;
    }
    
    // Provide guidance based on severity
    switch (severity) {
      case 'low':
        guidance = 'Your symptoms suggest a minor condition. Rest, stay hydrated, and monitor your symptoms.';
        break;
      case 'medium':
        guidance = 'Your symptoms may require medical attention. Consider scheduling a telemedicine consultation or in-person appointment.';
        break;
      default:
        guidance = 'Based on the information provided, we recommend consulting with a healthcare professional.';
    }
    
    return {
      severity,
      guidance,
      careOptions: {
        emergency: false,
        appointmentRecommended,
        telemedicineRecommended
      },
      possibleConditions: this.determinePossibleConditions(symptoms)
    };
  }
  
  /**
   * Determines possible conditions based on symptoms.
   * This is a simplified implementation for demonstration purposes.
   * 
   * @param symptoms Array of symptom identifiers
   * @returns Array of possible conditions with confidence levels
   * @private
   */
  private determinePossibleConditions(symptoms: string[]): Array<{
    name: string;
    confidence: number;
    description: string;
  }> {
    const conditions = [];
    
    // Simple pattern matching for common conditions
    if (symptoms.includes('fever') && symptoms.includes('cough')) {
      conditions.push({
        name: 'Common Cold',
        confidence: 0.7,
        description: 'A viral infection of the upper respiratory tract.'
      });
      
      if (symptoms.includes('body_aches') || symptoms.includes('fatigue')) {
        conditions.push({
          name: 'Influenza',
          confidence: 0.6,
          description: 'A viral infection that attacks your respiratory system.'
        });
      }
    }
    
    if (symptoms.includes('headache') && symptoms.includes('sensitivity_to_light')) {
      conditions.push({
        name: 'Migraine',
        confidence: 0.65,
        description: 'A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.'
      });
    }
    
    // Add a generic condition if none were identified
    if (conditions.length === 0) {
      conditions.push({
        name: 'Unspecified Condition',
        confidence: 0.3,
        description: 'Based on the provided symptoms, a specific condition could not be identified.'
      });
    }
    
    return conditions;
  }
  
  /**
   * Calls an external API for symptom analysis.
   * This is a placeholder implementation that would be replaced with actual API integration.
   * 
   * @param symptoms Array of symptom identifiers
   * @param apiConfig Configuration for the external API
   * @returns Promise resolving to the API response
   * @private
   */
  private async callExternalSymptomAPI(symptoms: string[], apiConfig: any): Promise<SymptomCheckerResponse> {
    try {
      this.logger.log(`Calling external symptom API: ${apiConfig.url}`, 'SymptomCheckerService');
      
      // In a real implementation, this would make an HTTP request to the external API
      // For demonstration purposes, we'll return a mock response
      return {
        severity: symptoms.length > 4 ? 'medium' : 'low',
        guidance: 'Analysis provided by external symptom checking service. Please consult with a healthcare professional for accurate diagnosis.',
        careOptions: {
          emergency: false,
          appointmentRecommended: symptoms.length > 3,
          telemedicineRecommended: true
        },
        externalProviderName: 'External Symptom Service'
      };
    } catch (error) {
      this.logger.error(`Error calling external symptom API: ${error.message}`, error.stack, 'SymptomCheckerService');
      throw new AppException(
        'Failed to connect to symptom analysis service',
        ErrorType.EXTERNAL,
        CARE_PROVIDER_UNAVAILABLE,
        { symptoms },
        error
      );
    }
  }
}