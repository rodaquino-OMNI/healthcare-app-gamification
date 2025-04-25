import { Injectable } from '@nestjs/common';
import { Service } from '../../../shared/src/interfaces/service.interface';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { AppException, ErrorType } from '../../../shared/src/exceptions/exceptions.types';
import { Repository } from '../../../shared/src/interfaces/repository.interface';
import { SYS_INTERNAL_SERVER_ERROR } from '../../../shared/src/constants/error-codes.constants';

@Injectable()
export class {{ pascalCase name }}Service {
  constructor(
    private readonly {{ camelCase name }}Repository: Repository<{{ pascalCase name }}>,
    private readonly logger: LoggerService
  ) {}

  /**
   * Creates a new {{ pascalCase name }}.
   * 
   * @param create{{ pascalCase name }}Dto - The DTO for creating a {{ pascalCase name }}
   * @returns The created {{ pascalCase name }}
   */
  async create(create{{ pascalCase name }}Dto: Create{{ pascalCase name }}Dto): Promise<{{ pascalCase name }}> {
    this.logger.log(`Creating new {{ camelCase name }}`, '{{ pascalCase name }}Service');
    
    try {
      const created{{ pascalCase name }} = await this.{{ camelCase name }}Repository.create(create{{ pascalCase name }}Dto);
      this.logger.log(`Successfully created {{ camelCase name }} with id: ${created{{ pascalCase name }}.id}`, '{{ pascalCase name }}Service');
      
      return created{{ pascalCase name }};
    } catch (error) {
      this.logger.error(`Failed to create {{ camelCase name }}: ${error.message}`, error.stack, '{{ pascalCase name }}Service');
      throw new AppException(
        `Failed to create {{ camelCase name }}`,
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        null,
        error
      );
    }
  }

  /**
   * Finds all {{ pascalCase name }}s.
   * 
   * @returns A list of {{ pascalCase name }}s
   */
  async findAll(): Promise<{{ pascalCase name }}[]> {
    this.logger.log('Finding all {{ camelCase name }}s', '{{ pascalCase name }}Service');
    
    try {
      return await this.{{ camelCase name }}Repository.findAll();
    } catch (error) {
      this.logger.error(`Failed to find all {{ camelCase name }}s: ${error.message}`, error.stack, '{{ pascalCase name }}Service');
      throw new AppException(
        `Failed to find all {{ camelCase name }}s`,
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        null,
        error
      );
    }
  }

  /**
   * Finds a {{ pascalCase name }} by ID.
   * 
   * @param id - The ID of the {{ pascalCase name }} to find
   * @returns The found {{ pascalCase name }}
   */
  async findOne(id: string): Promise<{{ pascalCase name }}> {
    this.logger.log(`Finding {{ camelCase name }} with id: ${id}`, '{{ pascalCase name }}Service');
    
    try {
      const {{ camelCase name }} = await this.{{ camelCase name }}Repository.findById(id);
      
      if (!{{ camelCase name }}) {
        throw new AppException(
          `{{ pascalCase name }} with id ${id} not found`,
          ErrorType.BUSINESS,
          'ENTITY_NOT_FOUND',
          { id }
        );
      }
      
      return {{ camelCase name }};
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      
      this.logger.error(`Failed to find {{ camelCase name }}: ${error.message}`, error.stack, '{{ pascalCase name }}Service');
      throw new AppException(
        `Failed to find {{ camelCase name }}`,
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        null,
        error
      );
    }
  }

  /**
   * Updates a {{ pascalCase name }}.
   * 
   * @param id - The ID of the {{ pascalCase name }} to update
   * @param update{{ pascalCase name }}Dto - The DTO for updating the {{ pascalCase name }}
   * @returns The updated {{ pascalCase name }}
   */
  async update(id: string, update{{ pascalCase name }}Dto: Update{{ pascalCase name }}Dto): Promise<{{ pascalCase name }}> {
    this.logger.log(`Updating {{ camelCase name }} with id: ${id}`, '{{ pascalCase name }}Service');
    
    try {
      return await this.{{ camelCase name }}Repository.update(id, update{{ pascalCase name }}Dto);
    } catch (error) {
      this.logger.error(`Failed to update {{ camelCase name }}: ${error.message}`, error.stack, '{{ pascalCase name }}Service');
      throw new AppException(
        `Failed to update {{ camelCase name }}`,
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        null,
        error
      );
    }
  }

  /**
   * Removes a {{ pascalCase name }}.
   * 
   * @param id - The ID of the {{ pascalCase name }} to remove
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Removing {{ camelCase name }} with id: ${id}`, '{{ pascalCase name }}Service');
    
    try {
      const deleted = await this.{{ camelCase name }}Repository.delete(id);
      
      if (!deleted) {
        throw new AppException(
          `{{ pascalCase name }} with id ${id} not found`,
          ErrorType.BUSINESS,
          'ENTITY_NOT_FOUND',
          { id }
        );
      }
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      
      this.logger.error(`Failed to remove {{ camelCase name }}: ${error.message}`, error.stack, '{{ pascalCase name }}Service');
      throw new AppException(
        `Failed to remove {{ camelCase name }}`,
        ErrorType.TECHNICAL,
        SYS_INTERNAL_SERVER_ERROR,
        null,
        error
      );
    }
  }
}