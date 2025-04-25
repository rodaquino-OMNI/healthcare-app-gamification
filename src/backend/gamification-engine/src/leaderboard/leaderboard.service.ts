import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 3.1.1
import { ProfilesService } from '../profiles/profiles.service';
import { RedisService } from 'src/backend/shared/src/redis/redis.service';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { GameProfile } from 'src/backend/gamification-engine/src/profiles/entities/game-profile.entity';

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
    private readonly configService: ConfigService,
  ) {
    this.logger.log('Initializing LeaderboardService', 'LeaderboardService');
    this.LEADERBOARD_MAX_ENTRIES = this.configService.get<number>('gamification.leaderboard.maxEntries', 100);
    this.LEADERBOARD_TTL = this.configService.get<number>('gamification.leaderboard.ttl', 60 * 5); // 5 minutes default
  }

  /**
   * Retrieves the leaderboard data, either from cache or by calculating it.
   * @param journey The journey to get leaderboard data for (health, care, plan)
   * @returns A promise that resolves to the leaderboard data.
   */
  async getLeaderboard(journey: string): Promise<any> {
    try {
      // Create a cache key based on the journey
      const cacheKey = `leaderboard:${journey.toLowerCase()}`;
      
      // Try to get cached leaderboard data
      const cachedData = await this.redisService.get(cacheKey);
      
      if (cachedData) {
        this.logger.log(`Retrieved leaderboard from cache: ${cacheKey}`, 'LeaderboardService');
        return JSON.parse(cachedData);
      }
      
      // Calculate leaderboard if not in cache
      this.logger.log(`Calculating leaderboard for journey: ${journey}`, 'LeaderboardService');
      
      // Get user profiles sorted by XP
      const profiles = await this.calculateLeaderboard();
      
      // Prepare the leaderboard data with ranks
      const leaderboardData = profiles.slice(0, this.LEADERBOARD_MAX_ENTRIES).map((profile, index) => ({
        rank: index + 1,
        userId: profile.userId,
        level: profile.level,
        xp: profile.xp,
        achievements: profile.achievements?.length || 0
      }));
      
      // Cache the leaderboard data with journey-specific TTL
      const ttl = this.redisService.getJourneyTTL(journey);
      await this.redisService.set(
        cacheKey,
        JSON.stringify(leaderboardData),
        ttl
      );
      
      this.logger.log(`Cached leaderboard for ${ttl} seconds: ${cacheKey}`, 'LeaderboardService');
      
      return leaderboardData;
    } catch (error) {
      this.logger.error(`Failed to get leaderboard for ${journey}: ${error.message}`, error.stack, 'LeaderboardService');
      throw error;
    }
  }

  /**
   * Calculates the leaderboard data by retrieving all user profiles and sorting them by XP.
   * @returns A promise that resolves to the leaderboard data.
   */
  private async calculateLeaderboard(): Promise<GameProfile[]> {
    try {
      // In a real implementation, this would query the database to get all game profiles
      // sorted by XP in descending order. Since the ProfilesService doesn't have a method
      // to retrieve all profiles, this is implemented as a placeholder.
      
      // Fetch all game profiles - in a real implementation, this would query the database
      // directly or use a method on ProfilesService that returns all profiles
      const profiles: GameProfile[] = [];
      
      // Sort by XP in descending order
      return profiles.sort((a, b) => b.xp - a.xp);
    } catch (error) {
      this.logger.error(`Failed to calculate leaderboard: ${error.message}`, error.stack, 'LeaderboardService');
      throw error;
    }
  }
}