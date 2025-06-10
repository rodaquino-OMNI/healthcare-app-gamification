/**
 * Type declarations for the TemplatesService
 */

import { NotificationTemplate } from './notification';

export interface TemplatesService {
  /**
   * Find a template by its code
   */
  findByCode(code: string): Promise<NotificationTemplate>;
  
  /**
   * Find all templates with pagination and filtering
   */
  findAll(filter?: any, pagination?: any): Promise<{
    data: NotificationTemplate[];
    total: number;
    page: number;
    limit: number;
  }>;
  
  /**
   * Find a template by ID
   */
  findOne(id: string): Promise<NotificationTemplate>;
  
  /**
   * Create a new template
   */
  create(createTemplateDto: any): Promise<NotificationTemplate>;
  
  /**
   * Update an existing template
   */
  update(id: string, updateTemplateDto: any): Promise<NotificationTemplate>;
  
  /**
   * Delete a template
   */
  remove(id: string): Promise<boolean>;
}