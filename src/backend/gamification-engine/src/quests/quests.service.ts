import { Injectable, NotFoundException } from '@nestjs/common'; // @nestjs/common ^9.0.0
import { InjectRepository } from '@nestjs/typeorm'; // @nestjs/typeorm 10.0.0
import { Repository } from 'typeorm'; // typeorm 0.3.17
import { Quest } from './entities/quest.entity';
import { UserQuest } from './entities/user-quest.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { AchievementsService } from '../achievements/achievements.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { FilterDto } from '@app/shared/dto/filter.dto';
import { PaginationDto } from '@app/shared/dto/pagination.dto';

/**
 * Service for managing quests.
 */
@Injectable()
export class QuestsService {
  /**
   * Injects the Quest and UserQuest repositories, ProfilesService, AchievementsService, KafkaService and LoggerService.
   */
  constructor(
    @InjectRepository(Quest)
    private readonly questRepository: Repository<Quest>,
    @InjectRepository(UserQuest)
    private readonly userQuestRepository: Repository<UserQuest>,
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
      return await this.questRepository.find();
    } catch (error: any) {
      this.logger.error('Failed to retrieve quests', error?.stack, 'QuestsService');
      throw new AppException(
        'Failed to retrieve quests',
        ErrorType.TECHNICAL,
        'GAME_009',
        {},
        error
      );
    }
  }

  /**
   * Retrieves a single quest by its ID.
   * @param id The unique identifier of the quest.
   * @returns A promise that resolves to a single quest.
   */
  async findOne(id: string): Promise<Quest> {
    try {
      const quest = await this.questRepository.findOneBy({ id });
      
      if (!quest) {
        throw new NotFoundException(`Quest with ID ${id} not found`);
      }
      
      return quest;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
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
      const existingUserQuest = await this.userQuestRepository.findOne({
        where: {
          profile: { id: profile.id },
          quest: { id: questId }
        }
      });
      
      if (existingUserQuest) {
        return existingUserQuest;
      }
      
      // Create a new UserQuest instance
      const userQuest = this.userQuestRepository.create({
        profile,
        quest,
        progress: 0,
        completed: false
      });
      
      // Save to database
      const savedUserQuest = await this.userQuestRepository.save(userQuest);
      
      // Log and publish event
      this.logger.log(`User ${userId} started quest ${questId}`, 'QuestsService');
      await this.kafkaService.produce('quest.started', {
        userId,
        questId,
        timestamp: new Date().toISOString()
      });
      
      return savedUserQuest;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
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
      const userQuest = await this.userQuestRepository.findOne({
        where: {
          profile: { id: profile.id },
          quest: { id: questId }
        },
        relations: ['quest']
      });
      
      if (!userQuest) {
        throw new NotFoundException(`User ${userId} has not started quest ${questId}`);
      }
      
      if (userQuest.completed) {
        return userQuest; // Already completed
      }
      
      // Update the UserQuest to mark it as completed
      userQuest.progress = 100;
      userQuest.completed = true;
      
      // Save the updated UserQuest
      const updatedUserQuest = await this.userQuestRepository.save(userQuest);
      
      // Award XP to the user
      await this.profilesService.update(userId, {
        xp: profile.xp + userQuest.quest.xpReward
      });
      
      // Check if completing this quest unlocks any achievements
      // This is a placeholder for actual achievement checking logic
      // which would likely be implemented in the AchievementsService
      const unlockedAchievements = await this.achievementsService.findByJourney(userQuest.quest.journey);
      
      // Log and publish event
      this.logger.log(`User ${userId} completed quest ${questId} and earned ${userQuest.quest.xpReward} XP`, 'QuestsService');
      await this.kafkaService.produce('quest.completed', {
        userId,
        questId,
        xpAwarded: userQuest.quest.xpReward,
        timestamp: new Date().toISOString()
      });
      
      return updatedUserQuest;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
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