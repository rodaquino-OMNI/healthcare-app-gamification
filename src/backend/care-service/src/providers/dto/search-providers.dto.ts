import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

/**
 * Data transfer object for searching healthcare providers.
 * Combines provider-specific search criteria with standard filtering and pagination capabilities
 * from the AUSTA SuperApp's shared DTOs.
 *
 * This DTO is used in the Care Journey to enable users to search for providers
 * based on various criteria and supports both the appointment booking and
 * telemedicine access requirements.
 */
export class SearchProvidersDto implements FilterDto, PaginationDto {
    /**
     * Medical specialty to filter providers by
     * @example "Cardiologia"
     */
    @IsOptional()
    @IsString()
    specialty?: string;

    /**
     * Geographic location to filter providers by
     * @example "São Paulo, SP"
     */
    @IsOptional()
    @IsString()
    location?: string;

    /**
     * Provider name for search by name
     * @example "Dr. Silva"
     */
    @IsOptional()
    @IsString()
    name?: string;

    // FilterDto properties
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'ASC' | 'DESC'>;
    include?: Record<string, boolean>;
    select?: Record<string, boolean>;
    journey?: string;

    // PaginationDto properties
    page?: number;
    limit?: number;
    skip?: number;
    cursor?: string;
}
