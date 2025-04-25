import { Injectable } from '@nestjs/common';
import { InsuranceService } from '../insurance/insurance.service';
import { PlansService } from '../plans/plans.service';
import { SimulateCostDto } from './dto/simulate-cost.dto';
import { AppException, ErrorType } from 'src/backend/shared/src/exceptions/exceptions.types';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { TracingService } from 'src/backend/shared/src/tracing/tracing.service';
import { VerifyCoverageDto } from '../insurance/dto/verify-coverage.dto';
import { Plan } from '../plans/entities/plan.entity';
import { Coverage } from '../plans/entities/coverage.entity';
import { ErrorCodes } from 'src/backend/shared/src/constants/error-codes.constants';

/**
 * Handles the business logic for simulating healthcare costs.
 */
@Injectable()
export class CostSimulatorService {
  /**
   * Initializes the CostSimulatorService.
   * @param insuranceService Inject InsuranceService for coverage verification.
   * @param plansService Inject PlansService for plan-related operations.
   * @param logger Inject LoggerService for logging.
   * @param tracingService Inject TracingService for tracing.
   */
  constructor(
    private insuranceService: InsuranceService,
    private plansService: PlansService,
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService,
  ) {
    this.logger.log('CostSimulatorService initialized', 'CostSimulatorService');
  }

  /**
   * Simulates the cost of a healthcare procedure for a given user and plan.
   * Implements requirement F-103-RQ-005 - Calculate estimated costs for procedures based on coverage.
   * 
   * @param simulateCostDto The DTO containing simulation request data
   * @returns The estimated cost of the procedure.
   */
  async simulateCost(simulateCostDto: SimulateCostDto): Promise<number> {
    return this.tracingService.createSpan('CostSimulatorService.simulateCost', async () => {
      this.logger.log(
        `Simulating cost for procedure ${simulateCostDto.procedureCode} with plan ${simulateCostDto.planId}`,
        'CostSimulatorService'
      );
      
      try {
        // Create a VerifyCoverageDto from the SimulateCostDto
        const verifyCoverageDto: VerifyCoverageDto = {
          procedureCode: simulateCostDto.procedureCode,
          procedureType: simulateCostDto.procedureType,
          planId: simulateCostDto.planId,
          providerId: simulateCostDto.providerId,
          isInNetwork: simulateCostDto.isInNetwork
        };
        
        // Verify coverage using the InsuranceService
        const isCovered = await this.insuranceService.verifyCoverage(verifyCoverageDto);
        
        if (!isCovered) {
          // If procedure is not covered, return the full cost
          this.logger.log(
            `Procedure ${simulateCostDto.procedureCode} is not covered by plan ${simulateCostDto.planId}. Full cost: ${simulateCostDto.estimatedFullCost}`,
            'CostSimulatorService'
          );
          return simulateCostDto.estimatedFullCost;
        }
        
        // Calculate the estimated cost based on coverage details
        const coverageDetails = await this.plansService.calculateCoverage(
          simulateCostDto.planId,
          simulateCostDto.procedureCode,
          simulateCostDto.estimatedFullCost
        );
        
        this.logger.log(
          `Procedure ${simulateCostDto.procedureCode} for plan ${simulateCostDto.planId} - Covered: ${coverageDetails.covered}, ` +
          `Coverage amount: ${coverageDetails.coverageAmount}, Copay amount: ${coverageDetails.copayAmount}`,
          'CostSimulatorService'
        );
        
        // Return the copay amount (out-of-pocket cost)
        return coverageDetails.copayAmount;
      } catch (error) {
        this.logger.error(
          `Error simulating cost for procedure ${simulateCostDto.procedureCode}: ${error.message}`,
          error.stack,
          'CostSimulatorService'
        );
        
        if (error instanceof AppException) {
          throw error;
        }
        
        throw new AppException(
          'Failed to simulate procedure cost',
          ErrorType.TECHNICAL,
          'PLAN_COVERAGE_VERIFICATION_FAILED',
          { dto: simulateCostDto, error: error.message },
          error
        );
      }
    });
  }
}