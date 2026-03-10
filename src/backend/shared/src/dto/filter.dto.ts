/**
 * DTO for filtering entities in list operations
 */
export class FilterDto {
    /**
     * WHERE clause for filtering results
     */
    where?: Record<string, unknown>;

    /**
     * ORDER BY clause for sorting results
     */
    orderBy?: Record<string, 'ASC' | 'DESC'>;

    /**
     * Relations to include in the results
     */
    include?: Record<string, boolean>;
}
