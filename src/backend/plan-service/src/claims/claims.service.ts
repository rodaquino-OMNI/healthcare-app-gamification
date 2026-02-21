/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/shared/database/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { ErrorType } from '@app/shared/exceptions/error.types';
import { FilterDto, PaginationDto } from '../dto/filter.dto';
import { PlansService } from '../plans/plans.service';
import { KafkaProducer } from '@app/shared/kafka/kafka.producer';

@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly plansService: PlansService,
    private readonly kafkaProducer: KafkaProducer
  ) {}

  /**
   * Create a new insurance claim
   * @param userId The ID of the user creating the claim
   * @param createClaimDto The claim data
   * @returns The created claim
   */
  async create(userId: string, createClaimDto: CreateClaimDto): Promise<any> {
    try {
      // Validate the user has access to the plan
      await this.validateUserPlanAccess(userId, createClaimDto.planId);

      // Create a new claim
      const savedClaim = await this.prisma.claim.create({
        data: {
          userId,
          planId: createClaimDto.planId,
          type: createClaimDto.type,
          amount: createClaimDto.amount,
          procedureCode: createClaimDto.procedureCode || '',
          status: 'submitted',
          submittedAt: new Date(),
        },
      });

      // Publish event to Kafka
      await this.publishClaimEvent('claim.submitted', savedClaim);

      return savedClaim;
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }

      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to create claim: ${errorMessage}`, errorStack);
      throw new AppException(ErrorType.PLAN_TECHNICAL_ERROR, { userId, dto: createClaimDto } as any,
        ErrorType.TECHNICAL
      );
    }
  }

  /**
   * Get all claims with filtering and pagination
   * @param userId The user ID
   * @param filterDto Optional filter criteria
   * @param paginationDto Optional pagination parameters
   * @returns Paginated list of claims
   */
  async findAll(
    userId: string,
    filterDto?: FilterDto,
    paginationDto?: PaginationDto
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    try {
      // Build base query
      const where: any = { userId };

      // Apply additional filters
      if (filterDto?.where) {
        Object.assign(where, filterDto.where);
      }

      // Define order
      const orderBy: any = filterDto?.orderBy || { submittedAt: 'desc' };

      // Set up pagination
      const skip = paginationDto?.skip ||
        (paginationDto?.page ? (paginationDto.page - 1) * (paginationDto?.limit || 10) : 0);
      const take = paginationDto?.limit || 10;

      // Get total count
      const total = await this.prisma.claim.count({ where });

      // Get data with pagination
      const claims = await this.prisma.claim.findMany({
        where,
        orderBy,
        skip,
        take,
      });

      return {
        data: claims,
        total,
        page: paginationDto?.page || 1,
        limit: take
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to retrieve claims: ${errorMessage}`, errorStack);
      throw new AppException(ErrorType.PLAN_TECHNICAL_ERROR, { userId, filterDto, paginationDto } as any,
        ErrorType.TECHNICAL
      );
    }
  }

  /**
   * Get a specific claim by ID
   * @param id The claim ID
   * @returns The claim
   */
  async findOne(id: string): Promise<any> {
    try {
      const claim = await this.prisma.claim.findUnique({ where: { id } });

      if (!claim) {
        throw new AppException(ErrorType.PLAN_CLAIM_NOT_FOUND, { id } as any,
          ErrorType.BUSINESS
        );
      }

      return claim;
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }

      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to find claim: ${errorMessage}`, errorStack);
      throw new AppException(ErrorType.PLAN_TECHNICAL_ERROR, { id } as any,
        ErrorType.TECHNICAL
      );
    }
  }

  /**
   * Update a claim
   * @param id The claim ID
   * @param updateClaimDto The updated claim data
   * @returns The updated claim
   */
  async update(id: string, updateClaimDto: UpdateClaimDto): Promise<any> {
    try {
      // Find the existing claim
      const existingClaim = await this.findOne(id);

      // Check if claim is in a status that can be updated
      if (!['submitted', 'information_required'].includes(existingClaim.status)) {
        throw new AppException(ErrorType.PLAN_CLAIM_STATUS_INVALID, { id, status: existingClaim.status } as any,
          ErrorType.BUSINESS
        );
      }

      // Build the update data
      const updateData: any = {
        ...updateClaimDto,
        updatedAt: new Date(),
      };

      // Add status update if needed
      if (updateClaimDto.status && updateClaimDto.status !== existingClaim.status) {
        this.validateStatusTransition(existingClaim.status, updateClaimDto.status);

        const note = updateClaimDto.notes || `Status updated to ${updateClaimDto.status}`;

        const statusUpdate = {
          status: updateClaimDto.status,
          timestamp: new Date(),
          note
        };

        const currentHistory = Array.isArray(existingClaim.statusHistory)
          ? existingClaim.statusHistory
          : [];

        updateData.statusHistory = [...currentHistory, statusUpdate];

        // Set status specific timestamps
        switch (updateClaimDto.status) {
          case 'approved':
            updateData.approvedAt = new Date();
            break;
          case 'rejected':
            updateData.rejectedAt = new Date();
            break;
          case 'paid':
            updateData.paidAt = new Date();
            break;
        }
      }

      // Update the claim
      const result = await this.prisma.claim.update({
        where: { id },
        data: updateData,
      });

      // Publish event to Kafka
      await this.publishClaimEvent('claim.updated', result);

      return result;
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }

      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to update claim: ${errorMessage}`, errorStack);
      throw new AppException(ErrorType.PLAN_TECHNICAL_ERROR, { id, updateClaimDto } as any,
        ErrorType.TECHNICAL
      );
    }
  }

  /**
   * Delete a claim
   * @param id The claim ID
   * @returns True if the claim was deleted
   */
  async remove(id: string): Promise<boolean> {
    try {
      // Find the existing claim
      const existingClaim = await this.findOne(id);

      // Check if claim can be deleted (only in submitted status)
      if (existingClaim.status !== 'submitted') {
        throw new AppException(ErrorType.PLAN_CLAIM_STATUS_INVALID, { id } as any,
          ErrorType.BUSINESS
        );
      }

      // Delete the claim
      await this.prisma.claim.delete({ where: { id } });

      // Publish event to Kafka
      await this.publishClaimEvent('claim.deleted', existingClaim);

      return true;
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }

      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to delete claim: ${errorMessage}`, errorStack);
      throw new AppException(ErrorType.PLAN_TECHNICAL_ERROR, { id } as any,
        ErrorType.TECHNICAL
      );
    }
  }

  /**
   * Validate that a user has access to a plan
   * @param userId The user ID
   * @param planId The plan ID
   */
  private async validateUserPlanAccess(userId: string, planId: string): Promise<void> {
    try {
      const plan = await this.plansService.findOne(planId);

      if (plan.userId !== userId) {
        throw new AppException(ErrorType.PLAN_UNAUTHORIZED_ACCESS, { userId, planId } as any,
          ErrorType.BUSINESS
        );
      }
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }

      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to validate plan access: ${errorMessage}`, errorStack);
      throw new AppException(ErrorType.PLAN_TECHNICAL_ERROR, { userId, planId: planId } as any,
        ErrorType.TECHNICAL
      );
    }
  }

  /**
   * Validate that the status transition is valid
   * @param currentStatus The current status
   * @param newStatus The new status
   */
  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: Record<string, string[]> = {
      submitted: ['under_review', 'information_required', 'approved', 'rejected'],
      information_required: ['under_review', 'approved', 'rejected'],
      under_review: ['information_required', 'approved', 'rejected'],
      approved: ['paid'],
      rejected: [],
      paid: []
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new AppException(ErrorType.PLAN_CLAIM_STATUS_INVALID, { currentStatus, newStatus } as any,
        ErrorType.BUSINESS
      );
    }
  }

  /**
   * Publish claim event to Kafka
   * @param eventType The type of event
   * @param claim The claim data
   */
  private async publishClaimEvent(eventType: string, claim: any): Promise<void> {
    try {
      await this.kafkaProducer.send('plan.claims', {
        eventType,
        timestamp: new Date().toISOString(),
        claim: {
          id: claim.id,
          userId: claim.userId,
          planId: claim.planId,
          status: claim.status,
          amount: claim.amount,
          procedureCode: claim.procedureCode,
          submittedAt: claim.submittedAt
        }
      });

      this.logger.debug(`Published event ${eventType} for claim ${claim.id}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? (error as any).message : String(error);
      const errorStack = error instanceof Error ? (error as any).stack : undefined;

      this.logger.error(`Failed to publish claim event: ${errorMessage}`, errorStack);
    }
  }
}
