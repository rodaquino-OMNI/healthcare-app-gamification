import { Module } from '@nestjs/common'; // v10.0.0+
import { TypeOrmModule } from '@nestjs/typeorm'; // v10.0.0
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { Reward } from 'src/backend/gamification-engine/src/rewards/entities/reward.entity';
import { AchievementsModule } from 'src/backend/gamification-engine/src/achievements/achievements.module';
import { EventsModule } from 'src/backend/gamification-engine/src/events/events.module';
import { ProfilesModule } from 'src/backend/gamification-engine/src/profiles/profiles.module';
import { QuestsModule } from 'src/backend/gamification-engine/src/quests/quests.module';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { RedisModule } from 'src/backend/shared/src/redis/redis.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';

/**
 * Configures the RewardsModule in NestJS, which is responsible for managing rewards within the gamification engine.
 * It imports and exports the RewardsService and RewardsController, making them available for use in other modules.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Reward]),
    AchievementsModule,
    EventsModule,
    ProfilesModule,
    QuestsModule,
    KafkaModule,
    LoggerModule,
    RedisModule,
    TracingModule,
    ExceptionsModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {
  /**
   * The constructor is empty as this is a module class.
   */
  constructor() {}
}