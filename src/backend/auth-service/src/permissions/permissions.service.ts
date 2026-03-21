import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';

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
    async create(name: string): Promise<unknown> {
        this.logger.log(`Creating permission: ${name}`, 'PermissionsService');

        try {
            // Create a new permission in the database
            const permission = await this.prisma.permission.create({
                data: {
                    name,
                    description: `Permission for ${name}`,
                },
            });

            return permission;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to create permission: ${message}`,
                stack,
                'PermissionsService'
            );
            throw new AppException(
                'Failed to create permission',
                ErrorType.TECHNICAL,
                'PERM_001',
                {}
            );
        }
    }

    /**
     * Retrieves all permissions
     *
     * @returns All permissions
     */
    async findAll(): Promise<unknown[]> {
        this.logger.log('Retrieving all permissions', 'PermissionsService');

        try {
            // Retrieve all permissions from the database
            const permissions = await this.prisma.permission.findMany({
                orderBy: { name: 'asc' },
            });

            return permissions;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to retrieve permissions: ${message}`,
                stack,
                'PermissionsService'
            );
            throw new AppException(
                'Failed to retrieve permissions',
                ErrorType.TECHNICAL,
                'PERM_002',
                {}
            );
        }
    }

    /**
     * Gets a permission by ID
     *
     * @param id The ID of the permission to retrieve
     * @returns The permission, if found
     */
    async findOne(id: string): Promise<unknown> {
        this.logger.log(`Retrieving permission with ID: ${id}`, 'PermissionsService');

        try {
            // Get the permission from the database
            const permission = await this.prisma.permission.findUnique({
                where: { id: Number(id) },
            });

            return permission;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to retrieve permission: ${message}`,
                stack,
                'PermissionsService'
            );
            throw new AppException(
                'Failed to retrieve permission',
                ErrorType.TECHNICAL,
                'PERM_003',
                {}
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
    async update(id: string, name: string): Promise<unknown> {
        this.logger.log(`Updating permission with ID: ${id}`, 'PermissionsService');

        try {
            // Update the permission in the database
            const updatedPermission = await this.prisma.permission.update({
                where: { id: Number(id) },
                data: {
                    name,
                    description: `Permission for ${name}`,
                },
            });

            return updatedPermission;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to update permission: ${message}`,
                stack,
                'PermissionsService'
            );
            throw new AppException(
                'Failed to update permission',
                ErrorType.TECHNICAL,
                'PERM_004',
                {}
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
                where: { id: Number(id) },
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to delete permission: ${message}`,
                stack,
                'PermissionsService'
            );
            throw new AppException(
                'Failed to delete permission',
                ErrorType.TECHNICAL,
                'PERM_005',
                {}
            );
        }
    }
}
