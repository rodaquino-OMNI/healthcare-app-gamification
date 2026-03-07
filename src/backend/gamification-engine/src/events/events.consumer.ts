/* eslint-disable @typescript-eslint/no-explicit-any */
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
    async onModuleInit() {
        try {
            this.logger.log('Initializing Kafka event consumers', 'EventsConsumer');

            for (const topic of this.topics) {
                await this.kafkaService.subscribe(topic, this.consumerGroup, this.handleEvent.bind(this));
                this.logger.log(`Subscribed to topic: ${topic}`, 'EventsConsumer');
            }

            this.logger.log('Kafka event consumers initialized successfully', 'EventsConsumer');
        } catch (error) {
            this.logger.error(
                `Failed to initialize Kafka event consumers: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'EventsConsumer'
            );
            throw error as any;
        }
    }

    /**
     * Handles incoming events from Kafka.
     * @param payload The event payload
     * @param key The message key
     * @param headers The message headers
     */
    private async handleEvent(payload: any): Promise<void> {
        try {
            this.logger.log(`Processing event`, 'EventsConsumer');

            // Extract message value from the payload object
            const messageValue = payload.value;

            // Validate the event structure
            if (!this.isValidEvent(messageValue)) {
                this.logger.warn(`Invalid event received: ${JSON.stringify(messageValue)}`, 'EventsConsumer');
                return;
            }

            // Process the event through the rules engine
            await this.rulesService.processEvent({
                type: messageValue.type,
                userId: messageValue.userId,
                timestamp: new Date(messageValue.timestamp),
                journey: messageValue.journey,
                data: messageValue.data,
                metadata: messageValue.metadata || {},
            });

            this.logger.log(`Successfully processed event`, 'EventsConsumer');
        } catch (error) {
            this.logger.error(
                `Error processing event: ${error instanceof Error ? (error as any).message : 'Unknown error'}`,
                error instanceof Error ? (error as any).stack : undefined,
                'EventsConsumer'
            );
        }
    }

    /**
     * Validates that an event has the required structure.
     * @param event The event to validate
     * @returns True if the event is valid, false otherwise
     */
    private isValidEvent(event: any): boolean {
        return (
            event &&
            typeof event === 'object' &&
            typeof event.type === 'string' &&
            typeof event.userId === 'string' &&
            typeof event.timestamp === 'string' &&
            typeof event.journey === 'string' &&
            typeof event.data === 'object'
        );
    }
}
