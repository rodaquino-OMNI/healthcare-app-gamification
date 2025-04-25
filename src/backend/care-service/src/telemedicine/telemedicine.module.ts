import { Module } from '@nestjs/common'; // v10.0+
import { TelemedicineController } from './telemedicine.controller';
import { TelemedicineService } from './telemedicine.service';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { ExceptionsModule } from 'src/backend/shared/src/exceptions/exceptions.module';

/**
 * Configures the Telemedicine module, importing the necessary controllers and providers.
 * This module is responsible for managing telemedicine sessions within the Care Journey,
 * enabling real-time video consultations between patients and healthcare providers.
 */
@Module({
  imports: [KafkaModule, LoggerModule, ExceptionsModule],
  controllers: [TelemedicineController],
  providers: [TelemedicineService],
})
export class TelemedicineModule {}