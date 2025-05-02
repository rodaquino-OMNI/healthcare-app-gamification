import { Module } from '@nestjs/common'; // @nestjs/common 10.0.0
import { TypeOrmModule } from '@nestjs/typeorm'; // @nestjs/typeorm 10.0.0
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { KafkaModule } from '@app/shared/kafka/kafka.module'; // @app/shared ^1.0.0
import { LoggerModule } from '@app/shared/logging/logger.module'; // @app/shared ^1.0.0
import { RedisModule } from '@app/shared/redis/redis.module'; // @app/shared ^1.0.0
import { TracingModule } from '@app/shared/tracing/tracing.module'; // @app/shared ^1.0.0

/**
 * Module for managing achievements in the gamification system.
 * This module is responsible for configuring the necessary dependencies
 * for working with achievements across all journeys.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement]), KafkaModule, RedisModule, LoggerModule, TracingModule],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}