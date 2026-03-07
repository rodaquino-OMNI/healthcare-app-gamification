import { CurrentUser } from '@app/auth/auth/decorators/current-user.decorator'; // Import CurrentUser decorator to inject the current user
import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard'; // NestJS JWT 10.0.0+
import { RolesGuard } from '@app/auth/auth/guards/roles.guard'; // NestJS JWT 10.0.0+
import { PhiAccess } from '@app/shared/audit';
import { ConsentGuard, RequireConsent } from '@app/shared/consent'; // LGPD consent guard
import { ConsentType } from '@app/shared/consent'; // Consent type enum
import { AUTH_INSUFFICIENT_PERMISSIONS } from '@app/shared/constants/error-codes.constants'; // Import AUTH_INSUFFICIENT_PERMISSIONS for error code
import { FilterDto } from '@app/shared/dto/filter.dto'; // Import FilterDto for filtering health data
import { PaginationDto } from '@app/shared/dto/pagination.dto'; // Import PaginationDto for paginating health data
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter'; // Import AllExceptionsFilter for global exception handling
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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateMetricDto } from './dto/create-metric.dto'; // Import CreateMetricDto for creating new health metrics
import { UpdateMetricDto } from './dto/update-metric.dto'; // Import UpdateMetricDto for updating existing health metrics
import { HealthService } from './health.service'; // Import HealthService for health data management

/**
 * Handles incoming HTTP requests related to health data.
 */
@ApiTags('health')
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
        private readonly healthService: HealthService
    ) {}

    /**
     * Creates a new health metric for a user.
     * @param recordId The ID of the health record to associate the metric with.
     * @param createMetricDto The data for creating the new health metric.
     * @returns The newly created HealthMetric entity.
     */
    @Post(':recordId')
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('HealthMetric')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new health metric' })
    @ApiResponse({ status: 201, description: 'Health metric created successfully' })
    @ApiResponse({ status: 403, description: 'Consent not granted for health data sharing' })
    async createHealthMetric(
        @Param('recordId') recordId: string,
        @Body() createMetricDto: CreateMetricDto
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
    @UseGuards(ConsentGuard)
    @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
    @PhiAccess('HealthMetric')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update an existing health metric' })
    @ApiResponse({ status: 200, description: 'Health metric updated successfully' })
    @ApiResponse({ status: 403, description: 'Consent not granted for health data sharing' })
    async updateHealthMetric(@Param('id') id: string, @Body() updateMetricDto: UpdateMetricDto): Promise<any> {
        // Calls the healthService to update an existing health metric.
        return await this.healthService.updateHealthMetric(id, updateMetricDto);
    }
}
