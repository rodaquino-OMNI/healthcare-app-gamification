import { Module } from '@nestjs/common'; // v10.0.0+
import { ConfigModule } from '@nestjs/config'; // v3.1.1
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

/**
 * Root module for the Gamification Engine service.
 * It imports and configures all the necessary modules for the service,
 * including feature modules (Achievements, Events, Profiles, Quests, Rewards, Rules),
 * shared modules (Kafka, Redis, Logger, Tracing, Exceptions), and the ConfigModule.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gamificationEngine],
    }),
    AchievementsModule,
    EventsModule,
    LeaderboardModule,
    ProfilesModule,
    QuestsModule,
    RewardsModule,
    RulesModule,
    KafkaModule,
    RedisModule,
    LoggerModule,
    TracingModule,
    ExceptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  /**
   * The constructor is empty as this is a module class.
   */
  constructor() {}
}