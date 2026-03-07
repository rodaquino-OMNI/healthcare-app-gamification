/* eslint-disable */
import { SYS_INTERNAL_SERVER_ERROR } from '@app/shared/constants/error-codes.constants';
import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { Injectable } from '@nestjs/common';

import { NotificationPreference } from './entities/notification-preference.entity';

@Injectable()
export class PreferencesService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Retrieves all notification preferences based on the provided filter and pagination parameters.
     *
     * @param filter - Optional filtering criteria
     * @param pagination - Optional pagination parameters
     * @returns A promise that resolves to an array of NotificationPreference entities
     */
    async findAll(filter?: FilterDto, pagination?: PaginationDto): Promise<NotificationPreference[]> {
        try {
            return this.prisma.notificationPreference.findMany({
                where: filter?.where,
            }) as unknown as NotificationPreference[];
        } catch (error) {
            throw new AppException(
                'Failed to retrieve notification preferences',
                ErrorType.TECHNICAL,
                SYS_INTERNAL_SERVER_ERROR,
                { filter: filter as unknown, pagination: pagination as unknown }
            );
        }
    }

    /**
     * Finds a single notification preference matching the given criteria.
     *
     * @param where - Filter criteria for finding a preference
     * @returns A promise that resolves to a NotificationPreference or null
     */
    async findOne(where: Record<string, unknown>): Promise<NotificationPreference | null> {
        return this.prisma.notificationPreference.findFirst({ where }) as unknown as NotificationPreference | null;
    }

    /**
     * Creates a new notification preference record for a user with default settings.
     *
     * @param userId - The ID of the user
     * @returns A promise that resolves to the newly created NotificationPreference entity
     */
    async create(userId: string): Promise<NotificationPreference> {
        try {
            return this.prisma.notificationPreference.create({
                data: { userId },
            }) as unknown as NotificationPreference;
        } catch (error) {
            throw new AppException(
                'Failed to create notification preferences',
                ErrorType.TECHNICAL,
                SYS_INTERNAL_SERVER_ERROR,
                { userId }
            );
        }
    }

    /**
     * Updates an existing notification preference record.
     *
     * @param id - The ID of the notification preference record (as string)
     * @param data - Partial notification preference data to update
     * @returns A promise that resolves to the updated NotificationPreference entity
     */
    async update(id: string, data: Partial<NotificationPreference>): Promise<NotificationPreference> {
        try {
            return this.prisma.notificationPreference.update({
                where: { id: parseInt(id) },
                data,
            }) as unknown as NotificationPreference;
        } catch (error) {
            throw new AppException(
                'Failed to update notification preferences',
                ErrorType.TECHNICAL,
                SYS_INTERNAL_SERVER_ERROR,
                { id, data: data as unknown }
            );
        }
    }
}
