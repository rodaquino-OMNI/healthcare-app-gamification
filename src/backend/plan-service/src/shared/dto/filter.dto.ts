import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object for filtering queries
 */
export class FilterDto {
    /**
     * Search term to filter results
     */
    @ApiPropertyOptional({
        description: 'Search term to filter results',
        example: 'medical',
    })
    @IsOptional()
    @IsString()
    search?: string;

    /**
     * Field to sort results by
     */
    @ApiPropertyOptional({
        description: 'Field to sort results by',
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    /**
     * Sort direction (asc or desc)
     */
    @ApiPropertyOptional({
        description: 'Sort direction (asc or desc)',
        example: 'desc',
        enum: ['asc', 'desc'],
    })
    @IsOptional()
    @IsString()
    sortDirection?: 'asc' | 'desc';

    /**
     * Filter by status
     */
    @ApiPropertyOptional({
        description: 'Filter by status',
        example: 'approved',
    })
    @IsOptional()
    @IsString()
    status?: string;

    /**
     * Filter by type
     */
    @ApiPropertyOptional({
        description: 'Filter by type',
        example: 'medical',
    })
    @IsOptional()
    @IsString()
    type?: string;
}
