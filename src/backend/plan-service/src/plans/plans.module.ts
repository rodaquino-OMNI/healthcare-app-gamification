import { Module } from '@nestjs/common';

import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { ExceptionsModule } from '../../../shared/src/exceptions/exceptions.module';
import { KafkaModule } from '../../../shared/src/kafka/kafka.module';
import { LoggerModule } from '../../../shared/src/logging/logger.module';

/**
 * Configures the PlansModule, which is responsible for managing insurance plans
 * as part of the "My Plan & Benefits Journey" in the AUSTA SuperApp.
 *
 * This module encapsulates all functionality related to plan management,
 * including CRUD operations, coverage verification, and cost calculation.
 */
@Module({
    imports: [ExceptionsModule, LoggerModule, KafkaModule],
    controllers: [PlansController],
    providers: [PlansService],
    exports: [PlansService],
})
export class PlansModule {}
