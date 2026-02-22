import { Module } from '@nestjs/common'; // v10.0.0+
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config'; // v3.1.1
import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { DatabaseModule } from '@app/shared/database/database.module';
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
import { HealthModule } from './health/health.module';

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

    // Global database module providing PrismaService
    DatabaseModule,

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
    AuditModule,
    HealthModule,
  ],
  controllers: [],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {}