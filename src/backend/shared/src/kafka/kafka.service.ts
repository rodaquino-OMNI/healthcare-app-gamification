import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, Producer, ProducerRecord, SASLMechanism, SASLOptions } from 'kafkajs';

import { ErrorType } from '../exceptions/error.types';
import { AppException } from '../exceptions/exceptions.types';
import { LoggerService } from '../logging/logger.service';

type KafkaMessageHandler = (message: Record<string, unknown>) => Promise<void>;

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumer!: Consumer; // Using definite assignment assertion
    private isProducerConnected = false;
    private isConsumerConnected = false;
    private readonly messageHandlers = new Map<string, Set<KafkaMessageHandler>>();

    constructor(
        @Inject('KAFKA_OPTIONS')
        private readonly options: {
            clientId: string;
            brokers: string[];
            ssl?: boolean;
            sasl?: {
                mechanism: SASLMechanism;
                username: string;
                password: string;
            };
            groupId?: string;
        },
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('KafkaService');

        // Initialize Kafka client with properly typed SASL options
        const saslOptions: SASLOptions | undefined = this.options.sasl
            ? ({
                  mechanism: this.options.sasl.mechanism,
                  username: this.options.sasl.username,
                  password: this.options.sasl.password,
              } as SASLOptions)
            : undefined;

        this.kafka = new Kafka({
            clientId: this.options.clientId,
            brokers: this.options.brokers,
            ssl: this.options.ssl || false,
            sasl: saslOptions,
        });

        // Initialize producer
        this.producer = this.kafka.producer({
            allowAutoTopicCreation: true,
            idempotent: true,
        });

        // Initialize consumer (if group ID is provided)
        if (this.options.groupId) {
            this.consumer = this.kafka.consumer({
                groupId: this.options.groupId,
            });
        }
    }

    /**
     * Connect to Kafka on module initialization
     */
    async onModuleInit(): Promise<void> {
        try {
            await this.connectProducer();

            if (this.consumer) {
                await this.connectConsumer();
            }
        } catch (error) {
            this.logger.error(
                'Failed to connect to Kafka',
                error instanceof Error ? error.stack : undefined
            );
            // Don't throw here to allow service to start even if Kafka is unavailable
        }
    }

    /**
     * Disconnect from Kafka on module destruction
     */
    async onModuleDestroy(): Promise<void> {
        try {
            if (this.isProducerConnected) {
                await this.producer.disconnect();
            }

            if (this.isConsumerConnected) {
                await this.consumer.disconnect();
            }
        } catch (error) {
            this.logger.error(
                'Error disconnecting from Kafka',
                error instanceof Error ? error.stack : undefined
            );
        }
    }

    /**
     * Connect the Kafka producer
     */
    private async connectProducer(): Promise<void> {
        try {
            if (!this.isProducerConnected) {
                await this.producer.connect();
                this.isProducerConnected = true;
                this.logger.log('Kafka producer connected');
            }
        } catch (error) {
            this.logger.error(
                'Failed to connect Kafka producer',
                error instanceof Error ? error.stack : undefined
            );
            this.isProducerConnected = false;
            throw error;
        }
    }

    /**
     * Connect the Kafka consumer
     */
    private async connectConsumer(): Promise<void> {
        try {
            if (!this.isConsumerConnected && this.consumer) {
                await this.consumer.connect();
                this.isConsumerConnected = true;
                this.logger.log('Kafka consumer connected');

                // Set up consumer event handlers
                this.setupConsumerEvents();
            }
        } catch (error) {
            this.logger.error(
                'Failed to connect Kafka consumer',
                error instanceof Error ? error.stack : undefined
            );
            this.isConsumerConnected = false;
            throw error;
        }
    }

    /**
     * Set up consumer event handlers
     */
    private setupConsumerEvents(): void {
        if (!this.consumer || !this.isConsumerConnected) {
            return;
        }

        // Handle messages
        void this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const handlers = this.messageHandlers.get(topic);

                if (!handlers || handlers.size === 0) {
                    this.logger.debug(`No handlers for message from topic ${topic}`);
                    return;
                }

                try {
                    // Parse the message
                    const parsedMessage = this.parseMessage(message.value);
                    const key = message.key ? message.key.toString() : undefined;

                    this.logger.debug(
                        `Processing message from topic ${topic}, partition ${partition}`,
                        {
                            key,
                            offset: message.offset.toString(),
                        }
                    );

                    // Convert Set to Array to fix iteration issue
                    const handlersArray = Array.from(handlers);
                    for (const handler of handlersArray) {
                        try {
                            await handler({
                                key,
                                value: parsedMessage,
                                headers: message.headers as Record<string, unknown>,
                                topic,
                                partition,
                                offset: message.offset,
                                timestamp: message.timestamp,
                            });
                        } catch (handlerError) {
                            this.logger.error(
                                `Error in Kafka message handler for topic ${topic}`,
                                handlerError instanceof Error ? handlerError.stack : undefined
                            );
                            // Continue with next handler
                        }
                    }
                } catch (error) {
                    this.logger.error(
                        `Error processing message from topic ${topic}`,
                        error instanceof Error ? error.stack : undefined
                    );
                }
            },
        });
    }

    /**
     * Subscribe to a Kafka topic
     * @param topic The topic to subscribe to
     * @param groupId Optional consumer group ID
     * @param handler The message handler function
     */
    async subscribe(topic: string, groupId: string, handler: KafkaMessageHandler): Promise<void> {
        try {
            // Make sure consumer is connected
            if (!this.consumer) {
                throw new Error(
                    'Kafka consumer not initialized. Provide a groupId in module options.'
                );
            }

            if (!this.isConsumerConnected) {
                await this.connectConsumer();
            }

            // Register the handler
            if (!this.messageHandlers.has(topic)) {
                this.messageHandlers.set(topic, new Set());

                // Subscribe to the topic
                await this.consumer.subscribe({ topic, fromBeginning: false });
                this.logger.log(`Subscribed to Kafka topic: ${topic}`);
            }

            // Add this handler to the topic - ensure handlers set exists
            const handlers = this.messageHandlers.get(topic);
            if (handlers) {
                handlers.add(handler);
            }
        } catch (error) {
            this.logger.error(
                `Failed to subscribe to topic ${topic}`,
                error instanceof Error ? error.stack : undefined
            );
            throw new AppException(
                `Failed to subscribe to Kafka topic ${topic}`,
                ErrorType.TECHNICAL,
                'KAFKA_SUBSCRIBE_ERROR',
                { topic, groupId }
            );
        }
    }

    /**
     * Emit a message to a Kafka topic
     * @param topic The topic to emit to
     * @param message The message to emit
     * @param key Optional message key
     * @param headers Optional message headers
     */
    async emit(
        topic: string,
        message: Record<string, unknown> | string,
        key?: string,
        headers?: Record<string, string>
    ): Promise<void> {
        try {
            // Ensure producer is connected
            if (!this.isProducerConnected) {
                await this.connectProducer();
            }

            // Prepare the record
            const record: ProducerRecord = {
                topic,
                messages: [
                    {
                        key: key ? Buffer.from(key) : null,
                        value: this.serializeMessage(message),
                        headers: headers ? this.serializeHeaders(headers) : undefined,
                    },
                ],
            };

            // Send the message
            await this.producer.send(record);

            this.logger.debug(`Message sent to topic ${topic}`, {
                key: key || '',
            });
        } catch (error) {
            this.logger.error(
                `Failed to emit message to topic ${topic}`,
                error instanceof Error ? error.stack : undefined
            );
            throw new AppException(
                `Failed to emit message to Kafka topic ${topic}`,
                ErrorType.TECHNICAL,
                'KAFKA_EMIT_ERROR',
                { topic, key }
            );
        }
    }

    /**
     * Alias for emit() for compatibility with other services
     */
    async produce(
        topic: string,
        message: Record<string, unknown> | string,
        key?: string,
        headers?: Record<string, string>
    ): Promise<void> {
        return this.emit(topic, message, key, headers);
    }

    /**
     * Parse a Kafka message value
     * @param value The message value
     * @returns The parsed message
     */
    private parseMessage(value: Buffer | null): unknown {
        if (!value) {
            return null;
        }

        try {
            const message = value.toString();
            return JSON.parse(message) as unknown;
        } catch {
            // If not JSON, return as string
            return value.toString();
        }
    }

    /**
     * Serialize a message for Kafka
     * @param message The message to serialize
     * @returns The serialized message
     */
    private serializeMessage(message: Record<string, unknown> | string): Buffer {
        if (typeof message === 'string') {
            return Buffer.from(message);
        }

        return Buffer.from(JSON.stringify(message));
    }

    /**
     * Serialize headers for Kafka
     * @param headers The headers to serialize
     * @returns The serialized headers
     */
    private serializeHeaders(headers: Record<string, string>): Record<string, Buffer> {
        const result: Record<string, Buffer> = {};

        for (const [key, value] of Object.entries(headers)) {
            result[key] = Buffer.from(value);
        }

        return result;
    }
}
