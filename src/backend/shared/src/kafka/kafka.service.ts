import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'; // v10.0+
import { ConfigService } from '@nestjs/config'; // *
import { Kafka, Producer, Consumer, SASLOptions, KafkaMessage, IHeaders } from 'kafkajs'; // v2.0+
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
  private kafka!: Kafka;
  private producer!: Producer;
  private consumer!: Consumer;
  private readonly logger: LoggerService;
  private readonly tracingService: TracingService;
  private readonly configNamespace = 'gamificationEngine.kafka'; // Match the namespace used in configuration.ts

  /**
   * Helper method to safely format errors
   * @private
   */
  private formatError(error: unknown): Error | undefined {
    if (error instanceof Error) {
      return error;
    } else if (typeof error === 'string') {
      return new Error(error);
    } else if (error !== null && typeof error === 'object') {
      return new Error(JSON.stringify(error));
    }
    return undefined;
  }

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
    try {
      // Get configuration with fallbacks for compatibility
      const brokers = this.getConfigValue('brokers', 'localhost:9092').split(',');
      const clientId = this.getConfigValue('clientId', 'austa-service');
      
      this.kafka = new Kafka({
        clientId,
        brokers,
        ssl: this.getConfigValue('ssl', false),
        sasl: this.getSaslConfig() as SASLOptions,
        retry: {
          initialRetryTime: 300,
          retries: 10
        }
      });
      
      this.logger = logger;
      this.tracingService = tracingService;
      this.logger.log(`Initialized Kafka service with brokers: ${brokers.join(', ')}`, 'KafkaService');
    } catch (error) {
      logger.error('Failed to initialize Kafka service', this.formatError(error), 'KafkaService');
    }
  }

  /**
   * Helper method to get config values with proper namespace handling
   * @private
   */
  private getConfigValue<T>(key: string, defaultValue: T): T {
    return this.configService.get<T>(`${this.configNamespace}.${key}`) ?? 
           this.configService.get<T>(`kafka.${key}`) ?? 
           defaultValue;
  }

  /**
   * Initializes the Kafka producer and consumer when the module is initialized.
   */
  async onModuleInit(): Promise<void> {
    try {
      if (!this.kafka) {
        const brokers = this.getConfigValue('brokers', 'localhost:9092').split(',');
        const clientId = this.getConfigValue('clientId', 'austa-service');
        
        this.kafka = new Kafka({
          clientId,
          brokers,
          ssl: this.getConfigValue('ssl', false),
          sasl: this.getSaslConfig() as SASLOptions,
          retry: {
            initialRetryTime: 300,
            retries: 10
          }
        });
      }
      
      await this.connectProducer();
      await this.connectConsumer();
      this.logger.log('Kafka service initialized successfully', 'KafkaService');
    } catch (error) {
      this.logger.error('Failed to initialize Kafka service', this.formatError(error), 'KafkaService');
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
      this.logger.error('Error during Kafka service shutdown', this.formatError(error), 'KafkaService');
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
        
        const bufferHeaders: Record<string, Buffer> | undefined = headers ? 
          Object.entries(headers).reduce((acc, [k, v]) => {
            acc[k] = Buffer.from(String(v));
            return acc;
          }, {} as Record<string, Buffer>) : 
          undefined;
        
        await this.producer.send({
          topic,
          messages: [
            {
              value: serializedMessage,
              key: key || undefined,
              headers: bufferHeaders
            }
          ]
        });
        
        const messagePreview = serializedMessage.toString('utf8').substring(0, 100);
        this.logger.debug(
          `Message sent to topic ${topic}: ${messagePreview}${serializedMessage.length > 100 ? '...' : ''}`,
          'KafkaService'
        );
      } catch (error) {
        this.logger.error(`Failed to produce message to topic ${topic}`, this.formatError(error), 'KafkaService');
        throw new AppException(
          `Failed to produce message to topic ${topic}`,
          ErrorType.EXTERNAL,
          'KAFKA_001',
          { topic },
          this.formatError(error)
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
          
          const messageHeaders = message.headers ? 
            this.parseHeaders(message.headers) : 
            {};
          
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
                this.formatError(error),
                'KafkaService'
              );
            }
          });
        }
      });
      
      this.logger.log(`Subscribed to topic ${topic} with group ID ${groupId}`, 'KafkaService');
    } catch (error) {
      this.logger.error(`Failed to consume from topic ${topic}`, this.formatError(error), 'KafkaService');
      throw new AppException(
        `Failed to consume from topic ${topic}`,
        ErrorType.EXTERNAL,
        'KAFKA_002',
        { topic, groupId },
        this.formatError(error)
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
        allowAutoTopicCreation: this.getConfigValue('allowAutoTopicCreation', true),
        transactionalId: this.getConfigValue('transactionalId', undefined)
      });
      
      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully', 'KafkaService');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer', this.formatError(error), 'KafkaService');
      throw new AppException(
        'Failed to connect Kafka producer',
        ErrorType.EXTERNAL,
        'KAFKA_003',
        {},
        this.formatError(error)
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
        this.logger.error('Error disconnecting Kafka producer', this.formatError(error), 'KafkaService');
      }
    }
  }

  /**
   * Connects to Kafka as a consumer.
   * @private
   */
  private async connectConsumer(): Promise<void> {
    try {
      const groupId = this.getConfigValue('groupId', 'austa-consumer-group');
      
      this.consumer = this.kafka.consumer({ 
        groupId,
        sessionTimeout: this.getConfigValue('sessionTimeout', 30000),
        heartbeatInterval: this.getConfigValue('heartbeatInterval', 3000)
      });
      
      await this.consumer.connect();
      this.logger.log(`Kafka consumer connected successfully with group ID ${groupId}`, 'KafkaService');
    } catch (error) {
      this.logger.error('Failed to connect Kafka consumer', this.formatError(error), 'KafkaService');
      throw new AppException(
        'Failed to connect Kafka consumer',
        ErrorType.EXTERNAL,
        'KAFKA_004',
        {},
        this.formatError(error)
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
        this.logger.error('Error disconnecting Kafka consumer', this.formatError(error), 'KafkaService');
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
      this.logger.error('Failed to serialize message', this.formatError(error), 'KafkaService');
      throw new AppException(
        'Failed to serialize message',
        ErrorType.TECHNICAL,
        'KAFKA_005',
        {},
        this.formatError(error)
      );
    }
  }

  /**
   * Deserializes a message from JSON string.
   * @private
   */
  private deserializeMessage(buffer: Buffer | null): any {
    try {
      if (!buffer) {
        return null;
      }
      
      const message = buffer.toString();
      return JSON.parse(message);
    } catch (error) {
      this.logger.error('Failed to deserialize message', this.formatError(error), 'KafkaService');
      throw new AppException(
        'Failed to deserialize message',
        ErrorType.TECHNICAL,
        'KAFKA_006',
        {},
        this.formatError(error)
      );
    }
  }

  /**
   * Parses Kafka message headers from various formats to string key-value pairs.
   * @private
   */
  private parseHeaders(headers: IHeaders): Record<string, string> {
    const result: Record<string, string> = {};
    
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (Buffer.isBuffer(value)) {
          result[key] = value.toString();
        } else if (typeof value === 'string') {
          result[key] = value;
        } else if (Array.isArray(value)) {
          result[key] = value.map(v => 
            Buffer.isBuffer(v) ? v.toString() : String(v)
          ).join(',');
        } else {
          result[key] = value !== undefined ? String(value) : '';
        }
      });
    }
    
    return result;
  }

  /**
   * Gets SASL configuration if enabled.
   * @private
   */
  private getSaslConfig(): SASLOptions | undefined {
    const saslEnabled = this.getConfigValue('sasl.enabled', false);
    
    if (!saslEnabled) {
      return undefined;
    }
    
    const mechanism = this.getConfigValue('sasl.mechanism', 'plain');
    
    switch (mechanism.toLowerCase()) {
      case 'plain':
        return {
          mechanism: 'plain',
          username: this.getConfigValue('sasl.username', ''),
          password: this.getConfigValue('sasl.password', '')
        };
      case 'scram-sha-256':
        return {
          mechanism: 'scram-sha-256',
          username: this.getConfigValue('sasl.username', ''),
          password: this.getConfigValue('sasl.password', '')
        };
      case 'scram-sha-512':
        return {
          mechanism: 'scram-sha-512',
          username: this.getConfigValue('sasl.username', ''),
          password: this.getConfigValue('sasl.password', '')
        };
      default:
        this.logger.warn(`Unsupported SASL mechanism: ${mechanism}. Using 'plain' instead.`, 'KafkaService');
        return {
          mechanism: 'plain',
          username: this.getConfigValue('sasl.username', ''),
          password: this.getConfigValue('sasl.password', '')
        };
    }
  }
}