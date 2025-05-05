import { Injectable, NotFoundException } from '@nestjs/common';
import { GameProfile } from './entities/game-profile.entity';
// Updated import to use local PrismaService
import { PrismaService } from '../database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { mapToDomainGameProfile } from '../utils/entity-mappers';

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
        return mapToDomainGameProfile(existingProfile);
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
      return mapToDomainGameProfile(newProfile);
    } catch (error) {
      this.logger.error(
        `Failed to create game profile for user: ${userId}`,
        error instanceof Error ? error.stack : undefined,
        'ProfilesService'
      );
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
          achievements: {
            include: {
              achievement: true
            }
          }
        }
      });
      
      if (!profile) {
        throw new NotFoundException(`Game profile not found for user: ${userId}`);
      }
      
      return mapToDomainGameProfile(profile);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to find game profile for user: ${userId}`,
        error instanceof Error ? error.stack : undefined,
        'ProfilesService'
      );
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
      
      // Only allow updating specific fields
      const updateData = {
        level: data.level,
        xp: data.xp
      };
      
      const updatedProfile = await this.prisma.gameProfile.update({
        where: { userId },
        data: updateData,
        include: {
          achievements: {
            include: {
              achievement: true
            }
          }
        }
      });
      
      this.logger.log(`Updated game profile for user: ${userId}`, 'ProfilesService');
      return mapToDomainGameProfile(updatedProfile);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to update game profile for user: ${userId}`,
        error instanceof Error ? error.stack : undefined,
        'ProfilesService'
      );
      throw error;
    }
  }

  /**
   * Retrieves all game profiles.
   * @returns An array of all game profiles
   */
  async getAllProfiles(): Promise<GameProfile[]> {
    try {
      const profiles = await this.prisma.gameProfile.findMany({
        include: {
          achievements: {
            include: {
              achievement: true
            }
          }
        }
      });
      
      // Fix: Added explicit type annotation for the profile parameter
      return profiles.map((profile: any) => mapToDomainGameProfile(profile));
    } catch (error) {
      this.logger.error(
        'Failed to retrieve all game profiles',
        error instanceof Error ? error.stack : undefined,
        'ProfilesService'
      );
      throw error;
    }
  }
}