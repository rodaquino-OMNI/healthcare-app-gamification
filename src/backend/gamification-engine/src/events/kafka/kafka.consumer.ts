import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventsService } from '../../events/events.service';
import { RulesService } from '../../rules/rules.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { KafkaService } from '@shared/kafka/kafka.service';
import { LoggerService } from '@shared/logging/logger.service';
import { gamificationEngine } from '../../config/configuration';
import { ProcessEventDto } from '../dto/process-event.dto';

/**
 * Consumes events from Kafka topics and processes them.
 * This consumer is responsible for handling events from all journeys (Health, Care, Plan)
 * and forwarding them to the EventsService for gamification processing.
 */
@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  /**
   * Injects the necessary services.
   * 
   * @param eventsService Service for processing gamification events
   * @param rulesService Service for evaluating gamification rules
   * @param profilesService Service for managing user game profiles
   * @param kafkaService Service for Kafka interaction
   * @param logger Service for logging
   */
  constructor(
    private readonly eventsService: EventsService,
    private readonly rulesService: RulesService,
    private readonly profilesService: ProfilesService,
    private readonly kafkaService: KafkaService,
    private readonly logger: LoggerService
  ) {
    this.logger.log('KafkaConsumer initialized', 'KafkaConsumer');
  }

  /**
   * Subscribes to Kafka topics on module initialization.
   * This sets up consumers for all journey event topics defined in the configuration.
   */
  async onModuleInit(): Promise<void> {
    const kafkaConfig = gamificationEngine().kafka;
    const topics = Object.values(kafkaConfig.topics);
    
    for (const topic of topics) {
      await this.kafkaService.consume(
        topic,
        kafkaConfig.groupId,
        async (message, key, headers) => {
          await this.processMessage(message);
        }
      );
      
      this.logger.log(`Subscribed to Kafka topic: ${topic}`, 'KafkaConsumer');
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

      const eventData: ProcessEventDto = message;
      
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
      this.logger.error(
        `Error processing Kafka message: ${error.message}`,
        error.stack,
        'KafkaConsumer'
      );
    }
  }
}