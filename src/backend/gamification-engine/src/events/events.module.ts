/* eslint-disable */
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { Module } from '@nestjs/common';

import { EventsConsumer } from './events.consumer';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { RulesModule } from '../rules/rules.module';

/**
 * Configures the Events module, importing the controller, service, and Kafka
 * for event handling. Processes events from all journeys (Health, Care, Plan),
 * applying rules and updating achievements.
 */
@Module({
    imports: [KafkaModule, LoggerModule, TracingModule, RulesModule],
    controllers: [EventsController],
    providers: [EventsService, EventsConsumer],
    exports: [EventsService],
})
export class EventsModule {}
