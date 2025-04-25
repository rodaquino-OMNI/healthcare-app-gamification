import { Module } from '@nestjs/common'; // @nestjs/common 10.0.0+
import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';

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