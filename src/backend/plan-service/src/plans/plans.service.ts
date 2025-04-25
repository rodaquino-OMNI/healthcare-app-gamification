import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import planService from '../config/configuration';
import { Plan } from './entities/plan.entity';
import { Claim } from '../claims/entities/claim.entity';
import { Service } from 'src/backend/shared/src/interfaces/service.interface';
import { AppException, ErrorType } from 'src/backend/shared/src/exceptions/exceptions.types';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { TracingService } from 'src/backend/shared/src/tracing/tracing.service';
import { User } from 'src/backend/auth-service/src/users/entities/user.entity';
import { ErrorCodes } from 'src/backend/shared/src/constants/error-codes.constants';

/**
 * Handles the business logic for managing insurance plans.
 */
@Injectable()
export class PlansService {
  /**
   * Initializes the PlansService.
   * @param logger LoggerService for logging messages
   * @param tracingService TracingService for distributed tracing
   * @param plansRepository Repository for Plan entity operations
   */
  constructor(
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService,
    @InjectRepository(Plan) private readonly plansRepository: Repository<Plan>
  ) {
    this.logger.log('PlansService initialized', 'PlansService');
  }

  /**
   * Creates a new insurance plan.
   * @param plan Plan data to create
   * @returns The newly created plan
   */
  async create(plan: any): Promise<Plan> {
    return this.tracingService.createSpan('PlansService.create', async () => {
      this.logger.log(`Creating new plan`, 'PlansService');
      try {
        const newPlan = this.plansRepository.create(plan);
        return await this.plansRepository.save(newPlan);
      } catch (error) {
        this.logger.error(`Error creating plan: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          'Failed to create insurance plan',
          ErrorType.TECHNICAL,
          'PLAN_CREATE_ERROR',
          { originalError: error.message },
          error
        );
      }
    });
  }

  /**
   * Retrieves all insurance plans based on the provided filters and pagination.
   * @param pagination Pagination parameters
   * @param filter Filter criteria
   * @returns An array of insurance plans
   */
  async findAll(pagination: PaginationDto, filter?: FilterDto): Promise<Plan[]> {
    return this.tracingService.createSpan('PlansService.findAll', async () => {
      this.logger.log(`Retrieving all plans with pagination: ${JSON.stringify(pagination)} and filter: ${JSON.stringify(filter)}`, 'PlansService');
      
      try {
        // Build query based on filter
        let queryOptions: any = {};
        
        // Apply filters if provided
        if (filter?.where) {
          queryOptions.where = filter.where;
        }
        
        // Apply ordering if provided
        if (filter?.orderBy) {
          queryOptions.order = filter.orderBy;
        } else {
          // Default ordering
          queryOptions.order = { createdAt: 'DESC' };
        }
        
        // Apply pagination
        if (pagination) {
          const take = pagination.limit || 10;
          const skip = pagination.skip || (pagination.page ? (pagination.page - 1) * take : 0);
          
          queryOptions.take = take;
          queryOptions.skip = skip;
        }
        
        // Apply relations if needed
        if (filter?.include) {
          queryOptions.relations = Object.keys(filter.include).filter(
            key => filter.include[key] === true
          );
        }
        
        return await this.plansRepository.find(queryOptions);
      } catch (error) {
        this.logger.error(`Error retrieving plans: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          'Failed to retrieve insurance plans',
          ErrorType.TECHNICAL,
          'PLAN_QUERY_ERROR',
          { originalError: error.message },
          error
        );
      }
    });
  }

  /**
   * Retrieves a single insurance plan by its ID.
   * @param id Plan ID to find
   * @returns The insurance plan, or null if not found
   */
  async findOne(id: string): Promise<Plan> {
    return this.tracingService.createSpan('PlansService.findOne', async () => {
      this.logger.log(`Retrieving plan with ID: ${id}`, 'PlansService');
      
      try {
        const plan = await this.plansRepository.findOne({ where: { id } });
        
        if (!plan) {
          throw new AppException(
            `Plan with ID ${id} not found`,
            ErrorType.BUSINESS,
            'PLAN_NOT_FOUND',
            { planId: id }
          );
        }
        
        return plan;
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }
        
        this.logger.error(`Error retrieving plan ${id}: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          `Failed to retrieve insurance plan with ID ${id}`,
          ErrorType.TECHNICAL,
          'PLAN_QUERY_ERROR',
          { planId: id, originalError: error.message },
          error
        );
      }
    });
  }

  /**
   * Updates an existing insurance plan.
   * @param id Plan ID to update
   * @param plan Plan data to update
   * @returns The updated plan
   */
  async update(id: string, plan: any): Promise<Plan> {
    return this.tracingService.createSpan('PlansService.update', async () => {
      this.logger.log(`Updating plan with ID: ${id}`, 'PlansService');
      
      try {
        // Verify plan exists
        await this.findOne(id);
        
        // Update the plan
        await this.plansRepository.update(id, plan);
        
        // Return the updated plan
        return this.findOne(id);
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }
        
        this.logger.error(`Error updating plan ${id}: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          `Failed to update insurance plan with ID ${id}`,
          ErrorType.TECHNICAL,
          'PLAN_UPDATE_ERROR',
          { planId: id, originalError: error.message },
          error
        );
      }
    });
  }

  /**
   * Deletes an insurance plan by its ID.
   * @param id Plan ID to delete
   */
  async remove(id: string): Promise<void> {
    return this.tracingService.createSpan('PlansService.remove', async () => {
      this.logger.log(`Removing plan with ID: ${id}`, 'PlansService');
      
      try {
        // Verify plan exists
        await this.findOne(id);
        
        // Delete the plan
        await this.plansRepository.delete(id);
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }
        
        this.logger.error(`Error removing plan ${id}: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          `Failed to delete insurance plan with ID ${id}`,
          ErrorType.TECHNICAL,
          'PLAN_DELETE_ERROR',
          { planId: id, originalError: error.message },
          error
        );
      }
    });
  }

  /**
   * Verifies if a plan covers a specific procedure or service.
   * @param planId Plan ID to check
   * @param procedureCode Procedure code to verify coverage for
   * @returns Whether the procedure is covered by the plan
   */
  async verifyCoverage(planId: string, procedureCode: string): Promise<boolean> {
    return this.tracingService.createSpan('PlansService.verifyCoverage', async () => {
      this.logger.log(`Verifying coverage for plan ${planId} and procedure ${procedureCode}`, 'PlansService');
      
      try {
        const plan = await this.findOne(planId);
        
        // Check if the procedure is covered in the plan's coverage details
        const coverageDetails = plan.coverageDetails as any;
        
        if (!coverageDetails) {
          return false;
        }
        
        // Check direct procedure coverage
        if (coverageDetails.procedures && coverageDetails.procedures[procedureCode]) {
          return coverageDetails.procedures[procedureCode].covered === true;
        }
        
        // Check category coverage (if applicable)
        if (coverageDetails.categories) {
          // In a real implementation, you would map the procedure code to a category
          const category = procedureCode.substring(0, 3); // Example: extract category from code prefix
          
          if (coverageDetails.categories[category]) {
            return coverageDetails.categories[category].covered === true;
          }
        }
        
        return false;
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }
        
        this.logger.error(`Error verifying coverage for plan ${planId} and procedure ${procedureCode}: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          `Failed to verify coverage for procedure ${procedureCode}`,
          ErrorType.TECHNICAL,
          'PLAN_COVERAGE_VERIFICATION_FAILED',
          { planId, procedureCode, originalError: error.message },
          error
        );
      }
    });
  }

  /**
   * Calculates the coverage amount for a specific procedure under a plan.
   * @param planId Plan ID to calculate coverage for
   * @param procedureCode Procedure code to calculate coverage for
   * @param totalAmount Total amount to calculate coverage for
   * @returns Coverage calculation details
   */
  async calculateCoverage(
    planId: string, 
    procedureCode: string, 
    totalAmount: number
  ): Promise<{ covered: boolean; coverageAmount: number; copayAmount: number }> {
    return this.tracingService.createSpan('PlansService.calculateCoverage', async () => {
      this.logger.log(`Calculating coverage for plan ${planId}, procedure ${procedureCode}, amount ${totalAmount}`, 'PlansService');
      
      try {
        // Default result if coverage cannot be determined
        const defaultResult = { 
          covered: false, 
          coverageAmount: 0, 
          copayAmount: totalAmount 
        };
        
        const plan = await this.findOne(planId);
        const coverageDetails = plan.coverageDetails as any;
        
        // Check if plan has coverage details
        if (!coverageDetails) {
          return defaultResult;
        }
        
        // Extract coverage rules for the procedure
        let coveragePercentage = 0;
        let isCovered = false;
        
        // Check direct procedure coverage
        if (coverageDetails.procedures && coverageDetails.procedures[procedureCode]) {
          const procedureInfo = coverageDetails.procedures[procedureCode];
          isCovered = procedureInfo.covered === true;
          coveragePercentage = procedureInfo.percentage || 0;
        } 
        // Check category coverage
        else if (coverageDetails.categories) {
          // In a real implementation, you would map the procedure code to a category
          const category = procedureCode.substring(0, 3); // Example: extract category from code prefix
          
          if (coverageDetails.categories[category]) {
            isCovered = coverageDetails.categories[category].covered === true;
            coveragePercentage = coverageDetails.categories[category].percentage || 0;
          }
        }
        // Use default coverage settings based on procedure type
        else if (coverageDetails.defaults) {
          // Determine procedure type (consultation, exam, etc.)
          const procedureType = this.determineProcedureType(procedureCode);
          
          if (coverageDetails.defaults[procedureType]) {
            isCovered = true;
            coveragePercentage = coverageDetails.defaults[procedureType];
          }
        }
        
        // Calculate covered amount and copay
        if (isCovered) {
          const coverageAmount = (totalAmount * coveragePercentage) / 100;
          const copayAmount = totalAmount - coverageAmount;
          
          return {
            covered: true,
            coverageAmount,
            copayAmount
          };
        }
        
        return defaultResult;
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }
        
        this.logger.error(`Error calculating coverage for plan ${planId} and procedure ${procedureCode}: ${error.message}`, error.stack, 'PlansService');
        throw new AppException(
          `Failed to calculate coverage for procedure ${procedureCode}`,
          ErrorType.TECHNICAL,
          'PLAN_COVERAGE_VERIFICATION_FAILED',
          { planId, procedureCode, totalAmount, originalError: error.message },
          error
        );
      }
    });
  }
  
  /**
   * Helper method to determine procedure type from code
   * @private
   */
  private determineProcedureType(procedureCode: string): string {
    // This is a simplified implementation
    // In a real system, this would use a comprehensive mapping or external service
    const prefix = procedureCode.substring(0, 2);
    
    switch (prefix) {
      case 'CO':
        return 'consultations';
      case 'EX':
        return 'examinations';
      case 'PR':
        return 'procedures';
      case 'EM':
        return 'emergencies';
      default:
        return 'procedures'; // Default category
    }
  }
}