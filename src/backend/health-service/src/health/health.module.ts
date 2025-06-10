import { Module } from '@nestjs/common'; // NestJS Common 10.0.0+
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthMetric } from './entities/health-metric.entity';
import { HealthGoal } from './entities/health-goal.entity';
import { DevicesModule } from '../devices/devices.module';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { WearablesModule } from '../integrations/wearables/wearables.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';

/**
 * Configures the HealthModule, which aggregates the controller and service responsible for managing health data.
 */
@Module({
  imports: [DevicesModule, ExceptionsModule, LoggerModule, WearablesModule, KafkaModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {
  /**
   * The constructor is empty as this is a module class.
   */
  constructor() {}
}