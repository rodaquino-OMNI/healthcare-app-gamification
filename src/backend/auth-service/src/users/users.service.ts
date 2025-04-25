import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { hash, compare } from 'bcrypt'; // bcrypt@5.0.0+

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'src/backend/shared/src/interfaces/repository.interface';
import { AppException } from 'src/backend/shared/src/exceptions/exceptions.types';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { PaginationDto } from 'src/backend/shared/src/dto/pagination.dto';
import { FilterDto } from 'src/backend/shared/src/dto/filter.dto';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';

/**
 * Service class for managing users.
 */
@Injectable()
export class UsersService {
  /**
   * Initializes the UsersService.
   * @param prisma Prisma service for database operations
   * @param logger Logger service for logging
   * @param permissionsService Service for managing permissions
   * @param rolesService Service for managing roles
   */
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
    private permissionsService: PermissionsService,
    private rolesService: RolesService
  ) {
    // Sets the logger context to 'UsersService'.
  }

  /**
   * Creates a new user.
   * @param createUserDto Data for creating a new user
   * @returns The newly created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`, 'UsersService');
    
    // Hash the password using bcrypt's hash function.
    const hashedPassword = await hash(createUserDto.password, 10);
    
    // Create the user in the database using Prisma.
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        phone: createUserDto.phone,
        cpf: createUserDto.cpf
      }
    });
    
    // Assign default roles and permissions for the user.
    try {
      // Get default user role (typically 'User')
      const defaultRole = await this.prisma.role.findFirst({
        where: { isDefault: true }
      });
      
      if (defaultRole) {
        await this.assignRole(user.id, defaultRole.id.toString());
      }
      
      // Add journey-specific default permissions
      // health:metrics:read, care:appointment:create, plan:coverage:read
      // Implementation would use permissionsService.assignPermission
    } catch (error) {
      this.logger.error(`Failed to assign default roles to user ${user.id}`, error.stack, 'UsersService');
      // Continue, as the user is still created successfully
    }
    
    // Return the created user without the password.
    const { password, ...result } = user;
    return result as User;
  }

  /**
   * Retrieves all users, with optional filtering and pagination.
   * @param paginationDto Pagination parameters
   * @param filterDto Filtering parameters
   * @returns A list of users.
   */
  async findAll(paginationDto?: PaginationDto, filterDto?: FilterDto): Promise<User[]> {
    this.logger.log('Finding all users', 'UsersService');
    
    // Retrieve all users from the database using Prisma, applying pagination and filtering if provided.
    const users = await this.prisma.user.findMany({
      skip: paginationDto?.skip || (paginationDto?.page ? (paginationDto.page - 1) * (paginationDto.limit || 10) : undefined),
      take: paginationDto?.limit,
      where: filterDto?.where,
      orderBy: filterDto?.orderBy,
      include: filterDto?.include
    });
    
    // Remove passwords from results for security
    return users.map(user => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  /**
   * Retrieves a user by their ID.
   * @param id The user ID
   * @returns The user if found.
   */
  async findOne(id: string): Promise<User> {
    this.logger.log(`Finding user by ID: ${id}`, 'UsersService');
    
    // Retrieve the user from the database using Prisma.
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true }
    });
    
    // If the user is not found, throw a NotFoundException.
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Remove password from result for security
    const { password, ...result } = user;
    return result as User;
  }

  /**
   * Retrieves a user by their email address.
   * @param email The user's email
   * @returns The user if found.
   */
  async findByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user by email: ${email}`, 'UsersService');
    
    // Retrieve the user from the database using Prisma with email filter.
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true }
    });
    
    // If the user is not found, throw a NotFoundException.
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user as User;
  }

  /**
   * Updates an existing user.
   * @param id The user ID
   * @param updateUserDto Data for updating the user
   * @returns The updated user.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`, 'UsersService');
    
    // If password is included, hash it using bcrypt's hash function.
    let dataToUpdate = { ...updateUserDto };
    if (updateUserDto.password) {
      dataToUpdate.password = await hash(updateUserDto.password, 10);
    }
    
    // Update the user in the database using Prisma.
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      include: { roles: true }
    });
    
    // Remove password from result for security
    const { password, ...result } = updatedUser;
    return result as User;
  }

  /**
   * Deletes a user by their ID.
   * @param id The user ID
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`, 'UsersService');
    
    // Delete the user from the database using Prisma.
    await this.prisma.user.delete({
      where: { id }
    });
  }

  /**
   * Validates a user's credentials for authentication.
   * @param email The user's email
   * @param password The user's password
   * @returns The authenticated user if credentials are valid.
   */
  async validateCredentials(email: string, password: string): Promise<User> {
    this.logger.log(`Validating credentials for user: ${email}`, 'UsersService');
    
    // Retrieve the user by email.
    const user = await this.findByEmail(email);
    
    // Verify the password using bcrypt's compare function.
    const isPasswordValid = await compare(password, user.password);
    
    // If verification fails, throw a BadRequestException.
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    
    // Return the authenticated user without the password.
    const { password: _, ...result } = user;
    return result as User;
  }

  /**
   * Assigns a role to a user.
   * @param userId The user ID
   * @param roleId The role ID
   * @returns The updated user with the assigned role.
   */
  async assignRole(userId: string, roleId: string): Promise<User> {
    this.logger.log(`Assigning role ${roleId} to user ${userId}`, 'UsersService');
    
    // Use rolesService to validate the role exists.
    await this.rolesService.findOne(roleId);
    
    // Assign the role to the user using Prisma.
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { id: parseInt(roleId) }
        }
      },
      include: {
        roles: true
      }
    });
    
    // Return the updated user.
    const { password, ...result } = user;
    return result as User;
  }

  /**
   * Removes a role from a user.
   * @param userId The user ID
   * @param roleId The role ID
   * @returns The updated user without the removed role.
   */
  async removeRole(userId: string, roleId: string): Promise<User> {
    this.logger.log(`Removing role ${roleId} from user ${userId}`, 'UsersService');
    
    // Remove the role from the user using Prisma.
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: { id: parseInt(roleId) }
        }
      },
      include: {
        roles: true
      }
    });
    
    // Return the updated user.
    const { password, ...result } = user;
    return result as User;
  }
}