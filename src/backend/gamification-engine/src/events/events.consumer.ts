import { KafkaService } from '@app/shared/kafka/kafka.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { RulesService } from '../rules/rules.service';

/**
 * Event consumer service for the gamification engine.
 * Handles consuming events from Kafka topics and processing them through the rules engine.
 */
@Injectable()
export class EventsConsumer implements OnModuleInit {
    private readonly topics = ['health.events', 'care.events', 'plan.events', 'user.events'];
    private readonly consumerGroup = 'gamification-engine-group';

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly rulesService: RulesService,
        private readonly logger: LoggerService
    ) {}

    /**
     * Initializes Kafka consumers when the module is initialized.
     */
    async onModuleInit(): Promise<void> {
        try {
            this.logger.log('Initializing Kafka event consumers', 'EventsConsumer');

            for (const topic of this.topics) {
                await this.kafkaService.subscribe(topic, this.consumerGroup, this.handleEvent.bind(this));
                this.logger.log(`Subscribed to topic: ${topic}`, 'EventsConsumer');
            }

            this.logger.log('Kafka event consumers initialized successfully', 'EventsConsumer');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Failed to initialize Kafka event consumers: ${msg}`, stack, 'EventsConsumer');
            throw error;
        }
    }

    /**
     * Handles incoming events from Kafka.
     * @param payload The event payload
     */
    private async handleEvent(payload: Record<string, unknown>): Promise<void> {
        try {
            this.logger.log(`Processing event`, 'EventsConsumer');

            // Extract message value from the payload object
            const messageValue = payload['value'] as Record<string, unknown>;

            // Validate the event structure
            if (!this.isValidEvent(messageValue)) {
                this.logger.warn(`Invalid event received: ${JSON.stringify(messageValue)}`, 'EventsConsumer');
                return;
            }

            // Process the event through the rules engine
            await this.rulesService.processEvent({
                type: messageValue['type'] as string,
                userId: messageValue['userId'] as string,
                timestamp: new Date(messageValue['timestamp'] as string),
                journey: messageValue['journey'] as string,
                data: messageValue['data'] as Record<string, unknown>,
                metadata: (messageValue['metadata'] as Record<string, unknown>) || {},
            });

            this.logger.log(`Successfully processed event`, 'EventsConsumer');
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error processing event: ${msg}`, stack, 'EventsConsumer');
        }
    }

    /**
     * Validates that an event has the required structure.
     * @param event The event to validate
     * @returns True if the event is valid, false otherwise
     */
    private isValidEvent(event: Record<string, unknown> | null | undefined): boolean {
        return (
            event !== null &&
            event !== undefined &&
            typeof event === 'object' &&
            typeof event['type'] === 'string' &&
            typeof event['userId'] === 'string' &&
            typeof event['timestamp'] === 'string' &&
            typeof event['journey'] === 'string' &&
            typeof event['data'] === 'object'
        );
    }
}
