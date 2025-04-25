import { Injectable, NotFoundException } from '@nestjs/common';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { Service } from '../../../shared/src/interfaces/service.interface';
import { FilterDto } from '../../../shared/src/dto/filter.dto';
import { PaginationDto } from '../../../shared/src/dto/pagination.dto';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { TracingService } from '../../../shared/src/tracing/tracing.service';
import { PrismaService } from '../../../shared/src/database/prisma.service';
import { CARE_TREATMENT_PLAN_NOT_FOUND } from '../../../shared/src/constants/error-codes.constants';
import { Prisma } from '@prisma/client';
import { CurrentUser } from '../../../auth-service/src/auth/decorators/current-user.decorator';

/**
 * Provides the core business logic for managing treatment plans.
 * Handles CRUD operations for treatment plans in the Care Journey.
 */
@Injectable()
export class TreatmentsService {
  /**
   * Initializes the TreatmentsService with required dependencies.
   * 
   * @param prisma - Service for database operations
   * @param logger - Service for logging
   * @param tracing - Service for request tracing
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly tracing: TracingService
  ) {}

  /**
   * Creates a new treatment plan.
   * 
   * @param createTreatmentDto - Data for creating the treatment plan
   * @returns A promise resolving to the newly created treatment plan
   */
  async create(createTreatmentDto: any): Promise<TreatmentPlan> {
    return this.tracing.createSpan('treatments.create', async () => {
      this.logger.log('Creating new treatment plan', 'TreatmentsService');
      
      try {
        // Create the treatment plan using Prisma
        const treatmentPlan = await this.prisma.treatmentPlan.create({
          data: {
            name: createTreatmentDto.name,
            description: createTreatmentDto.description,
            startDate: createTreatmentDto.startDate,
            endDate: createTreatmentDto.endDate,
            progress: createTreatmentDto.progress || 0,
            careActivity: {
              connect: { id: createTreatmentDto.careActivityId }
            }
          }
        });
        
        return treatmentPlan as unknown as TreatmentPlan;
      } catch (error) {
        this.logger.error(`Failed to create treatment plan: ${error.message}`, error.stack, 'TreatmentsService');
        throw error;
      }
    });
  }

  /**
   * Retrieves all treatment plans based on the filter and pagination parameters.
   * 
   * @param filter - Filter criteria for the query
   * @param pagination - Pagination parameters
   * @returns A promise resolving to a list of treatment plans
   */
  async findAll(filter: FilterDto, pagination: PaginationDto): Promise<TreatmentPlan[]> {
    return this.tracing.createSpan('treatments.findAll', async () => {
      this.logger.log('Retrieving treatment plans with filter and pagination', 'TreatmentsService');
      
      try {
        // Calculate skip value from pagination parameters
        const skip = pagination?.skip || 
          (pagination?.page && pagination?.limit ? (pagination.page - 1) * pagination.limit : undefined);
        
        // Get treatment plans with filtering and pagination
        const treatmentPlans = await this.prisma.treatmentPlan.findMany({
          where: filter?.where,
          orderBy: filter?.orderBy,
          include: filter?.include,
          select: filter?.select,
          skip,
          take: pagination?.limit
        });
        
        return treatmentPlans as unknown as TreatmentPlan[];
      } catch (error) {
        this.logger.error(`Failed to retrieve treatment plans: ${error.message}`, error.stack, 'TreatmentsService');
        throw error;
      }
    });
  }

  /**
   * Retrieves a treatment plan by its ID.
   * 
   * @param id - The ID of the treatment plan to retrieve
   * @returns A promise resolving to the treatment plan, if found
   * @throws NotFoundException if the treatment plan is not found
   */
  async findOne(id: string): Promise<TreatmentPlan> {
    return this.tracing.createSpan('treatments.findOne', async () => {
      this.logger.log(`Retrieving treatment plan with ID: ${id}`, 'TreatmentsService');
      
      try {
        // Find the treatment plan by ID
        const treatmentPlan = await this.prisma.treatmentPlan.findUnique({
          where: { id },
          include: { careActivity: true }
        });
        
        // Throw an exception if the treatment plan is not found
        if (!treatmentPlan) {
          const error = new AppException(
            `Treatment plan with ID ${id} not found`,
            'business' as any,
            CARE_TREATMENT_PLAN_NOT_FOUND
          );
          throw error.toHttpException();
        }
        
        return treatmentPlan as unknown as TreatmentPlan;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        
        this.logger.error(`Failed to retrieve treatment plan: ${error.message}`, error.stack, 'TreatmentsService');
        throw error;
      }
    });
  }

  /**
   * Updates an existing treatment plan.
   * 
   * @param id - The ID of the treatment plan to update
   * @param updateTreatmentDto - The data to update the treatment plan with
   * @returns A promise resolving to the updated treatment plan
   * @throws NotFoundException if the treatment plan is not found
   */
  async update(id: string, updateTreatmentDto: any): Promise<TreatmentPlan> {
    return this.tracing.createSpan('treatments.update', async () => {
      this.logger.log(`Updating treatment plan with ID: ${id}`, 'TreatmentsService');
      
      try {
        // Prepare the data for update
        const data: any = {};
        if (updateTreatmentDto.name !== undefined) data.name = updateTreatmentDto.name;
        if (updateTreatmentDto.description !== undefined) data.description = updateTreatmentDto.description;
        if (updateTreatmentDto.startDate !== undefined) data.startDate = updateTreatmentDto.startDate;
        if (updateTreatmentDto.endDate !== undefined) data.endDate = updateTreatmentDto.endDate;
        if (updateTreatmentDto.progress !== undefined) data.progress = updateTreatmentDto.progress;
        
        // Update the treatment plan
        const treatmentPlan = await this.prisma.treatmentPlan.update({
          where: { id },
          data,
          include: { careActivity: true }
        });
        
        return treatmentPlan as unknown as TreatmentPlan;
      } catch (error) {
        // Handle Prisma's "not found" error
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          const notFoundError = new AppException(
            `Treatment plan with ID ${id} not found`,
            'business' as any,
            CARE_TREATMENT_PLAN_NOT_FOUND
          );
          throw notFoundError.toHttpException();
        }
        
        this.logger.error(`Failed to update treatment plan: ${error.message}`, error.stack, 'TreatmentsService');
        throw error;
      }
    });
  }

  /**
   * Deletes a treatment plan by its ID.
   * 
   * @param id - The ID of the treatment plan to delete
   * @returns A promise resolving to the deleted treatment plan
   * @throws NotFoundException if the treatment plan is not found
   */
  async remove(id: string): Promise<TreatmentPlan> {
    return this.tracing.createSpan('treatments.remove', async () => {
      this.logger.log(`Removing treatment plan with ID: ${id}`, 'TreatmentsService');
      
      try {
        // Delete the treatment plan
        const treatmentPlan = await this.prisma.treatmentPlan.delete({
          where: { id },
          include: { careActivity: true }
        });
        
        return treatmentPlan as unknown as TreatmentPlan;
      } catch (error) {
        // Handle Prisma's "not found" error
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          const notFoundError = new AppException(
            `Treatment plan with ID ${id} not found`,
            'business' as any,
            CARE_TREATMENT_PLAN_NOT_FOUND
          );
          throw notFoundError.toHttpException();
        }
        
        this.logger.error(`Failed to delete treatment plan: ${error.message}`, error.stack, 'TreatmentsService');
        throw error;
      }
    });
  }
}