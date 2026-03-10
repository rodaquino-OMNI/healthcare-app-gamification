import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { Module } from '@nestjs/common'; // v10.0.0+

import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { AchievementsModule } from '../achievements/achievements.module';
import { EventsModule } from '../events/events.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { QuestsModule } from '../quests/quests.module';

/**
 * Configures the RewardsModule in NestJS, which manages rewards within the gamification engine.
 * Imports and exports RewardsService and RewardsController for use in other modules.
 */
@Module({
    imports: [
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
export class RewardsModule {}
