import { Injectable } from '@nestjs/common';
import { ProcessEventDto } from './dto/process-event.dto';
import { AchievementsService } from '../achievements/achievements.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RulesService } from '../rules/rules.service';
import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RewardsService } from '../rewards/rewards.service';
import { QuestsService } from '../quests/quests.service';

/**
 * Service responsible for processing gamification events from all journeys in the AUSTA SuperApp.
 * It receives events, evaluates rules, and updates user profiles with points and achievements.
 * Acts as the central hub for the gamification engine.
 */
@Injectable()
export class EventsService {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly profilesService: ProfilesService,
    private readonly rulesService: RulesService,
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService,
    private readonly rewardsService: RewardsService,
    private readonly questsService: QuestsService
  ) {
    this.logger.log('EventsService initialized', 'EventsService');
  }

  /**
   * Processes a given event by evaluating rules and updating the user's profile.
   * This is the main entry point for handling all gamification events across all journeys.
   * 
   * @param event The event to process containing type, userId, data, and optional journey
   * @returns A promise that resolves with the result of the event processing
   */
  async processEvent(event: ProcessEventDto): Promise<any> {
    this.logger.log(`Processing event: ${event.type} for user: ${event.userId}`, 'EventsService');
    
    try {
      // Get the user's game profile
      let gameProfile;
      try {
        gameProfile = await this.profilesService.findById(event.userId);
      } catch (error) {
        // If profile doesn't exist, create it
        this.logger.log(`Creating new game profile for user: ${event.userId}`, 'EventsService');
        gameProfile = await this.profilesService.create(event.userId);
      }
      
      // Create a proper gamification event from the DTO
      const gamificationEvent = {
        type: event.type,
        userId: event.userId,
        timestamp: new Date(),
        journey: event.journey || 'all',
        data: event.data,
        metadata: {}
      };
      
      // Use the processEvent method from RulesService
      await this.rulesService.processEvent(gamificationEvent);
      
      // Fetch the updated profile after rule processing
      const updatedProfile = await this.profilesService.findById(event.userId);
      
      return {
        success: true,
        profile: updatedProfile,
        message: 'Event processed successfully'
      };
    } catch (error: any) {
      this.logger.error(`Failed to process event for user ${event.userId}`, error?.stack, 'EventsService');
      throw error;
    }
  }
}