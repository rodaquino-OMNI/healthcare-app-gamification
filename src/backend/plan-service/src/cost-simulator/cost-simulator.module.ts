import { Module } from '@nestjs/common';
import { CostSimulatorController } from './cost-simulator.controller';
import { CostSimulatorService } from './cost-simulator.service';
import { ConfigurationModule } from '../config/configuration';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { PlansModule } from '../plans/plans.module';

/**
 * Module that encapsulates the CostSimulatorController and CostSimulatorService.
 */
@Module({
  imports: [ConfigurationModule, ExceptionsModule, LoggerModule, PlansModule],
  controllers: [CostSimulatorController],
  providers: [CostSimulatorService],
})
export class CostSimulatorModule {}