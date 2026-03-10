import { PrismaService } from '@app/shared/database/prisma.service';
import { PaginationDto, PaginatedResponse } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';

/**
 * Service that handles user management operations
 */
@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService
    ) {}

    /**
     * Creates a new user
     *
     * @param createUserDto The user creation data
     * @returns The created user without sensitive information
     */
    async create(createUserDto: CreateUserDto): Promise<Record<string, unknown>> {
        this.logger.log(`Creating user with email: ${createUserDto.email}`, 'UsersService');

        try {
            // Check if user already exists with the provided email
            const existingUser = await this.prisma.user.findUnique({
                where: { email: createUserDto.email },
            });

            if (existingUser) {
                throw new AppException('User with this email already exists', ErrorType.VALIDATION, 'USER_001');
            }

            // Hash the password before storing
            const hashedPassword = await hash(createUserDto.password, 10);

            // Create the user in the database
            const user = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    name: createUserDto.name,
                    password: hashedPassword,
                    phone: createUserDto.phone,
                    cpf: createUserDto.cpf,
                },
            });

            // Assign default role to the user
            try {
                const defaultRole = await this.prisma.role.findFirst({
                    where: { name: 'user' },
                });

                if (defaultRole) {
                    await this.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            roles: { connect: { id: defaultRole.id } },
                        },
                    });
                }
            } catch (error: unknown) {
                const errorStack = error instanceof Error ? error.stack : '';
                this.logger.error(`Failed to assign default roles to user ${user.id}`, errorStack, 'UsersService');
                // Don't fail the user creation if role assignment fails
            }

            return this.sanitizeUser(user);
        } catch (error: unknown) {
            this.logger.error(
                `Failed to create user`,
                error instanceof Error ? error.stack : 'Unknown error',
                'UsersService'
            );
            throw error;
        }
    }

    /**
     * Gets a paginated list of users
     *
     * @param paginationDto Pagination parameters
     * @param filterDto Filter parameters
     * @returns Paginated list of users without sensitive information
     */
    async findAll(
        paginationDto?: PaginationDto,
        filterDto?: UserFilterDto
    ): Promise<PaginatedResponse<Record<string, unknown>>> {
        this.logger.log('Finding all users', 'UsersService');

        // Build where condition based on filter
        const where: Record<string, unknown> = {};
        if (filterDto?.search) {
            where.OR = [
                { name: { contains: filterDto.search, mode: 'insensitive' } },
                { email: { contains: filterDto.search, mode: 'insensitive' } },
            ];
        }

        const users = await this.prisma.user.findMany({
            where,
            skip:
                paginationDto?.skip ||
                (paginationDto?.page ? (paginationDto.page - 1) * (paginationDto.limit || 10) : undefined),
            take: paginationDto?.limit || 10,
            include: {
                roles: true,
            },
        });
        const totalUsers = await this.prisma.user.count({ where });

        // Sanitize user data before returning
        return {
            data: users.map((user) => {
                return this.sanitizeUser(user);
            }),
            meta: {
                total: totalUsers,
                page: paginationDto?.page || 1,
                limit: paginationDto?.limit || 10,
                totalPages: Math.ceil(totalUsers / (paginationDto?.limit || 10)),
                hasNext: (paginationDto?.page || 1) < Math.ceil(totalUsers / (paginationDto?.limit || 10)),
                hasPrev: (paginationDto?.page || 1) > 1,
                offset:
                    paginationDto?.skip ||
                    (paginationDto?.page ? (paginationDto.page - 1) * (paginationDto.limit || 10) : 0),
            },
        };
    }

    /**
     * Gets a single user by ID
     *
     * @param id The ID of the user to retrieve
     * @returns The user without sensitive information
     */
    async findOne(id: string): Promise<Record<string, unknown>> {
        this.logger.log(`Finding user with ID: ${id}`, 'UsersService');

        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: true,
            },
        });

        if (!user) {
            throw new AppException('User not found', ErrorType.NOT_FOUND, 'USER_002', { id });
        }

        return this.sanitizeUser(user);
    }

    /**
     * Updates a user's information
     *
     * @param id The ID of the user to update
     * @param updateUserDto The data to update
     * @returns The updated user without sensitive information
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<Record<string, unknown>> {
        this.logger.log(`Updating user with ID: ${id}`, 'UsersService');

        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new AppException('User not found', ErrorType.NOT_FOUND, 'USER_003', { id });
        }

        // Prepare the data to update
        const dataToUpdate: Record<string, unknown> = {
            name: updateUserDto.name,
            email: updateUserDto.email,
            phone: updateUserDto.phone,
            cpf: updateUserDto.cpf,
        };

        // If password is provided, hash it before storing
        if (updateUserDto.password) {
            dataToUpdate.password = await hash(updateUserDto.password, 10);
        }

        // Update the user in the database
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dataToUpdate,
            include: {
                roles: true,
            },
        });

        return this.sanitizeUser(updatedUser);
    }

    /**
     * Deletes a user
     *
     * @param id The ID of the user to delete
     */
    async remove(id: string): Promise<void> {
        this.logger.log(`Removing user with ID: ${id}`, 'UsersService');

        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new AppException('User not found', ErrorType.NOT_FOUND, 'USER_004', { id });
        }

        await this.prisma.user.delete({
            where: { id },
        });
    }

    /**
     * Assigns roles to a user
     *
     * @param userId The ID of the user
     * @param roleIds Array of role IDs to assign
     */
    async assignRoles(userId: string, roleIds: number[]): Promise<void> {
        this.logger.log(`Assigning roles to user with ID: ${userId}`, 'UsersService');

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppException('User not found', ErrorType.NOT_FOUND, 'USER_005', { id: userId });
        }

        // Update user's roles using implicit many-to-many connect/set
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                roles: {
                    set: roleIds.map((roleId) => ({ id: roleId })),
                },
            },
        });
    }

    /**
     * Validates a user's credentials for authentication
     *
     * @param email User's email
     * @param password User's password
     * @returns The user if credentials are valid
     */
    async validateCredentials(email: string, password: string): Promise<Record<string, unknown>> {
        this.logger.log(`Validating credentials for user with email: ${email}`, 'UsersService');

        const user = await this.prisma.user.update({
            where: { email },
            data: {
                // Update last login date or other auditing info
            },
            include: {
                roles: true,
            },
        });

        if (!user) {
            throw new AppException('Invalid email or password', ErrorType.VALIDATION, 'USER_006');
        }

        // Compare the provided password with the stored hash
        const passwordValid = await compare(password, user.password);

        if (!passwordValid) {
            throw new AppException('Invalid email or password', ErrorType.VALIDATION, 'USER_007');
        }

        return this.sanitizeUser(user);
    }

    /**
     * Removes sensitive information from the user object
     *
     * @param user The user to sanitize
     * @returns The user without sensitive information
     */
    private sanitizeUser(user: Record<string, unknown>): Record<string, unknown> {
        const { password: _password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
