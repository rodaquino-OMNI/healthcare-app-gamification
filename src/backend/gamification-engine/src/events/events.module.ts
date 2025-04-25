import { Module } from '@nestjs/common'; // v10.0.0+
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { KafkaProducer } from './kafka/kafka.producer';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';

/**
 * Configures the Events module, importing the controller and service, and setting up Kafka for event handling.
 * This module is responsible for processing events from all journeys (Health, Care, Plan) within the
 * gamification engine, applying rules, and updating user achievements and points.
 */
@Module({
  imports: [KafkaModule, LoggerModule, TracingModule],
  controllers: [EventsController],
  providers: [EventsService, KafkaConsumer, KafkaProducer],
  exports: [EventsService]
})
export class EventsModule {}