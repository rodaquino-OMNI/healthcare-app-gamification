import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/auth/auth/guards/roles.guard';
import { Roles } from '@app/auth/auth/decorators/roles.decorator';
import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { FilterDto } from '../dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Claim } from './entities/claim.entity';

/**
 * Controller for handling insurance claim operations in the Plan journey.
 */
@Controller('claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  /**
   * Initializes the ClaimsController with its dependencies.
   * @param claimsService Private readonly claimsService
   * @param logger Private readonly logger
   * @param tracingService Private readonly tracingService
   */
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly logger: LoggerService,
    private readonly tracingService: TracingService,
  ) {}

  /**
   * Creates a new insurance claim.
   * @param userId String identifier of the current user
   * @param createClaimDto Data transfer object with claim details
   * @returns The newly created claim.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('user')
  async create(
    @CurrentUser('id') userId: string,
    @Body() createClaimDto: CreateClaimDto,
  ): Promise<Claim> {
    this.logger.log(`Creating claim for user: ${userId}`, 'ClaimsController');
    
    return this.tracingService.createSpan('ClaimsController.create', async () => {
      const claim = await this.claimsService.create(userId, createClaimDto);
      return claim;
    });
  }

  /**
   * Retrieves all claims for the current user with filtering and pagination.
   * @param userId String identifier of the current user
   * @param filterDto Filter parameters for the query
   * @param paginationDto Pagination parameters for the query
   * @returns A paginated list of claims.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() filterDto: FilterDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: Claim[]; total: number; page: number; limit: number }> {
    this.logger.log(`Retrieving claims for user: ${userId}`, 'ClaimsController');
    
    return this.tracingService.createSpan('ClaimsController.findAll', async () => {
      const claims = await this.claimsService.findAll(userId, filterDto, paginationDto);
      return claims;
    });
  }

  /**
   * Retrieves a single claim by its ID.
   * @param userId String identifier of the current user
   * @param id String identifier of the claim to retrieve
   * @returns The claim with the specified ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<Claim> {
    this.logger.log(`Retrieving claim with ID: ${id} for user: ${userId}`, 'ClaimsController');
    
    return this.tracingService.createSpan('ClaimsController.findOne', async () => {
      const claim = await this.claimsService.findOne(id);
      
      // Check if claim exists
      if (!claim) {
        this.logger.warn(`Claim with ID ${id} not found`, 'ClaimsController');
        throw new NotFoundException(`Claim with ID ${id} not found`);
      }
      
      // Verify the claim belongs to the requesting user
      if (claim.userId !== userId) {
        this.logger.warn(`User ${userId} attempted to access claim ${id} belonging to another user`, 'ClaimsController');
        throw new ForbiddenException('You do not have permission to access this claim');
      }
      
      return claim;
    });
  }

  /**
   * Updates an existing claim.
   * @param userId String identifier of the current user
   * @param id String identifier of the claim to update
   * @param updateClaimDto Data transfer object with updated claim details
   * @returns The updated claim.
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles('user')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateClaimDto: UpdateClaimDto,
  ): Promise<Claim> {
    this.logger.log(`Updating claim with ID: ${id} for user: ${userId}`, 'ClaimsController');
    
    return this.tracingService.createSpan('ClaimsController.update', async () => {
      // First retrieve the claim to verify ownership
      const claim = await this.claimsService.findOne(id);
      
      // Verify the claim exists
      if (!claim) {
        this.logger.warn(`Claim with ID ${id} not found`, 'ClaimsController');
        throw new NotFoundException(`Claim with ID ${id} not found`);
      }
      
      // Verify the claim belongs to the requesting user
      if (claim.userId !== userId) {
        this.logger.warn(`User ${userId} attempted to update claim ${id} belonging to another user`, 'ClaimsController');
        throw new ForbiddenException('You do not have permission to update this claim');
      }
      
      // If ownership is verified, proceed with update
      return this.claimsService.update(id, updateClaimDto);
    });
  }

  /**
   * Deletes a claim by its ID.
   * @param userId String identifier of the current user
   * @param id String identifier of the claim to delete
   * @returns No content.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('user')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    this.logger.log(`Deleting claim with ID: ${id} for user: ${userId}`, 'ClaimsController');
    
    return this.tracingService.createSpan('ClaimsController.remove', async () => {
      // First retrieve the claim to verify ownership
      const claim = await this.claimsService.findOne(id);
      
      // Verify the claim exists
      if (!claim) {
        this.logger.warn(`Claim with ID ${id} not found`, 'ClaimsController');
        throw new NotFoundException(`Claim with ID ${id} not found`);
      }
      
      // Verify the claim belongs to the requesting user
      if (claim.userId !== userId) {
        this.logger.warn(`User ${userId} attempted to delete claim ${id} belonging to another user`, 'ClaimsController');
        throw new ForbiddenException('You do not have permission to delete this claim');
      }
      
      // If ownership is verified, proceed with deletion
      await this.claimsService.remove(id);
    });
  }
}