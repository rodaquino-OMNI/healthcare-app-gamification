import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PlansService } from './plans.service';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { Roles } from 'src/backend/auth-service/src/auth/decorators/roles.decorator';

/**
 * Handles HTTP requests related to insurance plans.
 */
@Controller('plans')
@ApiTags('Plans')
@ApiBearerAuth()
export class PlansController {
  /**
   * Initializes the PlansController.
   * @param plansService Service for handling plan operations
   * @param logger Service for logging operations
   */
  constructor(
    private readonly plansService: PlansService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('PlansController initialized', 'PlansController');
  }

  /**
   * Creates a new insurance plan.
   * @param createPlanData Plan data to create
   * @returns The newly created plan
   */
  @Post()
  @Roles('admin')
  async create(@Body() createPlanData: any): Promise<any> {
    this.logger.log('Creating new plan', 'PlansController');
    return this.plansService.create(createPlanData);
  }

  /**
   * Retrieves all insurance plans based on the provided filters and pagination.
   * @param pagination Pagination parameters
   * @param filter Filter criteria
   * @returns An array of insurance plans
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() pagination: PaginationDto, 
    @Query() filter: FilterDto
  ): Promise<any[]> {
    this.logger.log('Retrieving all plans', 'PlansController');
    return this.plansService.findAll(pagination, filter);
  }

  /**
   * Retrieves a single insurance plan by its ID.
   * @param id Plan ID to find
   * @returns The insurance plan, or null if not found
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    this.logger.log(`Retrieving plan with ID: ${id}`, 'PlansController');
    return this.plansService.findOne(id);
  }

  /**
   * Updates an existing insurance plan.
   * @param id Plan ID to update
   * @param updatePlanDto Plan data to update
   * @returns The updated plan
   */
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: any,
  ): Promise<any> {
    this.logger.log(`Updating plan with ID: ${id}`, 'PlansController');
    return this.plansService.update(id, updatePlanDto);
  }

  /**
   * Deletes an insurance plan by its ID.
   * @param id Plan ID to delete
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log(`Removing plan with ID: ${id}`, 'PlansController');
    return this.plansService.remove(id);
  }
}