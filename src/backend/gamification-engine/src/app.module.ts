import { Module } from '@nestjs/common'; // v10.0.0+
import { ConfigModule, ConfigService } from '@nestjs/config'; // v3.1.1
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsModule } from './achievements/achievements.module';
import { EventsModule } from './events/events.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ProfilesModule } from './profiles/profiles.module';
import { QuestsModule } from './quests/quests.module';
import { RewardsModule } from './rewards/rewards.module';
import { RulesModule } from './rules/rules.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { gamificationEngine } from './config/configuration';
import { databaseConfig } from './config/database.config';
import { validationSchema } from './config/validation.schema';
import { DatabaseErrorHandler } from './database/database-error.handler';

/**
 * Root module for the Gamification Engine service.
 * It imports and configures all the necessary modules for the service,
 * including feature modules (Achievements, Events, Profiles, Quests, Rewards, Rules),
 * shared modules (Kafka, Redis, Logger, Tracing, Exceptions), and the ConfigModule.
 */
@Module({
  imports: [
    // Load and validate configuration FIRST, before any other modules
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gamificationEngine, databaseConfig], // Include databaseConfig
      validationSchema: validationSchema,
      validationOptions: {
        abortEarly: false, // Show all validation errors at once
      },
      cache: true, // Important for preventing reload issues
    }),
    
    // Add TypeORM configuration with async factory to ensure config is loaded first
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: DatabaseErrorHandler.createTypeOrmOptions,
    }),
    
    // Shared infrastructure modules
    LoggerModule,
    ExceptionsModule,
    TracingModule,
    
    // Data storage modules 
    RedisModule,
    
    // Messaging modules
    KafkaModule,
    
    // Feature modules - order matters for proper initialization
    ProfilesModule,    // Load first as other modules depend on profiles
    AchievementsModule,
    RulesModule,
    QuestsModule,
    RewardsModule,
    LeaderboardModule,
    EventsModule,
  ],
  controllers: [],
  providers: [DatabaseErrorHandler],
})
export class AppModule {}