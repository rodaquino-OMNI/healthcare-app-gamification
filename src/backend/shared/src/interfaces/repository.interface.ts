import { FilterDto } from '../../dto/filter.dto';
import { PaginationDto } from '../../dto/pagination.dto';

/**
 * Generic repository interface that provides standardized data access methods
 * across all journey services in the AUSTA SuperApp.
 * 
 * This interface abstracts the underlying data storage implementation details
 * and provides a consistent API for performing CRUD operations.
 * 
 * @typeParam T - The entity type this repository manages
 */
export interface Repository<T> {
  /**
   * Finds an entity by its unique identifier
   * 
   * @param id - The unique identifier of the entity
   * @returns A promise that resolves to the found entity or null if not found
   */
  findById(id: string): Promise<T | null>;
  
  /**
   * Finds all entities that match the given filter
   * 
   * @param filter - Optional filtering criteria
   * @returns A promise that resolves to an array of entities
   */
  findAll(filter?: FilterDto): Promise<T[]>;

  /**
   * Creates a new entity
   * 
   * @param entity - The entity to create (without an ID)
   * @returns A promise that resolves to the created entity with an assigned ID
   */
  create(entity: Omit<T, 'id'>): Promise<T>;

  /**
   * Updates an existing entity
   * 
   * @param id - The unique identifier of the entity to update
   * @param entity - The partial entity containing fields to update
   * @returns A promise that resolves to the updated entity
   */
  update(id: string, entity: Partial<T>): Promise<T>;

  /**
   * Deletes an entity by its unique identifier
   * 
   * @param id - The unique identifier of the entity to delete
   * @returns A promise that resolves to a boolean indicating success
   */
  delete(id: string): Promise<boolean>;
}