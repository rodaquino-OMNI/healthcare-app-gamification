import { JwtAuthGuard } from '@app/auth/auth/guards/jwt-auth.guard'; // NestJS JWT 10.0.0+
import { RolesGuard } from '@app/auth/auth/guards/roles.guard'; // NestJS JWT 10.0.0+
import { PhiAccess } from '@app/shared/audit';
import { ConsentGuard, RequireConsent, ConsentType } from '@app/shared/consent'; // LGPD consent guard + type enum
import { AllExceptionsFilter } from '@app/shared/exceptions/exceptions.filter'; // Import AllExceptionsFilter for global exception handling
import {
    Controller,
    Post,
    Put,
    Param,
    Body,
    UseGuards,
    UseFilters,
    HttpCode,
    HttpStatus,
    Inject,
    UsePipes,
    ValidationPipe,
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
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async createHealthMetric(
        @Param('recordId') recordId: string,
        @Body() createMetricDto: CreateMetricDto
    ): Promise<unknown> {
        // Calls the healthService to create a new health metric.
        return this.healthService.createHealthMetric(recordId, createMetricDto);
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
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async updateHealthMetric(
        @Param('id') id: string,
        @Body() updateMetricDto: UpdateMetricDto
    ): Promise<unknown> {
        // Calls the healthService to update an existing health metric.
        return this.healthService.updateHealthMetric(id, updateMetricDto);
    }
}
