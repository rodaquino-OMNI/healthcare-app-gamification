/* eslint-disable */
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { Module } from '@nestjs/common';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { PlansModule } from '../plans/plans.module';

/**
 * Module that encapsulates the ClaimsController and ClaimsService.
 * Manages insurance claims within the Plan journey, addressing requirements
 * for Claims Submission and Claims Tracking in the My Plan & Benefits journey.
 */
@Module({
    imports: [KafkaModule, LoggerModule, ExceptionsModule, PlansModule],
    controllers: [ClaimsController],
    providers: [ClaimsService],
    exports: [ClaimsService],
})
export class ClaimsModule {}
