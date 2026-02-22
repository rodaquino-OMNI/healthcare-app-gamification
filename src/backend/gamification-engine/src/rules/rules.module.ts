import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { ConfigModule } from '@nestjs/config';

/**
 * Configures the RulesModule, making the RulesService available for dependency injection.
 * This module is responsible for managing gamification rules, which determine how points
 * and achievements are awarded based on user actions across all journeys.
 */
@Module({
  imports: [
    KafkaModule,
    LoggerModule,
    ExceptionsModule,
    ProfilesModule,
    AchievementsModule,
    ConfigModule
  ],
  providers: [RulesService],
  controllers: [],
  exports: [RulesService],
})
export class RulesModule {}