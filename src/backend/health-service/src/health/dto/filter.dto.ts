import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';

import { MetricType } from '../../types/health.types';

/**
 * Data transfer object for filtering health metrics
 */
export class FilterDto {
    @ApiPropertyOptional({ enum: MetricType, description: 'Type of metric to filter by' })
    @IsEnum(MetricType)
    @IsOptional()
    type?: MetricType;

    @ApiPropertyOptional({ description: 'Start date for filtering metrics (ISO format)' })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for filtering metrics (ISO format)' })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({ description: 'Filter by source of metric' })
    @IsString()
    @IsOptional()
    source?: string;

    @ApiPropertyOptional({
        type: 'object',
        description: 'Specific filtering conditions',
        additionalProperties: true,
    })
    @IsOptional()
    where?: Record<string, unknown>;

    @ApiPropertyOptional({
        type: 'object',
        description: 'Ordering specification',
        additionalProperties: true,
    })
    @IsOptional()
    orderBy?: Record<string, 'asc' | 'desc'>;

    @ApiPropertyOptional({
        type: 'object',
        description: 'Related data to include',
        additionalProperties: true,
    })
    @IsOptional()
    include?: Record<string, boolean>;
}

/**
 * Data transfer object for paginating results
 */
export class PaginationDto {
    @ApiPropertyOptional({ default: 1, description: 'Page number' })
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({ default: 10, description: 'Items per page' })
    @IsOptional()
    limit?: number;

    /**
     * Calculate items to skip based on page and limit
     */
    get skip(): number {
        const page = this.page || 1;
        const limit = this.limit || 10;
        return (page - 1) * limit;
    }
}
