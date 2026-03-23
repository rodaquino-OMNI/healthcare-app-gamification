import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';

export class FilterCycleDto {
    @ApiPropertyOptional({ description: 'Filter records on or after this date (ISO string)' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'Filter records on or before this date (ISO string)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({
        description: 'Maximum number of records to return',
        default: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number;

    @ApiPropertyOptional({
        description: 'Number of records to skip for pagination',
        default: 0,
        minimum: 0,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}
