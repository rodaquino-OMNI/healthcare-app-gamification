/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, HttpStatus } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { Achievement } from './entities/achievement.entity';
import { Service } from '@app/shared/interfaces/service.interface'; 
import { AppException } from '@app/shared/exceptions/exceptions.types'; 
import { PaginatedResponse, PaginationDto, PaginationMeta } from '@app/shared/dto/pagination.dto'; 
import { FilterDto } from '@app/shared/dto/filter.dto'; 
import { ErrorType } from '@app/shared/exceptions/exceptions.types'; 
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
   * @param achievementRepository - Repository for interacting with achievements in the database
   * @param userAchievementRepository - Repository for interacting with user achievements
   * @param profilesService - Service for managing user game profiles
   */
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepository: Repository<UserAchievement>,
    private readonly profilesService: ProfilesService
  ) {}
  
  /**
   * Finds a single achievement by specified criteria
   * @param criteria - Search criteria
   * @returns Promise with achievement or null if not found
   */
  async findOne(criteria: Partial<Achievement>): Promise<Achievement | null> {
    try {
      return await this.achievementRepository.findOne({ where: criteria });
    } catch (error: unknown) {
      throw new AppException(
        'Failed to find achievement',
        ErrorType.TECHNICAL,
        'GAME_002',
        { criteria }
      );
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
  ): Promise<{ items: Achievement[], total: number }> {
    try {
      // Set default pagination if not provided
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const skip = (page - 1) * limit;
      // Build the query with filters
      const queryBuilder = this.achievementRepository.createQueryBuilder('achievement');
      
      // Apply journey filter if provided
      if (filter?.journey) {
        queryBuilder.where('achievement.journey = :journey', { journey: filter.journey });
      }
      // Apply where conditions if provided
      if (filter?.where) {
        Object.entries(filter.where).forEach(([key, value]) => {
          queryBuilder.andWhere(`achievement.${key} = :${key}`, { [key]: value });
        });
      }
      // Apply order by if provided
      if (filter?.orderBy) {
        Object.entries(filter.orderBy).forEach(([key, direction]) => {
          // Fix: Add type assertion for direction to ensure it has toUpperCase method
          const sortDirection = (direction as string).toUpperCase() as 'ASC' | 'DESC';
          queryBuilder.addOrderBy(`achievement.${key}`, sortDirection);
        });
      } else {
        // Default sorting
        queryBuilder.orderBy('achievement.title', 'ASC');
      }
      // Get total count for pagination
      const totalItems = await queryBuilder.getCount();
      
      // Apply pagination
      queryBuilder.skip(skip).take(limit);
      
      // Execute query
      const achievements = await queryBuilder.getMany();
      
      // Return standardized response with expected properties for the Service interface
      return {
        items: achievements,
        total: totalItems
      };
    } catch (error: unknown) {
      throw new AppException(
        'Failed to retrieve achievements',
        ErrorType.TECHNICAL,
        'GAME_002',
        { filter }
      );
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
      hasPrev: page > 1
    };
    
    return {
      data: achievements,
      meta
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
      const achievement = await this.achievementRepository.findOneBy({ id });
      
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
        throw error as any;
      }
      
      throw new AppException(
        `Failed to retrieve achievement with ID ${id}`,
        ErrorType.TECHNICAL,
        'GAME_002',
        { id }
      );
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
      const achievement = this.achievementRepository.create(achievementData);
      return await this.achievementRepository.save(achievement);
    } catch (error: unknown) {
      throw new AppException(
        'Failed to create achievement',
        ErrorType.TECHNICAL,
        'GAME_003',
        { achievementData }
      );
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
      const existingAchievement = await this.findById(id);
      
      // Update the achievement
      const updated = { ...existingAchievement, ...achievementData };
      return await this.achievementRepository.save(updated);
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }
      
      throw new AppException(
        `Failed to update achievement with ID ${id}`,
        ErrorType.TECHNICAL,
        'GAME_005',
        { id, achievementData }
      );
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
      const result = await this.achievementRepository.delete(id);
      return result.affected ? result.affected > 0 : false;
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
      }
      
      throw new AppException(
        `Failed to delete achievement with ID ${id}`,
        ErrorType.TECHNICAL,
        'GAME_006',
        { id }
      );
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
      const queryBuilder = this.achievementRepository.createQueryBuilder('achievement');
      
      // Apply journey filter if provided
      if (filter?.journey) {
        queryBuilder.where('achievement.journey = :journey', { journey: filter.journey });
      }
      // Apply where conditions if provided
      if (filter?.where) {
        Object.entries(filter.where).forEach(([key, value]) => {
          queryBuilder.andWhere(`achievement.${key} = :${key}`, { [key]: value });
        });
      }
      
      return await queryBuilder.getCount();
    } catch (error: unknown) {
      throw new AppException(
        'Failed to count achievements',
        ErrorType.TECHNICAL,
        'GAME_007',
        { filter }
      );
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
      const existingUserAchievement = await this.userAchievementRepository.findOne({
        where: {
          profileId: userProfile.id,
          achievementId: achievement.id
        }
      });
      
      // If user already has this achievement unlocked, return it
      if (existingUserAchievement && existingUserAchievement.unlocked) {
        return existingUserAchievement;
      }
      
      // If user has progress on this achievement but hasn't unlocked it yet
      if (existingUserAchievement) {
        existingUserAchievement.unlocked = true;
        existingUserAchievement.unlockedAt = new Date();
        existingUserAchievement.progress = 100;
        
        // Save the updated user achievement
        const savedAchievement = await this.userAchievementRepository.save(existingUserAchievement);
        
        // Award XP for unlocking the achievement
        await this.profilesService.update(userId, {
          xp: userProfile.xp + achievement.xpReward
        });
        
        return savedAchievement;
      }
      
      // Create a new user achievement record
      const userAchievement = this.userAchievementRepository.create({
        profileId: userProfile.id,
        achievementId: achievement.id,
        unlocked: true,
        unlockedAt: new Date(),
        progress: 100
      });
      
      // Save the new user achievement
      const savedAchievement = await this.userAchievementRepository.save(userAchievement);
      
      // Award XP for unlocking the achievement
      await this.profilesService.update(userId, {
        xp: userProfile.xp + achievement.xpReward
      });
      
      return savedAchievement;
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error as any;
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
  async findByJourney(
    journey: string,
    pagination?: PaginationDto
  ): Promise<PaginatedResponse<Achievement>> {
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
  async findByXpReward(
    xpReward: number,
    pagination?: PaginationDto
  ): Promise<PaginatedResponse<Achievement>> {
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
  async search(
    searchTerm: string,
    pagination?: PaginationDto
  ): Promise<PaginatedResponse<Achievement>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const skip = (page - 1) * limit;
      const queryBuilder = this.achievementRepository.createQueryBuilder('achievement');
      
      queryBuilder
        .where('achievement.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orWhere('achievement.description ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
      
      const totalItems = await queryBuilder.getCount();
      
      queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('achievement.title', 'ASC');
      
      const achievements = await queryBuilder.getMany();
      
      return this.createPaginatedResponse(achievements, totalItems, page, limit);
    } catch (error: unknown) {
      throw new AppException(
        'Failed to search achievements',
        ErrorType.TECHNICAL,
        'GAME_008',
        { searchTerm }
      );
    }
  }
}