import { Injectable, NotFoundException } from '@nestjs/common'; // @nestjs/common ^9.0.0
import { InjectRepository } from '@nestjs/typeorm'; // @nestjs/typeorm 10.0.0
import { Repository } from 'typeorm'; // typeorm 0.3.17
import { Rule } from './entities/rule.entity';
import { AchievementsService } from '../achievements/achievements.service';
import { ProfilesService } from '../profiles/profiles.service';
import { QuestsService } from '../quests/quests.service';
import { RewardsService } from '../rewards/rewards.service';
import { Service } from 'src/backend/shared/src/interfaces/service.interface';
import { AppException, ErrorType } from 'src/backend/shared/src/exceptions/exceptions.types';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { KafkaService } from 'src/backend/shared/src/kafka/kafka.service';
import { ProcessEventDto } from '../events/dto/process-event.dto';

/**
 * Service for managing rules.
 */
@Injectable()
export class RulesService {
  /**
   * Injects the Rule repository and other services.
   */
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    private readonly achievementsService: AchievementsService,
    private readonly profilesService: ProfilesService,
    private readonly questsService: QuestsService,
    private readonly rewardsService: RewardsService,
    private readonly logger: LoggerService,
    private readonly kafkaService: KafkaService
  ) {}

  /**
   * Retrieves all rules.
   * @returns A promise that resolves to an array of rules.
   */
  async findAll(): Promise<Rule[]> {
    try {
      return await this.ruleRepository.find();
    } catch (error) {
      this.logger.error('Failed to retrieve rules', error.stack, 'RulesService');
      throw new AppException(
        'Failed to retrieve rules',
        ErrorType.TECHNICAL,
        'GAME_013',
        {},
        error
      );
    }
  }

  /**
   * Retrieves a single rule by its ID.
   * @param id The rule ID to find
   * @returns A promise that resolves to a single rule.
   */
  async findOne(id: string): Promise<Rule> {
    try {
      const rule = await this.ruleRepository.findOneBy({ id });
      
      if (!rule) {
        throw new NotFoundException(`Rule with ID ${id} not found`);
      }
      
      return rule;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Failed to retrieve rule with ID ${id}`, error.stack, 'RulesService');
      throw new AppException(
        `Failed to retrieve rule with ID ${id}`,
        ErrorType.TECHNICAL,
        'GAME_014',
        { id },
        error
      );
    }
  }

  /**
   * Evaluates a rule against a given event and user profile.
   * @param event The event data
   * @param userProfile The user's profile data
   * @returns True if the rule is satisfied, false otherwise
   */
  evaluateRule(event: any, userProfile: any): boolean {
    try {
      // For security reasons, this would typically be done in a sandbox
      // using a library like vm2 rather than using new Function directly.
      
      // In a production environment, this method would:
      // 1. Take a specific rule (either as parameter or from context)
      // 2. Check if the event type matches the rule's event type
      // 3. Evaluate the rule's condition against the event and userProfile
      // 4. Return the result of that evaluation
      
      // Since the rule is not specified in the method signature, we're using
      // a simple validation check as a placeholder.
      return !!event && !!userProfile;
    } catch (error) {
      this.logger.error(`Error evaluating rule: ${error.message}`, error.stack, 'RulesService');
      return false; // Fail closed on errors
    }
  }
}