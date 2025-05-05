import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';

/**
 * Module that encapsulates the ClaimsController and ClaimsService.
 * This module is responsible for managing insurance claims within the Plan journey,
 * addressing requirements for Claims Submission and Claims Tracking in the My Plan & Benefits journey.
 */
@Module({
  imports: [KafkaModule, LoggerModule, ExceptionsModule],
  controllers: [ClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}