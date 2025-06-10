/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../shared/src/redis/redis.service';
import { LoggerService } from '../../../shared/src/logging/logger.service';

/**
 * Service for managing gamification leaderboards using Redis
 * This service provides methods for adding scores, retrieving rankings,
 * and generating journey-specific leaderboards.
 */
@Injectable()
export class GameLeaderboardService {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('GameLeaderboardService');
  }

  /**
   * Get the Redis key for a specific leaderboard
   * @param journey Journey type (health, care, plan) or 'global'
   * @param period Time period (daily, weekly, monthly, allTime)
   * @returns Redis key for the leaderboard
   */
  private getLeaderboardKey(journey: string, period: string): string {
    return `leaderboard:${journey}:${period}`;
  }

  /**
   * Add or update a user's score in a leaderboard
   * @param userId User ID
   * @param score Score to add
   * @param journey Journey type
   * @param period Time period
   * @returns Promise resolving to the new user rank
   */
  async addScore(
    userId: string,
    score: number,
    journey: string = 'global',
    period: string = 'allTime',
  ): Promise<number> {
    try {
      const leaderboardKey = this.getLeaderboardKey(journey, period);
      
      // Add the score to the sorted set
      await this.redisService.zadd(leaderboardKey, score, userId);
      
      // Get the user's rank (0-based index, so add 1 for human-readable rank)
      const rank = await this.redisService.zrevrank(leaderboardKey, userId);
      return rank !== null ? rank + 1 : 0;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to add score for user ${userId}: ${(error as any).message}`,
          (error as any).stack
        );
      } else {
        this.logger.error(
          `Failed to add score for user ${userId}: ${String(error)}`,
          'No stack trace available'
        );
      }
      throw error as any;
    }
  }

  /**
   * Increment a user's score in a leaderboard
   * @param userId User ID
   * @param increment Amount to increment
   * @param journey Journey type
   * @param period Time period
   * @returns Promise resolving to the new score
   */
  async incrementScore(
    userId: string,
    increment: number,
    journey: string = 'global',
    period: string = 'allTime',
  ): Promise<number> {
    try {
      const leaderboardKey = this.getLeaderboardKey(journey, period);
      
      // Use zincrby which handles both cases: new user and existing user
      const newScore = await this.redisService.zincrby(leaderboardKey, increment, userId);
      
      return typeof newScore === 'string' ? parseFloat(newScore) : newScore;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to increment score for user ${userId}: ${(error as any).message}`,
          (error as any).stack
        );
      } else {
        this.logger.error(
          `Failed to increment score for user ${userId}: ${String(error)}`,
          'No stack trace available'
        );
      }
      throw error as any;
    }
  }

  /**
   * Get the top users from a leaderboard
   * @param journey Journey type
   * @param period Time period
   * @param limit Maximum number of users to return
   * @returns Promise resolving to array of {userId, score, rank}
   */
  async getTopUsers(
    journey: string = 'global',
    period: string = 'allTime',
    limit: number = 10,
  ): Promise<Array<{ userId: string; score: number; rank: number }>> {
    try {
      const leaderboardKey = this.getLeaderboardKey(journey, period);
      
      // Use zrevrange to get users in descending order (highest scores first)
      const results = await this.redisService.zrevrange(leaderboardKey, 0, limit - 1, true) as Array<[string, string]>;
      
      const formattedResults = results.map(([userId, scoreStr], index) => ({
        userId,
        score: parseFloat(scoreStr),
        rank: index + 1, // Calculate rank (1-based)
      }));
      
      return formattedResults;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to get top users for ${journey} journey: ${(error as any).message}`,
          (error as any).stack
        );
      } else {
        this.logger.error(
          `Failed to get top users for ${journey} journey: ${String(error)}`,
          'No stack trace available'
        );
      }
      return [];
    }
  }

  /**
   * Get a user's rank and score in a leaderboard
   * @param userId User ID
   * @param journey Journey type
   * @param period Time period
   * @returns Promise resolving to {rank, score} or null if user not found
   */
  async getUserRank(
    userId: string,
    journey: string = 'global',
    period: string = 'allTime',
  ): Promise<{ rank: number; score: number } | null> {
    try {
      const leaderboardKey = this.getLeaderboardKey(journey, period);
      
      // Get user score
      const score = await this.redisService.zscore(leaderboardKey, userId);
      
      if (score === null) {
        return null;
      }
      
      // Get user rank (0-based, so add 1)
      const rank = await this.redisService.zrevrank(leaderboardKey, userId);
      
      return {
        rank: rank !== null ? rank + 1 : 0,
        score: parseFloat(score),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to get rank for user ${userId}: ${(error as any).message}`,
          (error as any).stack
        );
      } else {
        this.logger.error(
          `Failed to get rank for user ${userId}: ${String(error)}`,
          'No stack trace available'
        );
      }
      return null;
    }
  }

  /**
   * Get neighboring users in rank around a specific user
   * @param userId User ID
   * @param journey Journey type
   * @param period Time period
   * @param range Number of users before and after to include
   * @returns Promise resolving to array of {userId, score, rank}
   */
  async getUserNeighborRanks(
    userId: string,
    journey: string = 'global',
    period: string = 'allTime',
    range: number = 2,
  ): Promise<Array<{ userId: string; score: number; rank: number }>> {
    try {
      const leaderboardKey = this.getLeaderboardKey(journey, period);
      
      // First get user's rank
      const userRank = await this.redisService.zrevrank(leaderboardKey, userId);
      
      if (userRank === null) {
        return [];
      }
      
      // Calculate start and end indices for the range query
      const start = Math.max(0, userRank - range);
      const end = userRank + range;
      
      // Get users in range
      const usersInRange = await this.redisService.zrevrange(leaderboardKey, start, end, true) as Array<[string, string]>;
      
      // Format the results
      return usersInRange.map(([id, scoreStr], index) => ({
        userId: id,
        score: parseFloat(scoreStr),
        rank: start + index + 1, // Calculate rank (1-based)
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to get neighbor ranks for user ${userId}: ${(error as any).message}`,
          (error as any).stack
        );
      } else {
        this.logger.error(
          `Failed to get neighbor ranks for user ${userId}: ${String(error)}`,
          'No stack trace available'
        );
      }
      return [];
    }
  }

  /**
   * Reset a leaderboard
   * @param journey Journey type
   * @param period Time period
   * @returns Promise resolving to boolean indicating success
   */
  async resetLeaderboard(
    journey: string = 'global',
    period: string = 'allTime',
  ): Promise<boolean> {
    try {
      const leaderboardKey = this.getLeaderboardKey(journey, period);
      
      await this.redisService.del(leaderboardKey);
      this.logger.info(`Reset leaderboard for ${journey} journey, ${period} period`);
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to reset leaderboard for ${journey} journey: ${(error as any).message}`,
          (error as any).stack
        );
      } else {
        this.logger.error(
          `Failed to reset leaderboard for ${journey} journey: ${String(error)}`,
          'No stack trace available'
        );
      }
      return false;
    }
  }
}