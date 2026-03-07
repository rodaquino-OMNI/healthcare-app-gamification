/* eslint-disable */
/**
 * DTO for filtering and pagination across plan service endpoints
 */

export class FilterDto {
    /**
     * Where clauses for the filter
     */
    where?: Record<string, unknown>;

    /**
     * Order by clauses
     */
    orderBy?: Record<string, 'asc' | 'desc'>;

    /**
     * Relations to include
     */
    include?: Record<string, boolean>;

    /**
     * Optional filter by type
     */
    type?: string;

    /**
     * Optional filter by start date
     */
    startDate?: string;

    /**
     * Optional filter by end date
     */
    endDate?: string;
}

/**
 * DTO for handling pagination in API responses
 */
export class PaginationDto {
    /**
     * Page number (1-based)
     */
    page?: number = 1;

    /**
     * Number of items per page
     */
    limit?: number = 10;

    /**
     * Number of items to skip
     */
    skip?: number;
}
