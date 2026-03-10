import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginatedResponse, PaginationDto, PaginationMeta } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { Service } from '@app/shared/interfaces/service.interface';
import { Injectable, HttpStatus } from '@nestjs/common';

import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { ProfilesService } from '../profiles/profiles.service';

// Define interfaces for create and update DTOs
interface CreateAchievementDto extends Partial<Achievement> {}
interface UpdateAchievementDto extends Partial<Achievement> {}

// Define custom filter type that extends FilterDto with journey property
interface AchievementFilterDto extends FilterDto {
    journey?: string;
}

/**
 * Service responsible for managing achievements in the gamification system.
 * Handles CRUD operations and business logic for achievements across all journeys.
 */
@Injectable()
export class AchievementsService implements Service<Achievement, CreateAchievementDto, UpdateAchievementDto> {
    /**
     * Creates an instance of the AchievementsService.
     *
     * @param prisma - PrismaService for database access
     * @param profilesService - Service for managing user game profiles
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly profilesService: ProfilesService
    ) {}

    /**
     * Finds a single achievement by specified criteria
     * @param criteria - Search criteria
     * @returns Promise with achievement or null if not found
     */
    async findOne(criteria: Partial<Achievement>): Promise<Achievement | null> {
        try {
            return await this.prisma.achievement.findFirst({ where: criteria });
        } catch {
            throw new AppException('Failed to find achievement', ErrorType.TECHNICAL, 'GAME_002', { criteria });
        }
    }

    /**
     * Retrieves all achievements with optional filtering and pagination.
     *
     * @param filter - Optional filtering criteria
     * @param pagination - Optional pagination parameters
     * @returns A promise resolving to an object containing items array and total count
     */
    async findAll(
        filter?: AchievementFilterDto,
        pagination?: PaginationDto
    ): Promise<{ items: Achievement[]; total: number }> {
        try {
            // Set default pagination if not provided
            const page = pagination?.page || 1;
            const limit = pagination?.limit || 20;
            const skip = (page - 1) * limit;

            // Build the where clause with filters
            const where: Record<string, unknown> = {};

            // Apply journey filter if provided
            if (filter?.journey) {
                where['journey'] = filter.journey;
            }

            // Apply where conditions if provided
            if (filter?.where) {
                Object.assign(where, filter.where);
            }

            // Build orderBy clause
            let orderBy: Record<string, string> = { title: 'asc' };
            if (filter?.orderBy) {
                const entries = Object.entries(filter.orderBy);
                if (entries.length > 0) {
                    orderBy = {};
                    entries.forEach(([key, direction]) => {
                        orderBy[key] = (direction as string).toLowerCase();
                    });
                }
            }

            // Get total count for pagination
            const totalItems = await this.prisma.achievement.count({ where });

            // Execute query with pagination
            const achievements = await this.prisma.achievement.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            });

            // Return standardized response with expected properties for the Service interface
            return {
                items: achievements,
                total: totalItems,
            };
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }
            throw new AppException('Failed to retrieve achievements', ErrorType.TECHNICAL, 'GAME_002', { filter });
        }
    }

    /**
     * Creates a paginated response for achievements
     *
     * @param achievements - The list of achievements
     * @param total - Total number of achievements
     * @param page - Current page number
     * @param limit - Page size
     * @returns A paginated response with the proper structure
     */
    private createPaginatedResponse(
        achievements: Achievement[],
        total: number,
        page: number,
        limit: number
    ): PaginatedResponse<Achievement> {
        const totalPages = Math.ceil(total / limit);

        const meta: PaginationMeta = {
            total,
            limit,
            offset: (page - 1) * limit,
            page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };

        return {
            data: achievements,
            meta,
        };
    }

    /**
     * Gets paginated achievements with proper response structure
     *
     * @param filter - Optional filtering criteria
     * @param pagination - Optional pagination parameters
     * @returns A properly structured paginated response
     */
    async getPaginatedAchievements(
        filter?: AchievementFilterDto,
        pagination?: PaginationDto
    ): Promise<PaginatedResponse<Achievement>> {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;

        const { items: achievements, total } = await this.findAll(filter, pagination);

        return this.createPaginatedResponse(achievements, total, page, limit);
    }

    /**
     * Retrieves a single achievement by its ID.
     *
     * @param id - The unique identifier of the achievement
     * @returns A promise resolving to the found achievement
     * @throws AppException if the achievement is not found
     */
    async findById(id: string): Promise<Achievement> {
        try {
            const achievement = await this.prisma.achievement.findUnique({ where: { id } });

            if (!achievement) {
                throw new AppException(
                    `Achievement with ID ${id} not found`,
                    ErrorType.BUSINESS,
                    'GAME_004',
                    { id },
                    HttpStatus.NOT_FOUND
                );
            }

            return achievement;
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(`Failed to retrieve achievement with ID ${id}`, ErrorType.TECHNICAL, 'GAME_002', {
                id,
            });
        }
    }

    /**
     * Creates a new achievement.
     *
     * @param achievementData - The data for the new achievement
     * @returns A promise resolving to the created achievement
     * @throws AppException if creation fails
     */
    async create(achievementData: CreateAchievementDto): Promise<Achievement> {
        try {
            return await this.prisma.achievement.create({
                data: achievementData as Parameters<typeof this.prisma.achievement.create>[0]['data'],
            });
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }
            throw new AppException('Failed to create achievement', ErrorType.TECHNICAL, 'GAME_003', {
                achievementData,
            });
        }
    }

    /**
     * Updates an existing achievement by its ID.
     *
     * @param id - The unique identifier of the achievement to update
     * @param achievementData - The data to update the achievement with
     * @returns A promise resolving to the updated achievement
     * @throws AppException if the achievement is not found or update fails
     */
    async update(id: string, achievementData: UpdateAchievementDto): Promise<Achievement> {
        try {
            // First, verify the achievement exists
            await this.findById(id);

            // Update the achievement
            return await this.prisma.achievement.update({
                where: { id },
                data: achievementData as Parameters<typeof this.prisma.achievement.update>[0]['data'],
            });
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(`Failed to update achievement with ID ${id}`, ErrorType.TECHNICAL, 'GAME_005', {
                id,
                achievementData,
            });
        }
    }

    /**
     * Deletes an achievement by its ID.
     *
     * @param id - The unique identifier of the achievement to delete
     * @returns A promise resolving to true if deleted, false otherwise
     * @throws AppException if the achievement is not found or deletion fails
     */
    async delete(id: string): Promise<boolean> {
        try {
            // First, verify the achievement exists
            await this.findById(id);

            // Delete the achievement
            await this.prisma.achievement.delete({ where: { id } });
            return true;
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(`Failed to delete achievement with ID ${id}`, ErrorType.TECHNICAL, 'GAME_006', {
                id,
            });
        }
    }

    /**
     * Counts achievements matching the provided filter.
     *
     * @param filter - Optional filtering criteria
     * @returns A promise resolving to the count of matching achievements
     */
    async count(filter?: AchievementFilterDto): Promise<number> {
        try {
            const where: Record<string, unknown> = {};

            // Apply journey filter if provided
            if (filter?.journey) {
                where['journey'] = filter.journey;
            }

            // Apply where conditions if provided
            if (filter?.where) {
                Object.assign(where, filter.where);
            }

            return await this.prisma.achievement.count({ where });
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }
            throw new AppException('Failed to count achievements', ErrorType.TECHNICAL, 'GAME_007', { filter });
        }
    }

    /**
     * Unlocks an achievement for a user.
     *
     * @param userId - The ID of the user
     * @param achievementId - The ID of the achievement to unlock
     * @returns A promise resolving to the user achievement
     * @throws AppException if the achievement doesn't exist or is already unlocked
     */
    async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
        try {
            // Find the achievement
            const achievement = await this.findById(achievementId);

            // Get the user's game profile
            const userProfile = await this.profilesService.findById(userId);

            // Check if the user already has this achievement
            const existingUserAchievement = await this.prisma.userAchievement.findUnique({
                where: {
                    profileId_achievementId: {
                        profileId: userProfile.id,
                        achievementId: achievement.id,
                    },
                },
            });

            // If user already has this achievement unlocked, return it
            if (existingUserAchievement && existingUserAchievement.unlocked) {
                return existingUserAchievement;
            }

            // If user has progress on this achievement but hasn't unlocked it yet
            if (existingUserAchievement) {
                const updatedAchievement = await this.prisma.userAchievement.update({
                    where: {
                        profileId_achievementId: {
                            profileId: userProfile.id,
                            achievementId: achievement.id,
                        },
                    },
                    data: {
                        unlocked: true,
                        unlockedAt: new Date(),
                        progress: 100,
                    },
                });

                // Award XP for unlocking the achievement
                await this.profilesService.update(userId, {
                    xp: userProfile.xp + achievement.xpReward,
                });

                return updatedAchievement;
            }

            // Create a new user achievement record
            const savedAchievement = await this.prisma.userAchievement.create({
                data: {
                    profileId: userProfile.id,
                    achievementId: achievement.id,
                    unlocked: true,
                    unlockedAt: new Date(),
                    progress: 100,
                },
            });

            // Award XP for unlocking the achievement
            await this.profilesService.update(userId, {
                xp: userProfile.xp + achievement.xpReward,
            });

            return savedAchievement;
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }

            throw new AppException(
                `Failed to unlock achievement ${achievementId} for user ${userId}`,
                ErrorType.TECHNICAL,
                'GAME_009',
                { userId, achievementId }
            );
        }
    }

    /**
     * Finds achievements by journey type.
     *
     * @param journey - The journey identifier ('health', 'care', 'plan')
     * @param pagination - Optional pagination parameters
     * @returns A promise resolving to a paginated response of achievements
     */
    async findByJourney(journey: string, pagination?: PaginationDto): Promise<PaginatedResponse<Achievement>> {
        const { items, total } = await this.findAll({ journey, where: {} }, pagination);
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;

        return this.createPaginatedResponse(items, total, page, limit);
    }

    /**
     * Finds achievements by their XP reward value.
     *
     * @param xpReward - The XP value to search for
     * @param pagination - Optional pagination parameters
     * @returns A promise resolving to a paginated response of achievements
     */
    async findByXpReward(xpReward: number, pagination?: PaginationDto): Promise<PaginatedResponse<Achievement>> {
        const { items, total } = await this.findAll({ where: { xpReward } }, pagination);
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;

        return this.createPaginatedResponse(items, total, page, limit);
    }

    /**
     * Searches achievements by title or description.
     *
     * @param searchTerm - The text to search for
     * @param pagination - Optional pagination parameters
     * @returns A promise resolving to a paginated response of matching achievements
     */
    async search(searchTerm: string, pagination?: PaginationDto): Promise<PaginatedResponse<Achievement>> {
        try {
            const page = pagination?.page || 1;
            const limit = pagination?.limit || 20;
            const skip = (page - 1) * limit;

            const where = {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' as const } },
                    { description: { contains: searchTerm, mode: 'insensitive' as const } },
                ],
            };

            const totalItems = await this.prisma.achievement.count({ where });

            const achievements = await this.prisma.achievement.findMany({
                where,
                skip,
                take: limit,
                orderBy: { title: 'asc' },
            });

            return this.createPaginatedResponse(achievements, totalItems, page, limit);
        } catch (error: unknown) {
            if (error instanceof AppException) {
                throw error;
            }
            throw new AppException('Failed to search achievements', ErrorType.TECHNICAL, 'GAME_008', { searchTerm });
        }
    }
}
