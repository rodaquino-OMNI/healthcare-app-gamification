import { Module } from '@nestjs/common'; // @nestjs/common 10.0.0+
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';

/**
 * Module that encapsulates insurance-related functionality.
 * This module is part of the Plan service and provides 
 * coverage verification and other insurance-related operations
 * for the My Plan & Benefits journey.
 */
@Module({
  controllers: [InsuranceController],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}