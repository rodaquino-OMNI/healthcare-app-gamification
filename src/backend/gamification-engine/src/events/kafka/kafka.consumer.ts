import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsService } from '../../events/events.service';
import { RulesService } from '../../rules/rules.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { KafkaService } from '@app/shared/kafka/kafka.service'; // @app/shared ^1.0.0
import { LoggerService } from '@app/shared/logging/logger.service'; // @app/shared ^1.0.0
import { ProcessEventDto } from '../dto/process-event.dto';

/**
 * Consumes events from Kafka topics and processes them.
 * This consumer is responsible for handling events from all journeys (Health, Care, Plan)
 * and forwarding them to the EventsService for gamification processing.
 */
@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  // Configuration namespace to match the structure in configuration.ts
  private readonly configNamespace = 'gamificationEngine';

  /**
   * Injects the necessary services.
   * 
   * @param eventsService Service for processing gamification events
   * @param rulesService Service for evaluating gamification rules
   * @param profilesService Service for managing user game profiles
   * @param kafkaService Service for Kafka interaction
   * @param configService Service for accessing application configuration
   * @param logger Service for logging
   */
  constructor(
    private readonly eventsService: EventsService,
    private readonly rulesService: RulesService,
    private readonly profilesService: ProfilesService,
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.logger.log('KafkaConsumer initialized', 'KafkaConsumer');
  }

  /**
   * Subscribes to Kafka topics on module initialization.
   * This sets up consumers for all journey event topics defined in the configuration.
   */
  async onModuleInit(): Promise<void> {
    try {
      // Get kafka configuration from ConfigService using the proper namespace
      // Use fallbacks for backward compatibility
      const kafkaGroupId = this.configService.get<string>(`${this.configNamespace}.kafka.groupId`) || 
                         this.configService.get<string>('kafka.groupId', 'gamification-consumer-group');
      
      // Get topic names with proper fallbacks
      const healthTopic = this.configService.get<string>(`${this.configNamespace}.kafka.topics.healthEvents`) || 
                        this.configService.get<string>('kafka.topics.health', 'health.events');
                        
      const careTopic = this.configService.get<string>(`${this.configNamespace}.kafka.topics.careEvents`) || 
                      this.configService.get<string>('kafka.topics.care', 'care.events');
                      
      const planTopic = this.configService.get<string>(`${this.configNamespace}.kafka.topics.planEvents`) || 
                      this.configService.get<string>('kafka.topics.plan', 'plan.events');
      
      // Collect all topics that are defined
      const topics = [healthTopic, careTopic, planTopic].filter(Boolean);
      
      if (topics.length === 0) {
        this.logger.warn('No Kafka topics configured for consumption', 'KafkaConsumer');
        return;
      }
      
      this.logger.log(`Starting to subscribe to ${topics.length} Kafka topics with group ID: ${kafkaGroupId}`, 'KafkaConsumer');
      
      for (const topic of topics) {
        try {
          await this.kafkaService.consume(
            topic,
            kafkaGroupId,
            async (message: any, key?: string, headers?: Record<string, string>) => {
              await this.processMessage(message);
            }
          );
          
          this.logger.log(`Successfully subscribed to Kafka topic: ${topic}`, 'KafkaConsumer');
        } catch (error) {
          this.logger.error(
            `Failed to subscribe to Kafka topic ${topic}: ${error instanceof Error ? error.message : String(error)}`,
            error instanceof Error ? error.stack : '',
            'KafkaConsumer'
          );
          // Continue with other topics even if one fails
        }
      }
    } catch (error) {
      this.logger.error(
        `Error initializing Kafka consumers: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : '',
        'KafkaConsumer'
      );
      // Don't rethrow - let the application continue even if Kafka setup fails
    }
  }

  /**
   * Processes a message from a Kafka topic.
   * Validates the message format and forwards it to the EventsService for processing.
   * 
   * @param message The message to process
   */
  private async processMessage(message: any): Promise<void> {
    try {
      // Validate the message has the required ProcessEventDto structure
      if (!message || typeof message !== 'object' || !message.type || !message.userId || !message.data) {
        this.logger.error(`Invalid event format: ${JSON.stringify(message)}`, 'KafkaConsumer');
        return;
      }
      const eventData = message as ProcessEventDto;
      
      this.logger.log(
        `Processing event: ${eventData.type} for user: ${eventData.userId} from journey: ${eventData.journey || 'unknown'}`,
        'KafkaConsumer'
      );
      
      const result = await this.eventsService.processEvent(eventData);
      
      this.logger.log(
        `Event processed successfully: ${eventData.type}, points earned: ${result.points || 0}`,
        'KafkaConsumer'
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error processing Kafka message: ${error.message}`,
          error.stack,
          'KafkaConsumer'
        );
      } else {
        this.logger.error(
          `Error processing Kafka message: ${String(error)}`,
          '',
          'KafkaConsumer'
        );
      }
    }
  }
}