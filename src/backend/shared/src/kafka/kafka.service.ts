import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'; // v10.0+
import { ConfigService } from '@nestjs/config'; // *
import { Kafka, Producer, Consumer } from 'kafkajs'; // v2.0+
import { LoggerService } from '../logging/logger.service';
import { TracingService } from '../tracing/tracing.service';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

/**
 * Provides Kafka integration for asynchronous communication between microservices.
 * Handles connection management, message serialization, and error handling.
 * Used primarily for event-driven architecture in the gamification engine.
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private readonly logger: LoggerService;
  private readonly tracingService: TracingService;

  /**
   * Initializes the Kafka service with configuration and required dependencies.
   * 
   * @param configService - Service for accessing configuration variables
   * @param logger - Logger service for operational logging
   * @param tracingService - Service for distributed tracing
   */
  constructor(
    private readonly configService: ConfigService,
    logger: LoggerService,
    tracingService: TracingService
  ) {
    const brokers = this.configService.get<string>('kafka.brokers', 'localhost:9092').split(',');
    const clientId = this.configService.get<string>('kafka.clientId', 'austa-service');

    this.kafka = new Kafka({
      clientId,
      brokers,
      ssl: this.configService.get<boolean>('kafka.ssl', false),
      sasl: this.getSaslConfig(),
      retry: {
        initialRetryTime: 300,
        retries: 10
      }
    });

    this.logger = logger;
    this.tracingService = tracingService;
    this.logger.log(`Initialized Kafka service with brokers: ${brokers.join(', ')}`, 'KafkaService');
  }

  /**
   * Initializes the Kafka producer and consumer when the module is initialized.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.connectProducer();
      await this.connectConsumer();
      this.logger.log('Kafka service initialized successfully', 'KafkaService');
    } catch (error) {
      this.logger.error('Failed to initialize Kafka service', error, 'KafkaService');
      throw error;
    }
  }

  /**
   * Disconnects the Kafka producer and consumer when the module is destroyed.
   */
  async onModuleDestroy(): Promise<void> {
    try {
      await this.disconnectProducer();
      await this.disconnectConsumer();
      this.logger.log('Kafka service destroyed successfully', 'KafkaService');
    } catch (error) {
      this.logger.error('Error during Kafka service shutdown', error, 'KafkaService');
    }
  }

  /**
   * Sends a message to a Kafka topic with tracing and error handling.
   * 
   * @param topic - The Kafka topic to send the message to
   * @param message - The message object to be serialized and sent
   * @param key - Optional message key for partitioning
   * @param headers - Optional message headers
   */
  async produce(
    topic: string, 
    message: any, 
    key?: string, 
    headers?: Record<string, string>
  ): Promise<void> {
    return this.tracingService.createSpan(`kafka.produce.${topic}`, async () => {
      try {
        const serializedMessage = this.serializeMessage(message);
        
        await this.producer.send({
          topic,
          messages: [
            {
              value: serializedMessage,
              key: key || undefined,
              headers: headers || undefined
            }
          ]
        });
        
        this.logger.debug(
          `Message sent to topic ${topic}: ${serializedMessage.substring(0, 100)}${serializedMessage.length > 100 ? '...' : ''}`,
          'KafkaService'
        );
      } catch (error) {
        this.logger.error(`Failed to produce message to topic ${topic}`, error, 'KafkaService');
        throw new AppException(
          `Failed to produce message to topic ${topic}`,
          ErrorType.EXTERNAL,
          'KAFKA_001',
          { topic },
          error
        );
      }
    });
  }

  /**
   * Subscribes to a Kafka topic and processes messages.
   * 
   * @param topic - The Kafka topic to subscribe to
   * @param groupId - The consumer group ID
   * @param callback - The function to process each message
   */
  async consume(
    topic: string,
    groupId: string,
    callback: (message: any, key?: string, headers?: Record<string, string>) => Promise<void>
  ): Promise<void> {
    try {
      const consumer = this.kafka.consumer({ groupId });
      
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const messageKey = message.key?.toString();
          const messageHeaders = this.parseHeaders(message.headers);
          
          return this.tracingService.createSpan(`kafka.consume.${topic}`, async () => {
            try {
              const parsedMessage = this.deserializeMessage(message.value);
              
              this.logger.debug(
                `Processing message from topic ${topic}, partition ${partition}`,
                'KafkaService'
              );
              
              await callback(parsedMessage, messageKey, messageHeaders);
            } catch (error) {
              this.logger.error(
                `Error processing message from topic ${topic}, partition ${partition}`,
                error,
                'KafkaService'
              );
              // Don't rethrow to prevent consumer from crashing
            }
          });
        }
      });
      
      this.logger.log(`Subscribed to topic ${topic} with group ID ${groupId}`, 'KafkaService');
    } catch (error) {
      this.logger.error(`Failed to consume from topic ${topic}`, error, 'KafkaService');
      throw new AppException(
        `Failed to consume from topic ${topic}`,
        ErrorType.EXTERNAL,
        'KAFKA_002',
        { topic, groupId },
        error
      );
    }
  }

  /**
   * Connects to Kafka as a producer.
   * @private
   */
  private async connectProducer(): Promise<void> {
    try {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: this.configService.get<boolean>('kafka.allowAutoTopicCreation', true),
        transactionalId: this.configService.get<string>('kafka.transactionalId')
      });
      
      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully', 'KafkaService');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer', error, 'KafkaService');
      throw new AppException(
        'Failed to connect Kafka producer',
        ErrorType.EXTERNAL,
        'KAFKA_003',
        {},
        error
      );
    }
  }

  /**
   * Disconnects the Kafka producer.
   * @private
   */
  private async disconnectProducer(): Promise<void> {
    if (this.producer) {
      try {
        await this.producer.disconnect();
        this.logger.log('Kafka producer disconnected successfully', 'KafkaService');
      } catch (error) {
        this.logger.error('Error disconnecting Kafka producer', error, 'KafkaService');
      }
    }
  }

  /**
   * Connects to Kafka as a consumer.
   * @private
   */
  private async connectConsumer(): Promise<void> {
    try {
      const groupId = this.configService.get<string>('kafka.groupId', 'austa-consumer-group');
      
      this.consumer = this.kafka.consumer({ 
        groupId,
        sessionTimeout: this.configService.get<number>('kafka.sessionTimeout', 30000),
        heartbeatInterval: this.configService.get<number>('kafka.heartbeatInterval', 3000)
      });
      
      await this.consumer.connect();
      this.logger.log(`Kafka consumer connected successfully with group ID ${groupId}`, 'KafkaService');
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer', error, 'KafkaService');
      throw new AppException(
        'Failed to connect Kafka consumer',
        ErrorType.EXTERNAL,
        'KAFKA_004',
        {},
        error
      );
    }
  }

  /**
   * Disconnects the Kafka consumer.
   * @private
   */
  private async disconnectConsumer(): Promise<void> {
    if (this.consumer) {
      try {
        await this.consumer.disconnect();
        this.logger.log('Kafka consumer disconnected successfully', 'KafkaService');
      } catch (error) {
        this.logger.error('Error disconnecting Kafka consumer', error, 'KafkaService');
      }
    }
  }

  /**
   * Serializes a message to JSON string.
   * @private
   */
  private serializeMessage(message: any): Buffer {
    try {
      return Buffer.from(JSON.stringify(message));
    } catch (error) {
      this.logger.error('Failed to serialize message', error, 'KafkaService');
      throw new AppException(
        'Failed to serialize message',
        ErrorType.TECHNICAL,
        'KAFKA_005',
        {},
        error
      );
    }
  }

  /**
   * Deserializes a message from JSON string.
   * @private
   */
  private deserializeMessage(buffer: Buffer): any {
    try {
      const message = buffer.toString();
      return JSON.parse(message);
    } catch (error) {
      this.logger.error('Failed to deserialize message', error, 'KafkaService');
      throw new AppException(
        'Failed to deserialize message',
        ErrorType.TECHNICAL,
        'KAFKA_006',
        {},
        error
      );
    }
  }

  /**
   * Parses Kafka message headers from binary to string key-value pairs.
   * @private
   */
  private parseHeaders(headers: Record<string, Buffer>): Record<string, string> {
    const result: Record<string, string> = {};
    
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        result[key] = value?.toString();
      });
    }
    
    return result;
  }

  /**
   * Gets SASL configuration if enabled.
   * @private
   */
  private getSaslConfig(): { mechanism: string; username: string; password: string } | undefined {
    const saslEnabled = this.configService.get<boolean>('kafka.sasl.enabled', false);
    
    if (!saslEnabled) {
      return undefined;
    }
    
    return {
      mechanism: this.configService.get<string>('kafka.sasl.mechanism', 'plain'),
      username: this.configService.get<string>('kafka.sasl.username', ''),
      password: this.configService.get<string>('kafka.sasl.password', '')
    };
  }
}