import { FilterDto } from '../dto/filter.dto';
import { PaginationDto } from '../dto/pagination.dto';

/**
 * Generic service interface that defines standard CRUD operations
 * @template T - Entity type
 * @template CreateDto - Create DTO type
 * @template UpdateDto - Update DTO type
 * @template ID - Entity ID type (usually string or number)
 */
export interface Service<T, CreateDto, UpdateDto, ID = string> {
  /**
   * Find all entities with optional filtering and pagination
   * @param filter - Filter criteria
   * @param pagination - Pagination options
   * @returns Promise with array of entities and total count
   */
  findAll(filter?: FilterDto, pagination?: PaginationDto): Promise<{ items: T[], total: number }>;
  
  /**
   * Find a single entity by ID
   * @param id - Entity ID
   * @returns Promise with entity
   */
  findById(id: ID): Promise<T>;
  
  /**
   * Find a single entity by specified criteria
   * @param criteria - Search criteria
   * @returns Promise with entity or null if not found
   */
  findOne(criteria: Partial<T>): Promise<T | null>;
  
  /**
   * Create a new entity
   * @param data - Entity data
   * @returns Promise with created entity
   */
  create(data: CreateDto): Promise<T>;
  
  /**
   * Update an existing entity
   * @param id - Entity ID
   * @param data - Updated entity data
   * @returns Promise with updated entity
   */
  update(id: ID, data: UpdateDto): Promise<T>;
  
  /**
   * Delete an entity by ID
   * @param id - Entity ID
   * @returns Promise with boolean indicating success
   */
  delete(id: ID): Promise<boolean>;
}