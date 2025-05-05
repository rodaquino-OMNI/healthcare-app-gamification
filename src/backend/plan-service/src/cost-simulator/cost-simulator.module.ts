import { Module } from '@nestjs/common';
import { CostSimulatorService } from './cost-simulator.service';
import { CostSimulatorController } from './cost-simulator.controller';

@Module({
  imports: [],
  controllers: [CostSimulatorController],
  providers: [CostSimulatorService],
  exports: [CostSimulatorService]
})
export class CostSimulatorModule {}