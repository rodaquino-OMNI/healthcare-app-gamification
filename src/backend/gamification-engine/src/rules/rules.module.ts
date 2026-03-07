/* eslint-disable */
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RulesService } from './rules.service';
import { AchievementsModule } from '../achievements/achievements.module';
import { ProfilesModule } from '../profiles/profiles.module';

/**
 * Configures the RulesModule, making the RulesService available for dependency injection.
 * This module is responsible for managing gamification rules, which determine how points
 * and achievements are awarded based on user actions across all journeys.
 */
@Module({
    // eslint-disable-next-line max-len
    imports: [KafkaModule, LoggerModule, ExceptionsModule, ProfilesModule, AchievementsModule, ConfigModule],
    providers: [RulesService],
    controllers: [],
    exports: [RulesService],
})
export class RulesModule {}
