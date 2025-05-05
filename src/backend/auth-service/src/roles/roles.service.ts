import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Repository } from '@app/shared/interfaces/repository.interface';
import { AppException } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { PrismaService } from '@app/shared/database/prisma.service';

/**
 * Service class for managing roles.
 */
@Injectable()
export class RolesService {
  /**
   * Initializes the RolesService.
   * @param prisma Prisma service for database operations
   * @param logger Logger service for logging
   */
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService
  ) {
    // Sets the logger context to 'RolesService'.
  }

  /**
   * Creates a new role.
   * @param createRoleDto The role creation data
   * @returns The newly created role.
   */
  async create(createRoleDto: any): Promise<Role> {
    // Logs the creation attempt.
    this.logger.log(`Creating role: ${createRoleDto.name}`);
    
    // Creates the role using Prisma.
    const role = await this.prisma.role.create({
      data: createRoleDto,
      include: { permissions: true }
    });
    
    // Returns the created role.
    return role;
  }

  /**
   * Retrieves all roles, with optional filtering and pagination.
   * @param paginationDto Pagination parameters
   * @param filterDto Filtering parameters
   * @returns A list of roles.
   */
  async findAll(paginationDto: PaginationDto, filterDto: FilterDto): Promise<Role[]> {
    // Logs the attempt to find all roles.
    this.logger.log('Finding all roles');
    
    // Retrieves all roles from the database using Prisma, applying pagination and filtering if provided.
    const roles = await this.prisma.role.findMany({
      skip: paginationDto?.skip,
      take: paginationDto?.limit,
      where: filterDto?.where,
      orderBy: filterDto?.orderBy,
      include: filterDto?.include || { permissions: true }
    });
    
    // Returns the list of roles.
    return roles;
  }

  /**
   * Retrieves a role by its ID.
   * @param id The role ID
   * @returns The role if found.
   */
  async findOne(id: string): Promise<Role> {
    // Logs the attempt to find a role by ID.
    this.logger.log(`Finding role by ID: ${id}`);
    
    // Retrieves the role from the database using Prisma.
    const role = await this.prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: { permissions: true }
    });
    
    // If the role is not found, throws a NotFoundException.
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    
    // Returns the role.
    return role;
  }

  /**
   * Updates an existing role.
   * @param id The role ID
   * @param updateRoleDto The role update data
   * @returns The updated role.
   */
  async update(id: string, updateRoleDto: any): Promise<Role> {
    // Logs the attempt to update a role.
    this.logger.log(`Updating role with ID: ${id}`);
    
    // Updates the role in the database using Prisma.
    const role = await this.prisma.role.update({
      where: { id: parseInt(id) },
      data: updateRoleDto,
      include: { permissions: true }
    });
    
    // Returns the updated role.
    return role;
  }

  /**
   * Deletes a role by its ID.
   * @param id The role ID
   */
  async remove(id: string): Promise<void> {
    // Logs the attempt to remove a role.
    this.logger.log(`Removing role with ID: ${id}`);
    
    // Deletes the role from the database using Prisma.
    await this.prisma.role.delete({
      where: { id: parseInt(id) }
    });
  }
}