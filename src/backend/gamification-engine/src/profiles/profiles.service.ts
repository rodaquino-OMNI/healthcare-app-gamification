import { Injectable, NotFoundException } from '@nestjs/common';
import { GameProfile } from 'src/backend/gamification-engine/src/profiles/entities/game-profile.entity';
import { UserAchievement } from 'src/backend/gamification-engine/src/achievements/entities/user-achievement.entity';
import { Repository } from 'src/backend/shared/src/interfaces/repository.interface';
import { AppException } from 'src/backend/shared/src/exceptions/exceptions.types';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';

/**
 * Service for managing user game profiles.
 * Handles operations related to the creation, retrieval and updating of
 * game profile data.
 */
@Injectable()
export class ProfilesService {
  /**
   * Injects dependencies.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService
  ) {}

  /**
   * Creates a new game profile for a user.
   * @param userId The user ID for whom to create the profile
   * @returns The created game profile
   */
  async create(userId: string): Promise<GameProfile> {
    try {
      // Check if profile already exists to avoid duplicates
      const existingProfile = await this.prisma.gameProfile.findUnique({
        where: { userId }
      });

      if (existingProfile) {
        this.logger.warn(`Game profile already exists for user: ${userId}`, 'ProfilesService');
        return existingProfile as unknown as GameProfile;
      }

      // Create a new game profile with default values
      const newProfile = await this.prisma.gameProfile.create({
        data: {
          userId,
          level: 1,
          xp: 0
        }
      });

      this.logger.log(`Created new game profile for user: ${userId}`, 'ProfilesService');
      return newProfile as unknown as GameProfile;
    } catch (error) {
      this.logger.error(`Failed to create game profile for user: ${userId}`, error.stack, 'ProfilesService');
      throw error;
    }
  }

  /**
   * Finds a game profile by user ID.
   * @param userId The user ID to find the profile for
   * @returns The game profile, or null if not found
   */
  async findById(userId: string): Promise<GameProfile> {
    try {
      const profile = await this.prisma.gameProfile.findUnique({
        where: { userId },
        include: {
          achievements: true,
          quests: true
        }
      });

      if (!profile) {
        throw new NotFoundException(`Game profile not found for user: ${userId}`);
      }

      return profile as unknown as GameProfile;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find game profile for user: ${userId}`, error.stack, 'ProfilesService');
      throw error;
    }
  }

  /**
   * Updates an existing game profile.
   * @param userId The user ID of the profile to update
   * @param data The partial profile data to update
   * @returns The updated game profile
   */
  async update(userId: string, data: Partial<GameProfile>): Promise<GameProfile> {
    try {
      // Ensure the profile exists before updating
      await this.findById(userId);

      const updatedProfile = await this.prisma.gameProfile.update({
        where: { userId },
        data,
        include: {
          achievements: true,
          quests: true
        }
      });

      this.logger.log(`Updated game profile for user: ${userId}`, 'ProfilesService');
      return updatedProfile as unknown as GameProfile;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update game profile for user: ${userId}`, error.stack, 'ProfilesService');
      throw error;
    }
  }
}