import { SYS_INTERNAL_SERVER_ERROR } from '@app/shared/constants/error-codes.constants';
import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { NotificationPreference } from './entities/notification-preference.entity';

@Injectable()
export class PreferencesService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Retrieves all notification preferences based on the provided filter and pagination params.
     *
     * @param filter - Optional filtering criteria
     * @param pagination - Optional pagination parameters
     * @returns A promise that resolves to an array of NotificationPreference entities
     */
    findAll(filter?: FilterDto, pagination?: PaginationDto): Promise<NotificationPreference[]> {
        try {
            return this.prisma.notificationPreference.findMany({
                where: filter?.where,
            }) as unknown as Promise<NotificationPreference[]>;
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
    findOne(where: Record<string, unknown>): Promise<NotificationPreference | null> {
        return this.prisma.notificationPreference.findFirst({
            where,
        }) as unknown as Promise<NotificationPreference | null>;
    }

    /**
     * Creates a new notification preference record for a user with default settings.
     *
     * @param userId - The ID of the user
     * @returns A promise that resolves to the newly created NotificationPreference entity
     */
    create(userId: string): Promise<NotificationPreference> {
        try {
            return this.prisma.notificationPreference.create({
                data: { userId },
            }) as unknown as Promise<NotificationPreference>;
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
    update(id: string, data: Partial<NotificationPreference>): Promise<NotificationPreference> {
        try {
            return this.prisma.notificationPreference.update({
                where: { id: parseInt(id) },
                data: data as Prisma.NotificationPreferenceUpdateInput,
            }) as unknown as Promise<NotificationPreference>;
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
