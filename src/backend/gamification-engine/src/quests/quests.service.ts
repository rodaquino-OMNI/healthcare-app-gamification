/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common'; // @nestjs/common ^9.0.0

import { Quest } from './entities/quest.entity';
import { UserQuest } from './entities/user-quest.entity';
import { AchievementsService } from '../achievements/achievements.service';
import { ProfilesService } from '../profiles/profiles.service';

/**
 * Service for managing quests.
 */
@Injectable()
export class QuestsService {
    /**
     * Injects PrismaService, ProfilesService, AchievementsService, KafkaService and LoggerService.
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly profilesService: ProfilesService,
        private readonly achievementsService: AchievementsService,
        private readonly kafkaService: KafkaService,
        private readonly logger: LoggerService
    ) {}

    /**
     * Retrieves all quests.
     * @returns A promise that resolves to an array of quests.
     */
    async findAll(): Promise<Quest[]> {
        try {
            return await this.prisma.quest.findMany();
        } catch (error: any) {
            this.logger.error('Failed to retrieve quests', error?.stack, 'QuestsService');
            throw new AppException('Failed to retrieve quests', ErrorType.TECHNICAL, 'GAME_009', {}, error);
        }
    }

    /**
     * Retrieves a single quest by its ID.
     * @param id The unique identifier of the quest.
     * @returns A promise that resolves to a single quest.
     */
    async findOne(id: string): Promise<Quest> {
        try {
            const quest = await this.prisma.quest.findUnique({ where: { id } });

            if (!quest) {
                throw new NotFoundException(`Quest with ID ${id} not found`);
            }

            return quest;
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error as any;
            }

            this.logger.error(`Failed to retrieve quest with ID ${id}`, error?.stack, 'QuestsService');
            throw new AppException(
                `Failed to retrieve quest with ID ${id}`,
                ErrorType.TECHNICAL,
                'GAME_010',
                { id },
                error
            );
        }
    }

    /**
     * Starts a quest for a user.
     * @param userId The ID of the user.
     * @param questId The ID of the quest to start.
     * @returns A promise that resolves to the created UserQuest.
     */
    async startQuest(userId: string, questId: string): Promise<UserQuest> {
        try {
            // Get the user's game profile
            const profile = await this.profilesService.findById(userId);

            // Get the quest
            const quest = await this.findOne(questId);

            // Check if the user already has this quest in progress
            const existingUserQuest = await this.prisma.userQuest.findFirst({
                where: {
                    profileId: profile.id,
                    questId: questId,
                },
            });

            if (existingUserQuest) {
                return existingUserQuest;
            }

            // Create a new UserQuest instance
            const savedUserQuest = await this.prisma.userQuest.create({
                data: {
                    profileId: profile.id,
                    questId: quest.id,
                    progress: 0,
                    completed: false,
                },
                include: {
                    quest: true,
                },
            });

            // Log and publish event
            this.logger.log(`User ${userId} started quest ${questId}`, 'QuestsService');
            await this.kafkaService.produce('quest.started', {
                userId,
                questId,
                timestamp: new Date().toISOString(),
            });

            return savedUserQuest;
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error as any;
            }

            this.logger.error(`Failed to start quest ${questId} for user ${userId}`, error?.stack, 'QuestsService');
            throw new AppException(
                `Failed to start quest ${questId} for user ${userId}`,
                ErrorType.TECHNICAL,
                'GAME_011',
                { userId, questId },
                error
            );
        }
    }

    /**
     * Completes a quest for a user.
     * @param userId The ID of the user.
     * @param questId The ID of the quest to complete.
     * @returns A promise that resolves to the updated UserQuest.
     */
    async completeQuest(userId: string, questId: string): Promise<UserQuest> {
        try {
            // Get the user's game profile
            const profile = await this.profilesService.findById(userId);

            // Get the user quest
            const userQuest = await this.prisma.userQuest.findFirst({
                where: {
                    profileId: profile.id,
                    questId: questId,
                },
                include: {
                    quest: true,
                },
            });

            if (!userQuest) {
                throw new NotFoundException(`User ${userId} has not started quest ${questId}`);
            }

            if (userQuest.completed) {
                return userQuest; // Already completed
            }

            // Update the UserQuest to mark it as completed
            const updatedUserQuest = await this.prisma.userQuest.update({
                where: { profileId_questId: { profileId: profile.id, questId } },
                data: {
                    progress: 100,
                    completed: true,
                },
                include: {
                    quest: true,
                },
            });

            // Award XP to the user
            await this.profilesService.update(userId, {
                xp: profile.xp + userQuest.quest.xpReward,
            });

            // Check if completing this quest unlocks any achievements
            // This is a placeholder for actual achievement checking logic
            // which would likely be implemented in the AchievementsService
            const unlockedAchievements = await this.achievementsService.findByJourney(userQuest.quest.journey);

            // Log and publish event
            this.logger.log(
                `User ${userId} completed quest ${questId} and earned ${userQuest.quest.xpReward} XP`,
                'QuestsService'
            );
            await this.kafkaService.produce('quest.completed', {
                userId,
                questId,
                xpAwarded: userQuest.quest.xpReward,
                timestamp: new Date().toISOString(),
            });

            return updatedUserQuest;
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error as any;
            }

            this.logger.error(`Failed to complete quest ${questId} for user ${userId}`, error?.stack, 'QuestsService');
            throw new AppException(
                `Failed to complete quest ${questId} for user ${userId}`,
                ErrorType.TECHNICAL,
                'GAME_012',
                { userId, questId },
                error
            );
        }
    }
}
