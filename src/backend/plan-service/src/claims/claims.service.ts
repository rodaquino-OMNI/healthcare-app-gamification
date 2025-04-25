import { Injectable } from '@nestjs/common'; // @nestjs/common 10.0.0+
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim } from './entities/claim.entity';
import { PlansService } from '../plans/plans.service';
import { InsuranceService } from '../insurance/insurance.service';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { Service } from 'src/backend/shared/src/interfaces/service.interface';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';
import { AppException, ErrorType } from 'src/backend/shared/src/exceptions/exceptions.types';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { KafkaService } from 'src/backend/shared/src/kafka/kafka.service';
import { ErrorCodes } from 'src/backend/shared/src/constants/error-codes.constants';
import { DocumentsService } from '../documents/documents.service';
import { TracingService } from 'src/backend/shared/src/tracing/tracing.service';

/**
 * Handles the business logic for managing insurance claims.
 */
@Injectable()
export class ClaimsService {
  /**
   * Initializes the ClaimsService.
   * @param prisma Inject PrismaService for claim data access.
   * @param logger Initialize the logger.
   * @param kafkaService Inject KafkaService for publishing claim events.
   * @param plansService Inject PlansService for plan data access.
   * @param insuranceService Inject InsuranceService for insurance verification.
   * @param documentsService Inject DocumentsService for document management.
   * @param tracingService Inject TracingService for tracing.
   */
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly kafkaService: KafkaService,
    private readonly plansService: PlansService,
    private readonly insuranceService: InsuranceService,
    private readonly documentsService: DocumentsService,
    private readonly tracingService: TracingService,
  ) {
    this.logger.log('ClaimsService initialized', 'ClaimsService');
  }

  /**
   * Creates a new claim.
   * @param userId Create a new claim entity.
   * @param createClaimDto Set the claim properties from the DTO.
   * @returns The newly created claim.
   */
  async create(userId: string, createClaimDto: CreateClaimDto): Promise<Claim> {
    return this.tracingService.createSpan('ClaimsService.create', async () => {
      this.logger.log(`Creating claim for user: ${userId}`, 'ClaimsService');

      try {
        // Verify the plan exists and belongs to the user
        const plan = await this.plansService.findOne(createClaimDto.planId);
        if (plan.userId !== userId) {
          throw new AppException(
            'Cannot submit a claim for a plan that does not belong to you',
            ErrorType.BUSINESS,
            'PLAN_CLAIM_UNAUTHORIZED',
            { userId, planId: createClaimDto.planId }
          );
        }

        // Create the claim
        const claim = await this.prisma.claim.create({
          data: {
            userId,
            planId: createClaimDto.planId,
            type: createClaimDto.type,
            amount: createClaimDto.amount,
            status: 'SUBMITTED', // Initial status
            procedureCode: createClaimDto.procedureCode || null,
          },
        });

        // Handle document attachments if provided
        if (createClaimDto.documentIds && createClaimDto.documentIds.length > 0) {
          for (const docId of createClaimDto.documentIds) {
            // Verify document exists and is accessible to the user
            const document = await this.documentsService.findOne(docId);
            if (!document) {
              this.logger.warn(`Document not found: ${docId}`, 'ClaimsService');
              continue;
            }
            
            // Update document to associate with this claim
            await this.prisma.document.update({
              where: { id: docId },
              data: {
                entity_id: claim.id,
                entity_type: 'claim',
              }
            });
          }
        }

        // Publish claim creation event for gamification
        await this.kafkaService.produce(
          'claims-events',
          {
            eventType: 'CLAIM_SUBMITTED',
            userId,
            claimId: claim.id,
            claimType: claim.type,
            amount: claim.amount,
            timestamp: new Date().toISOString()
          },
          claim.id
        );

        this.logger.log(`Claim created successfully: ${claim.id}`, 'ClaimsService');
        
        // Retrieve the complete claim with associated documents
        const fullClaim = await this.findOne(claim.id);
        return fullClaim;
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }

        this.logger.error(`Failed to create claim: ${error.message}`, error.stack, 'ClaimsService');
        throw new AppException(
          'Failed to create claim',
          ErrorType.TECHNICAL,
          ErrorCodes.PLAN_INVALID_CLAIM_DATA,
          { userId, dto: createClaimDto },
          error
        );
      }
    });
  }

  /**
   * Retrieves all claims for a user based on the provided filter and pagination.
   * @param userId Retrieve all claims using the prisma.
   * @param filterDto Filter parameters for claims query
   * @param paginationDto Pagination parameters for claims query
   * @returns A list of Claim entities.
   */
  async findAll(userId: string, filterDto?: FilterDto, paginationDto?: PaginationDto): Promise<Claim[]> {
    return this.tracingService.createSpan('ClaimsService.findAll', async () => {
      this.logger.log(`Finding claims for user: ${userId}`, 'ClaimsService');

      try {
        // Build query conditions
        const where: any = { userId };

        // Apply additional filters if provided
        if (filterDto?.where) {
          Object.assign(where, filterDto.where);
        }

        // Build ordering
        const orderBy: any = filterDto?.orderBy || { submittedAt: 'desc' };

        // Apply pagination
        const skip = paginationDto?.skip || 
          (paginationDto?.page ? (paginationDto.page - 1) * (paginationDto.limit || 10) : undefined);
        const take = paginationDto?.limit;

        // Query claims with documents
        const claims = await this.prisma.claim.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            documents: true,
          }
        });

        this.logger.log(`Found ${claims.length} claims for user: ${userId}`, 'ClaimsService');
        return claims;
      } catch (error) {
        this.logger.error(`Failed to fetch claims: ${error.message}`, error.stack, 'ClaimsService');
        throw new AppException(
          'Failed to fetch claims',
          ErrorType.TECHNICAL,
          'PLAN_CLAIM_FETCH_FAILED',
          { userId, filterDto, paginationDto },
          error
        );
      }
    });
  }

  /**
   * Retrieves a single claim by its ID.
   * @param id Retrieve the claim using the prisma.
   * @returns The Claim entity, if found.
   */
  async findOne(id: string): Promise<Claim | null> {
    return this.tracingService.createSpan('ClaimsService.findOne', async () => {
      this.logger.log(`Finding claim with ID: ${id}`, 'ClaimsService');

      try {
        const claim = await this.prisma.claim.findUnique({
          where: { id },
          include: {
            documents: true,
          }
        });

        if (!claim) {
          this.logger.log(`Claim not found: ${id}`, 'ClaimsService');
          return null;
        }

        return claim;
      } catch (error) {
        this.logger.error(`Failed to fetch claim: ${error.message}`, error.stack, 'ClaimsService');
        throw new AppException(
          'Failed to fetch claim details',
          ErrorType.TECHNICAL,
          'PLAN_CLAIM_FETCH_FAILED',
          { id },
          error
        );
      }
    });
  }

  /**
   * Updates an existing claim.
   * @param id Retrieve the claim using the prisma.
   * @param updateClaimDto Update the claim properties from the DTO.
   * @returns The updated Claim entity.
   */
  async update(id: string, updateClaimDto: UpdateClaimDto): Promise<Claim> {
    return this.tracingService.createSpan('ClaimsService.update', async () => {
      this.logger.log(`Updating claim with ID: ${id}`, 'ClaimsService');

      try {
        // Check if claim exists
        const existingClaim = await this.findOne(id);
        if (!existingClaim) {
          throw new AppException(
            `Claim not found: ${id}`,
            ErrorType.BUSINESS,
            'PLAN_CLAIM_NOT_FOUND',
            { id }
          );
        }

        // Validate status transitions if status is being updated
        if (updateClaimDto.status && updateClaimDto.status !== existingClaim.status) {
          this.validateStatusTransition(existingClaim.status, updateClaimDto.status);
        }

        // Update the claim
        const updatedClaim = await this.prisma.claim.update({
          where: { id },
          data: updateClaimDto,
          include: {
            documents: true,
          }
        });

        // If status changed to APPROVED, publish event for gamification
        if (updateClaimDto.status === 'APPROVED' && existingClaim.status !== 'APPROVED') {
          await this.kafkaService.produce(
            'claims-events',
            {
              eventType: 'CLAIM_APPROVED',
              userId: updatedClaim.userId,
              claimId: updatedClaim.id,
              claimType: updatedClaim.type,
              amount: updatedClaim.amount,
              timestamp: new Date().toISOString()
            },
            updatedClaim.id
          );
        }

        this.logger.log(`Claim updated successfully: ${id}`, 'ClaimsService');
        return updatedClaim;
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }

        this.logger.error(`Failed to update claim: ${error.message}`, error.stack, 'ClaimsService');
        throw new AppException(
          'Failed to update claim',
          ErrorType.TECHNICAL,
          'PLAN_CLAIM_UPDATE_FAILED',
          { id, updateClaimDto },
          error
        );
      }
    });
  }

  /**
   * Deletes a claim by its ID.
   * @param id Delete the claim using the prisma.
   */
  async delete(id: string): Promise<void> {
    return this.tracingService.createSpan('ClaimsService.delete', async () => {
      this.logger.log(`Deleting claim with ID: ${id}`, 'ClaimsService');

      try {
        // Check if claim exists
        const existingClaim = await this.findOne(id);
        if (!existingClaim) {
          throw new AppException(
            `Claim not found: ${id}`,
            ErrorType.BUSINESS,
            'PLAN_CLAIM_NOT_FOUND',
            { id }
          );
        }

        // Check if the claim can be deleted based on its status
        if (!['DRAFT', 'SUBMITTED'].includes(existingClaim.status)) {
          throw new AppException(
            `Cannot delete claim in ${existingClaim.status} status`,
            ErrorType.BUSINESS,
            'PLAN_CLAIM_DELETE_INVALID_STATUS',
            { id, status: existingClaim.status }
          );
        }

        // Delete the claim
        await this.prisma.claim.delete({
          where: { id }
        });

        this.logger.log(`Claim deleted successfully: ${id}`, 'ClaimsService');
      } catch (error) {
        if (error instanceof AppException) {
          throw error;
        }

        this.logger.error(`Failed to delete claim: ${error.message}`, error.stack, 'ClaimsService');
        throw new AppException(
          'Failed to delete claim',
          ErrorType.TECHNICAL,
          'PLAN_CLAIM_DELETE_FAILED',
          { id },
          error
        );
      }
    });
  }

  /**
   * Validates if a status transition is allowed.
   * @private
   * @param currentStatus Current claim status
   * @param newStatus Target claim status
   */
  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    // Define allowed transitions
    const allowedTransitions: Record<string, string[]> = {
      'DRAFT': ['SUBMITTED', 'CANCELLED'],
      'SUBMITTED': ['UNDER_REVIEW', 'REJECTED'],
      'UNDER_REVIEW': ['ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'DENIED'],
      'ADDITIONAL_INFO_REQUIRED': ['UNDER_REVIEW', 'EXPIRED'],
      'APPROVED': ['PROCESSING'],
      'PROCESSING': ['COMPLETED', 'FAILED'],
      'FAILED': ['PROCESSING'],
      'DENIED': ['APPEALED'],
      'APPEALED': ['UNDER_REVIEW', 'FINAL_DENIAL'],
    };

    // Check if transition is allowed
    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new AppException(
        `Cannot transition claim from ${currentStatus} to ${newStatus}`,
        ErrorType.BUSINESS,
        'PLAN_CLAIM_INVALID_STATUS_TRANSITION',
        { currentStatus, newStatus }
      );
    }
  }
}