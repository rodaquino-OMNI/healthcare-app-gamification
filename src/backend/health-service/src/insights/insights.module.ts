import { Module } from '@nestjs/common'; // v10.0.0+
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';
import { HealthModule } from '../health/health.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';

/**
 * Configures the InsightsModule, which aggregates the controller and service responsible for generating health insights.
 */
@Module({
  imports: [HealthModule, LoggerModule, ExceptionsModule],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {
  /**
   * The constructor is empty as this is a module class.
   */
  constructor() {}
}