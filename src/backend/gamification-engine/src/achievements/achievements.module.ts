import { Module } from '@nestjs/common'; // @nestjs/common 10.0.0
import { TypeOrmModule } from '@nestjs/typeorm'; // @nestjs/typeorm 10.0.0
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { RedisModule } from 'src/backend/shared/src/redis/redis.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';
import { PrismaService } from 'src/backend/shared/src/database/prisma.service';

/**
 * Module for managing achievements in the gamification system.
 * This module is responsible for configuring the necessary dependencies
 * for working with achievements across all journeys.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement]), KafkaModule, RedisModule, LoggerModule, TracingModule],
  controllers: [AchievementsController],
  providers: [AchievementsService, PrismaService],
  exports: [AchievementsService],
})
export class AchievementsModule {}