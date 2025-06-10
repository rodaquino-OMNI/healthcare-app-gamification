import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for pagination parameters in list operations
 */
export class PaginationDto {
  /**
   * Current page number (1-based)
   * @default 1
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  /**
   * Number of items per page
   * @default 10
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  /**
   * Number of items to skip
   * Used as an alternative to page/limit
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number;
}

/**
 * Standard pagination metadata returned with paginated results
 */
export interface PaginationMeta {
  /**
   * Total number of items across all pages
   * @example 100
   */
  total: number;

  /**
   * Number of items per page
   * @example 10
   */
  limit: number;

  /**
   * Offset of the current page
   * @example 20
   */
  offset: number;

  /**
   * Current page number
   * @example 3
   */
  page: number;

  /**
   * Total number of pages
   * @example 10
   */
  totalPages: number;

  /**
   * Whether there is a next page
   * @example true
   */
  hasNext: boolean;

  /**
   * Whether there is a previous page
   * @example true
   */
  hasPrev: boolean;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /**
   * The data items for the current page
   */
  data: T[];
  
  /**
   * Pagination metadata
   */
  meta: PaginationMeta;
}