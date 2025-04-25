/**
 * Standard pagination DTO for query parameters across all journey services.
 * Provides a consistent way to handle pagination for API requests and repository queries.
 * 
 * Usage example:
 * ```
 * @Get('users')
 * async getUsers(@Query() paginationDto: PaginationDto): Promise<PaginatedResponse<User>> {
 *   // Implementation
 * }
 * ```
 */
export interface PaginationDto {
  /**
   * Current page number (1-based)
   * @example 1
   */
  page?: number;
  
  /**
   * Number of items per page
   * @example 10
   */
  limit?: number;
  
  /**
   * Number of items to skip (alternative to page)
   * Used for offset-based pagination
   * @example 20
   */
  skip?: number;
  
  /**
   * Cursor-based pagination identifier
   * Used for cursor-based pagination when preferred over offset-based pagination
   * @example "YXJyYXljb25uZWN0aW9uOjIw"
   */
  cursor?: string;
}

/**
 * Standard metadata interface for pagination responses
 * Contains information about the pagination state
 */
export interface PaginationMeta {
  /**
   * Current page number (1-based)
   */
  currentPage: number;
  
  /**
   * Number of items per page
   */
  itemsPerPage: number;
  
  /**
   * Total number of items across all pages
   */
  totalItems: number;
  
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;
  
  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;
}

/**
 * Generic interface for paginated API responses.
 * Used to wrap any data type with standardized pagination metadata.
 * 
 * @typeParam T - The type of items being paginated
 * 
 * Usage example:
 * ```
 * return {
 *   data: users,
 *   meta: {
 *     currentPage: 1,
 *     itemsPerPage: 10,
 *     totalItems: 50,
 *     totalPages: 5,
 *     hasNextPage: true,
 *     hasPreviousPage: false
 *   }
 * } as PaginatedResponse<User>;
 * ```
 */
export interface PaginatedResponse<T> {
  /**
   * Array of items for the current page
   */
  data: T[];
  
  /**
   * Pagination metadata
   */
  meta: PaginationMeta;
}