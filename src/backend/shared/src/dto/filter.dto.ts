/**
 * FilterDto - Defines standardized filtering parameters for repository queries
 * across all journey services in the AUSTA SuperApp.
 *
 * This DTO provides a consistent way to filter, sort, and shape query results
 * while maintaining journey-specific context.
 */

/**
 * Type definition for where clause conditions
 * @example { status: 'active', userId: '123' }
 */
export type WhereClause = Record<string, any>;

/**
 * Type definition for order by clause
 * @example { createdAt: 'desc', name: 'asc' }
 */
export type OrderByClause = Record<string, 'asc' | 'desc'>;

/**
 * Type definition for including related entities
 * @example { user: true, appointments: { where: { status: 'active' } } }
 */
export type IncludeClause = Record<string, boolean | Record<string, any>>;

/**
 * Type definition for selecting specific fields
 * @example { id: true, name: true, email: true }
 */
export type SelectClause = Record<string, boolean>;

/**
 * Main filter DTO interface that provides standardized filtering options
 * for repository queries across all journey services.
 */
export interface FilterDto {
  /**
   * Conditions for filtering records
   */
  where?: WhereClause;
  
  /**
   * Sorting criteria for the results
   */
  orderBy?: OrderByClause;
  
  /**
   * Related entities to include in the results
   */
  include?: IncludeClause;
  
  /**
   * Fields to include in the results
   */
  select?: SelectClause;
  
  /**
   * Journey context for the filter (health, care, plan)
   * Allows for journey-specific handling of common queries
   */
  journey?: string;
}