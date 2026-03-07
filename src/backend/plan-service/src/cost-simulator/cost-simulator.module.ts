import { Module } from '@nestjs/common';

import { CostSimulatorController } from './cost-simulator.controller';
import { CostSimulatorService } from './cost-simulator.service';

@Module({
    imports: [],
    controllers: [CostSimulatorController],
    providers: [CostSimulatorService],
    exports: [CostSimulatorService],
})
export class CostSimulatorModule {}
