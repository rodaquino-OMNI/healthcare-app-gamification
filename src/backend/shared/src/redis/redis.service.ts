import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { LoggerService } from '../logging/logger.service';

/**
 * Service that provides Redis functionality for caching, pub/sub messaging, and data storage
 * across the AUSTA SuperApp. This service is used for real-time features, gamification state
 * management, session handling, and performance optimization through caching.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;
  private subscriptionClient: Redis | null = null;

  /**
   * Initializes the RedisService with dependencies and configuration.
   * @param logger LoggerService for logging Redis operations and errors
   * @param configService ConfigService for accessing Redis configuration values
   */
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    const redisConfig: RedisOptions = {
      host: this.configService.get<string>('redis.host', 'localhost'),
      port: this.configService.get<number>('redis.port', 6379),
      password: this.configService.get<string>('redis.password', ''),
      db: this.configService.get<number>('redis.db', 0),
      retryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
    };

    this.client = new Redis(redisConfig);
    this.logger.log('Redis client initialized', 'RedisService');
  }

  /**
   * Lifecycle hook that runs when the module is initialized.
   * Ensures Redis connection is established and sets up error handlers.
   */
  async onModuleInit(): Promise<void> {
    try {
      // Ping Redis to verify connection
      await this.client.ping();
      this.logger.log('Successfully connected to Redis', 'RedisService');

      // Set up error event handler
      this.client.on('error', (error) => {
        this.logger.error(`Redis client error: ${error.message}`, error.stack, 'RedisService');
      });
    } catch (error) {
      this.logger.error(`Failed to connect to Redis: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Lifecycle hook that runs when the module is being destroyed.
   * Properly closes Redis connections to prevent resource leaks.
   */
  async onModuleDestroy(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
        this.logger.log('Redis client disconnected', 'RedisService');
      }

      if (this.subscriptionClient) {
        await this.subscriptionClient.quit();
        this.logger.log('Redis subscription client disconnected', 'RedisService');
      }
    } catch (error) {
      this.logger.error(`Error disconnecting Redis: ${error.message}`, error.stack, 'RedisService');
    }
  }

  /**
   * Retrieves a value from Redis by key.
   * @param key The key to retrieve
   * @returns The value associated with the key, or null if not found
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      this.logger.debug(`Redis GET: ${key}`, 'RedisService');
      return value;
    } catch (error) {
      this.logger.error(`Redis GET error for key ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Sets a value in Redis with an optional expiration time.
   * @param key The key to set
   * @param value The value to set
   * @param ttlSeconds Optional TTL in seconds
   * @returns "OK" if successful
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<string> {
    try {
      let result: string;
      if (ttlSeconds !== undefined) {
        result = await this.client.setex(key, ttlSeconds, value);
        this.logger.debug(`Redis SETEX: ${key} (TTL: ${ttlSeconds}s)`, 'RedisService');
      } else {
        result = await this.client.set(key, value);
        this.logger.debug(`Redis SET: ${key}`, 'RedisService');
      }
      return result;
    } catch (error) {
      this.logger.error(`Redis SET error for key ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Deletes one or more keys from Redis.
   * @param keys The key or keys to delete
   * @returns The number of keys that were removed
   */
  async del(keys: string | string[]): Promise<number> {
    try {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const count = await this.client.del(...keysArray);
      this.logger.debug(`Redis DEL: ${Array.isArray(keys) ? keys.join(', ') : keys}`, 'RedisService');
      return count;
    } catch (error) {
      this.logger.error(`Redis DEL error: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Checks if one or more keys exist in Redis.
   * @param keys The key or keys to check
   * @returns The number of keys that exist
   */
  async exists(keys: string | string[]): Promise<number> {
    try {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const count = await this.client.exists(...keysArray);
      this.logger.debug(`Redis EXISTS: ${Array.isArray(keys) ? keys.join(', ') : keys}`, 'RedisService');
      return count;
    } catch (error) {
      this.logger.error(`Redis EXISTS error: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Sets the expiration time for a key.
   * @param key The key to set expiration for
   * @param seconds TTL in seconds
   * @returns 1 if the timeout was set, 0 if the key does not exist
   */
  async expire(key: string, seconds: number): Promise<number> {
    try {
      const result = await this.client.expire(key, seconds);
      this.logger.debug(`Redis EXPIRE: ${key} (TTL: ${seconds}s)`, 'RedisService');
      return result;
    } catch (error) {
      this.logger.error(`Redis EXPIRE error for key ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Gets the remaining time to live of a key.
   * @param key The key to check
   * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
   */
  async ttl(key: string): Promise<number> {
    try {
      const ttl = await this.client.ttl(key);
      this.logger.debug(`Redis TTL: ${key}`, 'RedisService');
      return ttl;
    } catch (error) {
      this.logger.error(`Redis TTL error for key ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Gets the value of a hash field.
   * @param key The hash key
   * @param field The field within the hash
   * @returns The value of the field, or null if not found
   */
  async hget(key: string, field: string): Promise<string | null> {
    try {
      const value = await this.client.hget(key, field);
      this.logger.debug(`Redis HGET: ${key}.${field}`, 'RedisService');
      return value;
    } catch (error) {
      this.logger.error(`Redis HGET error for ${key}.${field}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Sets the value of a hash field.
   * @param key The hash key
   * @param field The field within the hash
   * @param value The value to set
   * @returns 1 if field is new, 0 if field was updated
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      const result = await this.client.hset(key, field, value);
      this.logger.debug(`Redis HSET: ${key}.${field}`, 'RedisService');
      return result;
    } catch (error) {
      this.logger.error(`Redis HSET error for ${key}.${field}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Sets multiple hash fields to multiple values.
   * @param key The hash key
   * @param fieldValues Object with field-value pairs
   * @returns "OK" if successful
   */
  async hmset(key: string, fieldValues: Record<string, string>): Promise<string> {
    try {
      const result = await this.client.hmset(key, fieldValues);
      this.logger.debug(`Redis HMSET: ${key} (${Object.keys(fieldValues).length} fields)`, 'RedisService');
      return result;
    } catch (error) {
      this.logger.error(`Redis HMSET error for ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Gets all fields and values in a hash.
   * @param key The hash key
   * @returns Object with field-value pairs
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      const result = await this.client.hgetall(key);
      this.logger.debug(`Redis HGETALL: ${key}`, 'RedisService');
      return result;
    } catch (error) {
      this.logger.error(`Redis HGETALL error for ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Deletes one or more hash fields.
   * @param key The hash key
   * @param fields The field or fields to delete
   * @returns The number of fields that were removed
   */
  async hdel(key: string, fields: string | string[]): Promise<number> {
    try {
      const fieldsArray = Array.isArray(fields) ? fields : [fields];
      const count = await this.client.hdel(key, ...fieldsArray);
      this.logger.debug(`Redis HDEL: ${key}.${Array.isArray(fields) ? fields.join(', ') : fields}`, 'RedisService');
      return count;
    } catch (error) {
      this.logger.error(`Redis HDEL error for ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Adds one or more members to a sorted set, or updates score if member exists.
   * Particularly useful for leaderboards in the gamification system.
   * @param key The sorted set key
   * @param score The score to assign
   * @param member The member to add
   * @returns The number of elements added (not including updates)
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      const result = await this.client.zadd(key, score, member);
      this.logger.debug(`Redis ZADD: ${key} ${score} ${member}`, 'RedisService');
      return result;
    } catch (error) {
      this.logger.error(`Redis ZADD error for ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Returns a range of members in a sorted set by index, with optional scores.
   * @param key The sorted set key
   * @param start The starting index
   * @param stop The ending index
   * @param withScores Whether to include scores in the result
   * @returns Array of members or [member, score] pairs
   */
  async zrange(
    key: string,
    start: number,
    stop: number,
    withScores = false,
  ): Promise<string[] | Array<[string, string]>> {
    try {
      const args = withScores ? ['WITHSCORES'] : [];
      const result = await this.client.zrange(key, start, stop, ...args);
      this.logger.debug(`Redis ZRANGE: ${key} ${start} ${stop}${withScores ? ' WITHSCORES' : ''}`, 'RedisService');
      
      // Convert flat array to array of [member, score] pairs if withScores is true
      if (withScores && Array.isArray(result)) {
        const pairs: Array<[string, string]> = [];
        for (let i = 0; i < result.length; i += 2) {
          pairs.push([result[i], result[i + 1]]);
        }
        return pairs;
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Redis ZRANGE error for ${key}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Publishes a message to a channel for real-time communication.
   * @param channel The channel to publish to
   * @param message The message to publish
   * @returns The number of clients that received the message
   */
  async publish(channel: string, message: string): Promise<number> {
    try {
      const recipients = await this.client.publish(channel, message);
      this.logger.debug(`Redis PUBLISH: ${channel} (${recipients} recipients)`, 'RedisService');
      return recipients;
    } catch (error) {
      this.logger.error(`Redis PUBLISH error for ${channel}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Subscribes to a channel and registers a callback for messages.
   * @param channel The channel to subscribe to
   * @param callback Function to call when messages are received
   */
  async subscribe(channel: string, callback: (message: string, channel: string) => void): Promise<void> {
    try {
      // Create a separate client for subscription if it doesn't exist
      if (!this.subscriptionClient) {
        const redisConfig: RedisOptions = {
          host: this.configService.get<string>('redis.host', 'localhost'),
          port: this.configService.get<number>('redis.port', 6379),
          password: this.configService.get<string>('redis.password', ''),
          db: this.configService.get<number>('redis.db', 0),
          retryStrategy: (times) => {
            const delay = Math.min(times * 100, 3000);
            return delay;
          },
        };

        this.subscriptionClient = new Redis(redisConfig);
        
        // Set up message event handler
        this.subscriptionClient.on('message', (chan, message) => {
          callback(message, chan);
        });
        
        // Set up error event handler
        this.subscriptionClient.on('error', (error) => {
          this.logger.error(`Redis subscription client error: ${error.message}`, error.stack, 'RedisService');
        });
      }
      
      // Subscribe to the specified channel
      await this.subscriptionClient.subscribe(channel);
      this.logger.log(`Subscribed to Redis channel: ${channel}`, 'RedisService');
    } catch (error) {
      this.logger.error(`Redis SUBSCRIBE error for ${channel}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Unsubscribes from a channel.
   * @param channel The channel to unsubscribe from
   */
  async unsubscribe(channel: string): Promise<void> {
    try {
      if (this.subscriptionClient) {
        await this.subscriptionClient.unsubscribe(channel);
        this.logger.log(`Unsubscribed from Redis channel: ${channel}`, 'RedisService');
      }
    } catch (error) {
      this.logger.error(`Redis UNSUBSCRIBE error for ${channel}: ${error.message}`, error.stack, 'RedisService');
      throw error;
    }
  }

  /**
   * Gets the appropriate TTL for a journey-specific cache item.
   * Different journeys have different caching requirements based on data volatility
   * and access patterns as defined in the technical specification.
   * @param journey The journey identifier (health, care, plan, game)
   * @returns TTL in seconds based on journey type
   */
  getJourneyTTL(journey: string): number {
    switch (journey.toLowerCase()) {
      case 'health':
        // Health journey: 5 minutes TTL
        return 5 * 60;
      case 'care':
        // Care journey has real-time requirements: 1 minute TTL
        return 1 * 60;
      case 'plan':
        // Plan journey data changes less frequently: 15 minutes TTL
        return 15 * 60;
      case 'game':
        // Gamification state needs to be relatively fresh: 2 minutes TTL
        return 2 * 60;
      default:
        // Default cache duration: 5 minutes
        return 5 * 60;
    }
  }
}