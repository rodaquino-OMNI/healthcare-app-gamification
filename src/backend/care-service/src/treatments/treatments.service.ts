import { CARE_TREATMENT_PLAN_NOT_FOUND } from '@app/shared/constants/error-codes.constants';
import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { ErrorType } from '@app/shared/exceptions/error.types';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { TreatmentPlan } from './entities/treatment-plan.entity';

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
     * @param userId - ID of the user creating the treatment plan
     * @param createTreatmentDto - Data for creating the treatment plan
     * @returns A promise resolving to the newly created treatment plan
     */
    async create(
        userId: string,
        createTreatmentDto: CreateTreatmentPlanDto
    ): Promise<TreatmentPlan> {
        return this.tracing.createSpan('treatments.create', async () => {
            this.logger.log(`Creating new treatment plan for user ${userId}`, 'TreatmentsService');

            try {
                // Create the treatment plan using Prisma
                const treatmentPlan = await this.prisma.treatmentPlan.create({
                    data: {
                        name: createTreatmentDto.name,
                        description: createTreatmentDto.description,
                        startDate: createTreatmentDto.startDate,
                        endDate: createTreatmentDto.endDate,
                        progress: createTreatmentDto.progress ?? 0,
                        userId,
                    },
                });

                return treatmentPlan as unknown as TreatmentPlan;
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                this.logger.error(
                    `Failed to create treatment plan: ${err.message}`,
                    err.stack,
                    'TreatmentsService'
                );
                throw error;
            }
        });
    }

    /**
     * Retrieves all treatment plans based on the filter and pagination parameters.
     *
     * @param userId - ID of the user whose treatment plans to retrieve
     * @param filter - Filter criteria for the query
     * @returns A promise resolving to a list of treatment plans
     */
    async findAll(userId: string, filter: FilterDto): Promise<TreatmentPlan[]> {
        return this.tracing.createSpan('treatments.findAll', async () => {
            this.logger.log(
                `Retrieving treatment plans for user ${userId} with filter and pagination`,
                'TreatmentsService'
            );

            try {
                // Get treatment plans with filtering and pagination
                const treatmentPlans = await this.prisma.treatmentPlan.findMany({
                    where: {
                        ...(filter?.where || {}),
                        // Add userId filter when present
                        ...(userId ? { userId } : {}),
                    },
                    orderBy: filter?.orderBy as Prisma.TreatmentPlanOrderByWithRelationInput,
                    include: filter?.include,
                });

                return treatmentPlans as unknown as TreatmentPlan[];
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                this.logger.error(
                    `Failed to retrieve treatment plans: ${err.message}`,
                    err.stack,
                    'TreatmentsService'
                );
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
                });

                // Throw an exception if the treatment plan is not found
                if (!treatmentPlan) {
                    throw new AppException(
                        `Treatment plan with ID ${id} not found`,
                        ErrorType.NOT_FOUND,
                        CARE_TREATMENT_PLAN_NOT_FOUND
                    );
                }

                return treatmentPlan as unknown as TreatmentPlan;
            } catch (error) {
                if (error instanceof NotFoundException) {
                    throw error;
                }
                const err = error instanceof Error ? error : new Error(String(error));
                this.logger.error(
                    `Failed to retrieve treatment plan: ${err.message}`,
                    err.stack,
                    'TreatmentsService'
                );
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
    async update(id: string, updateTreatmentDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
        return this.tracing.createSpan('treatments.update', async () => {
            this.logger.log(`Updating treatment plan with ID: ${id}`, 'TreatmentsService');

            try {
                // Prepare the data for update
                const data: Prisma.TreatmentPlanUpdateInput = {};
                if (updateTreatmentDto.name !== undefined) {
                    data.name = updateTreatmentDto.name;
                }
                if (updateTreatmentDto.description !== undefined) {
                    data.description = updateTreatmentDto.description;
                }
                if (updateTreatmentDto.startDate !== undefined) {
                    data.startDate = updateTreatmentDto.startDate;
                }
                if (updateTreatmentDto.endDate !== undefined) {
                    data.endDate = updateTreatmentDto.endDate;
                }
                if (updateTreatmentDto.progress !== undefined) {
                    data.progress = updateTreatmentDto.progress;
                }

                // Update the treatment plan
                const treatmentPlan = await this.prisma.treatmentPlan.update({
                    where: { id },
                    data,
                });

                return treatmentPlan as unknown as TreatmentPlan;
            } catch (error) {
                // Handle Prisma's "not found" error
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2025'
                ) {
                    throw new AppException(
                        `Treatment plan with ID ${id} not found`,
                        ErrorType.NOT_FOUND,
                        CARE_TREATMENT_PLAN_NOT_FOUND
                    );
                }
                const err = error instanceof Error ? error : new Error(String(error));
                this.logger.error(
                    `Failed to update treatment plan: ${err.message}`,
                    err.stack,
                    'TreatmentsService'
                );
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
                });

                return treatmentPlan as unknown as TreatmentPlan;
            } catch (error) {
                // Handle Prisma's "not found" error
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2025'
                ) {
                    throw new AppException(
                        `Treatment plan with ID ${id} not found`,
                        ErrorType.NOT_FOUND,
                        CARE_TREATMENT_PLAN_NOT_FOUND
                    );
                }
                const err = error instanceof Error ? error : new Error(String(error));
                this.logger.error(
                    `Failed to delete treatment plan: ${err.message}`,
                    err.stack,
                    'TreatmentsService'
                );
                throw error;
            }
        });
    }
}
