import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GameProfile } from '../profiles/entities/game-profile.entity';
import { ProfilesService } from '../profiles/profiles.service';

/**
 * Service for generating and retrieving leaderboard data.
 * Handles the business logic for creating leaderboards based on user XP and achievements
 * within the gamification engine.
 */
@Injectable()
export class LeaderboardService {
    private readonly LEADERBOARD_MAX_ENTRIES: number;
    private readonly LEADERBOARD_TTL: number;

    /**
     * Injects the ProfilesService, RedisService, LoggerService and ConfigService dependencies.
     */
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly redisService: RedisService,
        private readonly logger: LoggerService,
        private readonly configService: ConfigService
    ) {
        this.logger.log('Initializing LeaderboardService', 'LeaderboardService');
        this.LEADERBOARD_MAX_ENTRIES = this.configService.get<number>(
            'gamification.leaderboard.maxEntries',
            100
        );
        this.LEADERBOARD_TTL = this.configService.get<number>(
            'gamification.leaderboard.ttl',
            60 * 5
        ); // 5 minutes default
    }

    /**
     * Retrieves the leaderboard data, either from cache or by calculating it.
     * @param journey The journey to get leaderboard data for (health, care, plan)
     * @returns A promise that resolves to the leaderboard data.
     */
    async getLeaderboard(journey: string): Promise<unknown> {
        try {
            // Create a cache key based on the journey
            const cacheKey = `leaderboard:${journey.toLowerCase()}`;

            // Try to get cached leaderboard data
            const cachedData = await this.redisService.get(cacheKey);

            if (cachedData) {
                this.logger.log(
                    `Retrieved leaderboard from cache: ${cacheKey}`,
                    'LeaderboardService'
                );
                return JSON.parse(cachedData) as unknown;
            }

            // Calculate leaderboard if not in cache
            this.logger.log(
                `Calculating leaderboard for journey: ${journey}`,
                'LeaderboardService'
            );

            // Get user profiles sorted by XP
            const profiles = await this.calculateLeaderboard();

            // Prepare the leaderboard data with ranks
            const leaderboardData = profiles
                .slice(0, this.LEADERBOARD_MAX_ENTRIES)
                .map((profile, index) => ({
                    rank: index + 1,
                    userId: profile.userId,
                    level: profile.level,
                    xp: profile.xp,
                    achievements: profile.achievements?.length || 0,
                }));

            // Cache the leaderboard data with journey-specific TTL
            const ttl = this.redisService.getJourneyTTL
                ? this.redisService.getJourneyTTL(journey)
                : this.LEADERBOARD_TTL;

            await this.redisService.set(cacheKey, JSON.stringify(leaderboardData), ttl);

            this.logger.log(
                `Cached leaderboard for ${ttl} seconds: ${cacheKey}`,
                'LeaderboardService'
            );

            return leaderboardData;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to get leaderboard for ${journey}: ${msg}`,
                stack,
                'LeaderboardService'
            );
            throw error;
        }
    }

    /**
     * Calculates the leaderboard data by retrieving all user profiles and sorting them by XP.
     * @returns A promise that resolves to the leaderboard data.
     */
    private async calculateLeaderboard(): Promise<GameProfile[]> {
        try {
            // Use the ProfilesService to get top profiles sorted by XP
            const profiles = await this.profilesService.getTopProfiles(
                this.LEADERBOARD_MAX_ENTRIES
            );

            return profiles;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
                `Failed to calculate leaderboard: ${msg}`,
                stack,
                'LeaderboardService'
            );
            throw error;
        }
    }
}
