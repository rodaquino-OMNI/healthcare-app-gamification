import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  Body,
  UseGuards,
  UseFilters,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common'; // NestJS Common 10.0.0+
import { HealthService } from './health.service'; // Import HealthService for health data management
import { CreateMetricDto } from './dto/create-metric.dto'; // Import CreateMetricDto for creating new health metrics
import { UpdateMetricDto } from './dto/update-metric.dto'; // Import UpdateMetricDto for updating existing health metrics
import { CurrentUser } from 'src/backend/auth-service/src/auth/decorators/current-user.decorator'; // Import CurrentUser decorator to inject the current user
import { AllExceptionsFilter } from 'src/backend/shared/src/exceptions/exceptions.filter'; // Import AllExceptionsFilter for global exception handling
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto'; // Import FilterDto for filtering health data
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto'; // Import PaginationDto for paginating health data
import { AUTH_INSUFFICIENT_PERMISSIONS } from 'src/backend/shared/src/constants/error-codes.constants'; // Import AUTH_INSUFFICIENT_PERMISSIONS for error code
import { JwtAuthGuard } from '@nestjs/jwt'; // NestJS JWT 10.0.0+
import { RolesGuard } from '@nestjs/jwt'; // NestJS JWT 10.0.0+

/**
 * Handles incoming HTTP requests related to health data.
 */
@Controller('health')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(AllExceptionsFilter)
export class HealthController {
  /**
   * Initializes the HealthController.
   * @param healthService The HealthService to inject.
   */
  constructor(
    @Inject(HealthService)
    private readonly healthService: HealthService,
  ) {}

  /**
   * Creates a new health metric for a user.
   * @param recordId The ID of the health record to associate the metric with.
   * @param createMetricDto The data for creating the new health metric.
   * @returns The newly created HealthMetric entity.
   */
  @Post(':recordId')
  @HttpCode(HttpStatus.CREATED)
  async createHealthMetric(
    @Param('recordId') recordId: string,
    @Body() createMetricDto: CreateMetricDto,
  ): Promise<any> {
    // Calls the healthService to create a new health metric.
    return await this.healthService.createHealthMetric(recordId, createMetricDto);
  }

  /**
   * Updates an existing health metric for a user.
   * @param id The ID of the health metric to update.
   * @param updateMetricDto The data for updating the health metric.
   * @returns The updated HealthMetric entity.
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateHealthMetric(
    @Param('id') id: string,
    @Body() updateMetricDto: UpdateMetricDto,
  ): Promise<any> {
    // Calls the healthService to update an existing health metric.
    return await this.healthService.updateHealthMetric(id, updateMetricDto);
  }
}