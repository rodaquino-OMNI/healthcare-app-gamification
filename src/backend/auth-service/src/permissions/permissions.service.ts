import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { Repository } from '@app/shared/interfaces/repository.interface';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { PrismaService } from '@app/shared/database/prisma.service';

/**
 * Service for managing permissions
 */
@Injectable()
export class PermissionsService {
  private readonly logger = new LoggerService();
  
  /**
   * Constructor
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new permission
   * 
   * @param name The name of the permission to create
   * @returns The created permission
   */
  async create(name: string): Promise<any> {
    this.logger.log(`Creating permission: ${name}`, 'PermissionsService');
    
    try {
      // Create a new permission in the database
      const permission = await this.prisma.permission.create({
        data: {
          name,
          description: `Permission for ${name}`
        }
      });
      
      return permission;
    } catch (error: any) {
      this.logger.error(`Failed to create permission: ${error.message}`, error.stack, 'PermissionsService');
      throw new AppException(
        'Failed to create permission',
        ErrorType.TECHNICAL,
        'PERM_001',
        null,
        error as Error
      );
    }
  }

  /**
   * Retrieves all permissions
   * 
   * @returns All permissions
   */
  async findAll(): Promise<any[]> {
    this.logger.log('Retrieving all permissions', 'PermissionsService');
    
    try {
      // Retrieve all permissions from the database
      const permissions = await this.prisma.permission.findMany({
        orderBy: { name: 'asc' }
      });
      
      return permissions;
    } catch (error: any) {
      this.logger.error(`Failed to retrieve permissions: ${error.message}`, error.stack, 'PermissionsService');
      throw new AppException(
        'Failed to retrieve permissions',
        ErrorType.TECHNICAL,
        'PERM_002',
        null,
        error as Error
      );
    }
  }

  /**
   * Gets a permission by ID
   * 
   * @param id The ID of the permission to retrieve
   * @returns The permission, if found
   */
  async findOne(id: string): Promise<any> {
    this.logger.log(`Retrieving permission with ID: ${id}`, 'PermissionsService');
    
    try {
      // Get the permission from the database
      const permission = await this.prisma.permission.findUnique({
        where: { id: Number(id) }
      });
      
      return permission;
    } catch (error: any) {
      this.logger.error(`Failed to retrieve permission: ${error.message}`, error.stack, 'PermissionsService');
      throw new AppException(
        'Failed to retrieve permission',
        ErrorType.TECHNICAL,
        'PERM_003',
        null,
        error as Error
      );
    }
  }

  /**
   * Updates a permission
   * 
   * @param id The ID of the permission to update
   * @param name The new name for the permission
   * @returns The updated permission
   */
  async update(id: string, name: string): Promise<any> {
    this.logger.log(`Updating permission with ID: ${id}`, 'PermissionsService');
    
    try {
      // Update the permission in the database
      const updatedPermission = await this.prisma.permission.update({
        where: { id: Number(id) },
        data: {
          name,
          description: `Permission for ${name}`
        }
      });
      
      return updatedPermission;
    } catch (error: any) {
      this.logger.error(`Failed to update permission: ${error.message}`, error.stack, 'PermissionsService');
      throw new AppException(
        'Failed to update permission',
        ErrorType.TECHNICAL,
        'PERM_004',
        null,
        error as Error
      );
    }
  }

  /**
   * Deletes a permission
   * 
   * @param id The ID of the permission to delete
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting permission with ID: ${id}`, 'PermissionsService');
    
    try {
      // Delete the permission from the database
      await this.prisma.permission.delete({
        where: { id: Number(id) }
      });
    } catch (error: any) {
      this.logger.error(`Failed to delete permission: ${error.message}`, error.stack, 'PermissionsService');
      throw new AppException(
        'Failed to delete permission',
        ErrorType.TECHNICAL,
        'PERM_005',
        null,
        error as Error
      );
    }
  }
}