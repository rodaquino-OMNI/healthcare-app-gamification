/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common'; // @nestjs/common 10.0.0+
import planService from '../config/configuration';
import { PlansService } from '../plans/plans.service';
import { Service } from '@app/shared/interfaces/service.interface';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { VerifyCoverageDto, ProcedureType } from './dto/verify-coverage.dto';
import { Plan } from '../plans/entities/plan.entity';
import { Coverage } from '../plans/entities/coverage.entity';
import * as ErrorCodes from '@app/shared/constants/error-codes.constants';

/**
 * Handles the business logic for interacting with insurance systems.
 * This service is responsible for verifying insurance coverage, processing claims,
 * and retrieving plan details for the My Plan & Benefits journey.
 */
@Injectable()
export class InsuranceService {
  /**
   * Initializes the InsuranceService.
   * @param logger LoggerService for logging messages
   * @param tracingService TracingService for distributed tracing
   */
  constructor(
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService,
  ) {
    this.logger.log('InsuranceService initialized', 'InsuranceService');
  }
  
  /**
   * Verifies if a procedure is covered by the user's insurance plan.
   * Implements requirement F-103-RQ-001 - Display detailed insurance coverage information.
   * 
   * @param verifyCoverageDto The DTO containing verification request data
   * @returns A boolean indicating whether the procedure is covered
   */
  async verifyCoverage(verifyCoverageDto: VerifyCoverageDto): Promise<boolean> {
    return this.tracingService.createSpan('InsuranceService.verifyCoverage', async () => {
      this.logger.log(
        `Verifying coverage for procedure ${verifyCoverageDto.procedureCode} with plan ${verifyCoverageDto.planId}`,
        'InsuranceService'
      );
      
      try {
        // In a real implementation, this would make a call to an external insurance API
        // based on the configuration in planService.insuranceApi
        const config = planService();
        
        // Simulate coverage verification with some logic based on procedure type
        // In production, this would call the actual insurance API
        let isCovered = false;
        
        switch (verifyCoverageDto.procedureType) {
          case ProcedureType.CONSULTATION:
          case ProcedureType.EXAM:
          case ProcedureType.PREVENTIVE:
            isCovered = true;
            break;
          case ProcedureType.THERAPY:
            // Ensure isInNetwork exists on the DTO or provide a default value
            isCovered = verifyCoverageDto.isInNetwork !== false;
            break;
          case ProcedureType.SURGERY:
            // For demonstration, surgeries have 70% chance of coverage
            isCovered = Math.random() > 0.3;
            break;
          case ProcedureType.MEDICATION:
            // Medications have 60% chance of coverage
            isCovered = Math.random() > 0.4;
            break;
          case ProcedureType.EMERGENCY:
            // Emergency procedures are always covered
            isCovered = true;
            break;
          default:
            // Other procedures have 40% chance of coverage
            isCovered = Math.random() > 0.6;
        }
        
        this.logger.log(
          `Coverage verification result for procedure ${verifyCoverageDto.procedureCode}: ${isCovered ? 'Covered' : 'Not covered'}`,
          'InsuranceService'
        );
        
        return isCovered;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? (error as any).message : 'Unknown error';
        const errorStack = error instanceof Error ? (error as any).stack : undefined;
        
        this.logger.error(`Error verifying coverage: ${errorMessage}`, errorStack, 'InsuranceService');
        
        throw new AppException(
          'Failed to verify insurance coverage',
          ErrorType.EXTERNAL,
          'PLAN_COVERAGE_VERIFICATION_FAILED',
          { dto: verifyCoverageDto, error: errorMessage },
          (error instanceof Error ? error : new Error(errorMessage)) as any
        );
      }
    });
  }
}