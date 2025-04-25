import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { LoggerModule } from '../logging/logger.module';

/**
 * Module that provides Redis integration across the AUSTA SuperApp.
 * Makes RedisService available for dependency injection throughout the application,
 * supporting caching with journey-specific TTLs, pub/sub messaging for real-time features,
 * gamification state management (leaderboards, achievements), and session handling.
 * 
 * This global module enables all journey services to access Redis functionality
 * in a consistent manner without having to import the RedisModule in each module.
 */
@Global()
@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}