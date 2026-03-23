import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class FilterNutritionDto {
    @ApiPropertyOptional({ description: 'Start date for filtering records (ISO 8601)' })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for filtering records (ISO 8601)' })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'Maximum number of records to return', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @ApiPropertyOptional({ description: 'Number of records to skip for pagination', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;
}
