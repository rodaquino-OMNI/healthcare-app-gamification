/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaService } from '@app/shared/database/prisma.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Reward } from './entities/reward.entity';
import { UserReward } from './entities/user-reward.entity';
import { AchievementsService } from '../achievements/achievements.service';
import { ProfilesService } from '../profiles/profiles.service';

/**
 * Service for managing rewards.
 * Handles the business logic for managing rewards within the gamification engine.
 * It provides methods for creating, retrieving, and distributing rewards to users
 * based on their achievements and progress.
 */
@Injectable()
export class RewardsService {
    /**
     * Injects PrismaService and other services.
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly profilesService: ProfilesService,
        private readonly kafkaService: KafkaService,
        private readonly logger: LoggerService,
        private readonly achievementsService: AchievementsService,
        private readonly configService: ConfigService
    ) {}

    /**
     * Creates a new reward.
     * @param reward The reward data to create
     * @returns A promise that resolves to the created reward.
     */
    async create(reward: Reward): Promise<Reward> {
        try {
            this.logger.log(`Creating new reward: ${reward.title}`, 'RewardsService');
            return await this.prisma.reward.create({
                data: {
                    title: reward.title,
                    description: reward.description,
                    xpReward: reward.xpReward,
                    icon: reward.icon,
                    journey: reward.journey,
                },
            });
        } catch (error: any) {
            this.logger.error(`Failed to create reward: ${error.message}`, error?.stack, 'RewardsService');
            throw new AppException('Failed to create reward', ErrorType.TECHNICAL, 'REWARD_001', { reward }, error);
        }
    }

    /**
     * Retrieves all rewards.
     * @returns A promise that resolves to an array of rewards.
     */
    async findAll(): Promise<Reward[]> {
        try {
            this.logger.log('Retrieving all rewards', 'RewardsService');
            return await this.prisma.reward.findMany();
        } catch (error: any) {
            this.logger.error(`Failed to retrieve rewards: ${error.message}`, error?.stack, 'RewardsService');
            throw new AppException('Failed to retrieve rewards', ErrorType.TECHNICAL, 'REWARD_002', {}, error);
        }
    }

    /**
     * Retrieves a single reward by its ID.
     * @param id The reward ID to find
     * @returns A promise that resolves to a single reward.
     */
    async findOne(id: string): Promise<Reward> {
        try {
            this.logger.log(`Retrieving reward with ID: ${id}`, 'RewardsService');
            const reward = await this.prisma.reward.findUnique({ where: { id } });

            if (!reward) {
                this.logger.warn(`Reward with ID ${id} not found`, 'RewardsService');
                throw new AppException(`Reward with ID ${id} not found`, ErrorType.BUSINESS, 'REWARD_003', { id });
            }

            return reward;
        } catch (error: any) {
            if (error instanceof AppException) {
                throw error as any;
            }

            this.logger.error(
                `Failed to retrieve reward with ID ${id}: ${error.message}`,
                error?.stack,
                'RewardsService'
            );
            throw new AppException(
                `Failed to retrieve reward with ID ${id}`,
                ErrorType.TECHNICAL,
                'REWARD_004',
                { id },
                error
            );
        }
    }

    /**
     * Grants a reward to a user.
     * @param userId The ID of the user to grant the reward to
     * @param rewardId The ID of the reward to grant
     * @returns A promise that resolves to the granted user reward.
     */
    async grantReward(userId: string, rewardId: string): Promise<UserReward> {
        try {
            this.logger.log(`Granting reward ${rewardId} to user ${userId}`, 'RewardsService');

            // Get user profile
            const profile = await this.profilesService.findById(userId);

            // Get reward
            const reward = await this.findOne(rewardId);

            // Create user reward
            const userReward = new UserReward();
            userReward.profile = profile;
            userReward.reward = reward;
            userReward.earnedAt = new Date();

            // Publish event to Kafka for notification and other systems
            await this.kafkaService.produce(
                'reward-events',
                {
                    type: 'REWARD_GRANTED',
                    userId,
                    rewardId,
                    rewardTitle: reward.title,
                    xpReward: reward.xpReward,
                    journey: reward.journey,
                    timestamp: new Date().toISOString(),
                },
                userId
            );

            this.logger.log(`Successfully granted reward ${reward.title} to user ${userId}`, 'RewardsService');

            return userReward;
        } catch (error: any) {
            this.logger.error(
                `Failed to grant reward ${rewardId} to user ${userId}: ${error.message}`,
                error?.stack,
                'RewardsService'
            );
            throw new AppException(
                'Failed to grant reward',
                ErrorType.TECHNICAL,
                'REWARD_005',
                { userId, rewardId },
                error
            );
        }
    }
}
