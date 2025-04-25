import { Injectable } from '@nestjs/common';
import { ProcessEventDto } from './dto/process-event.dto';
import { AchievementsService } from '../achievements/achievements.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RulesService } from '../rules/rules.service';
import { KafkaService } from 'src/backend/shared/src/kafka/kafka.service';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
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
      
      // Evaluate rules against this event
      const rules = await this.rulesService.findAll();
      const matchingRules = rules.filter(rule => rule.event === event.type);
      
      if (matchingRules.length === 0) {
        this.logger.log(`No rules found for event type: ${event.type}`, 'EventsService');
        return { success: true, points: 0, message: 'No rules matched this event' };
      }
      
      let totalPoints = 0;
      const achievementUpdates = [];
      const questUpdates = [];
      
      // Process each matching rule
      for (const rule of matchingRules) {
        const ruleSatisfied = this.rulesService.evaluateRule(event, gameProfile);
        
        if (ruleSatisfied) {
          try {
            // Parse and process rule actions
            const actions = JSON.parse(rule.actions);
            
            for (const action of actions) {
              switch (action.type) {
                case 'AWARD_XP':
                  totalPoints += Number(action.value);
                  break;
                case 'PROGRESS_ACHIEVEMENT':
                  achievementUpdates.push({
                    id: action.achievementId,
                    progress: action.value
                  });
                  break;
                case 'PROGRESS_QUEST':
                  questUpdates.push({
                    id: action.questId,
                    progress: action.value
                  });
                  break;
                // Add other action types as needed
              }
            }
          } catch (error) {
            this.logger.error(`Failed to parse or process rule actions: ${error.message}`, error.stack, 'EventsService');
          }
        }
      }
      
      // Update user's profile if points were earned
      if (totalPoints > 0) {
        const updatedProfile = await this.profilesService.update(event.userId, {
          xp: gameProfile.xp + totalPoints
        });
        
        this.logger.log(`User ${event.userId} earned ${totalPoints} XP`, 'EventsService');
        
        // Publish event for XP earned
        await this.kafkaService.produce('gamification-events', {
          type: 'XP_EARNED',
          userId: event.userId,
          amount: totalPoints,
          sourceEvent: event.type,
          timestamp: new Date().toISOString(),
          journey: event.journey
        });
        
        // Check for level up
        if (updatedProfile.level > gameProfile.level) {
          this.logger.log(`User ${event.userId} leveled up to ${updatedProfile.level}`, 'EventsService');
          
          // Publish level up event
          await this.kafkaService.produce('gamification-events', {
            type: 'LEVEL_UP',
            userId: event.userId,
            oldLevel: gameProfile.level,
            newLevel: updatedProfile.level,
            timestamp: new Date().toISOString()
          });
        }
        
        // Process achievement updates if any
        for (const achievement of achievementUpdates) {
          // In a real implementation, this would call a method on AchievementsService
          // to update achievement progress
          this.logger.log(`Updating achievement ${achievement.id} for user ${event.userId}`, 'EventsService');
        }
        
        // Process quest updates if any
        for (const quest of questUpdates) {
          // In a real implementation, this would call a method on QuestsService
          // to update quest progress
          this.logger.log(`Updating quest ${quest.id} for user ${event.userId}`, 'EventsService');
        }
        
        return {
          success: true,
          points: totalPoints,
          profile: updatedProfile,
          achievements: achievementUpdates,
          quests: questUpdates
        };
      }
      
      this.logger.log(`Event processed with no point changes for user ${event.userId}`, 'EventsService');
      
      return {
        success: true,
        points: 0,
        message: 'Event processed but no points earned',
        achievements: achievementUpdates,
        quests: questUpdates
      };
    } catch (error) {
      this.logger.error(`Failed to process event for user ${event.userId}`, error.stack, 'EventsService');
      throw error;
    }
  }
}