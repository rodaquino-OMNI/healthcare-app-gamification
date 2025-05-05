import { FilterDto } from '../dto/filter.dto';
import { PaginationDto, PaginatedResponse } from '../dto/pagination.dto';

/**
 * Generic Service interface to be implemented by all services across the AUSTA SuperApp.
 * Provides standard methods for CRUD operations and queries with consistent signatures.
 * 
 * This interface supports the journey-based microservices architecture by offering
 * a standardized way to interact with data across all journey contexts.
 * 
 * @typeParam T - The entity type the service manages
 * @typeParam CreateDto - The DTO type for creating entities
 * @typeParam UpdateDto - The DTO type for updating entities
 */
export interface Service<T, CreateDto = any, UpdateDto = any> {
  /**
   * Find an entity by its ID
   * 
   * @param id - The unique identifier of the entity
   * @returns A promise resolving to the found entity or null if not found
   */
  findById(id: string): Promise<T | null>;
  
  /**
   * Find all entities matching the provided filter with pagination
   * 
   * @param pagination - Pagination parameters
   * @param filter - Filter criteria
   * @returns A promise resolving to a paginated response containing the entities
   */
  findAll(pagination?: PaginationDto, filter?: FilterDto): Promise<PaginatedResponse<T>>;
  
  /**
   * Create a new entity
   * 
   * @param data - The data for creating the entity
   * @returns A promise resolving to the created entity
   */
  create(data: CreateDto): Promise<T>;
  
  /**
   * Update an existing entity by its ID
   * 
   * @param id - The unique identifier of the entity to update
   * @param data - The data for updating the entity
   * @returns A promise resolving to the updated entity
   */
  update(id: string, data: UpdateDto): Promise<T>;
  
  /**
   * Delete an entity by its ID
   * 
   * @param id - The unique identifier of the entity to delete
   * @returns A promise resolving to true if deleted, false otherwise
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Count entities matching the provided filter
   * 
   * @param filter - Filter criteria
   * @returns A promise resolving to the count of matching entities
   */
  count(filter?: FilterDto): Promise<number>;
}