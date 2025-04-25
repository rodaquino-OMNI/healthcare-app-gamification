import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RulesService } from './rules.service';
import { Rule } from './entities/rule.entity';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';

/**
 * Configures the RulesModule, making the RulesService available for dependency injection.
 * This module is responsible for managing gamification rules, which determine how points
 * and achievements are awarded based on user actions across all journeys.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Rule]), KafkaModule, LoggerModule, ExceptionsModule],
  providers: [RulesService],
  controllers: [],
  exports: [RulesService],
})
export class RulesModule {}