import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PreferencesModule } from '../preferences/preferences.module';
import { TemplatesModule } from '../templates/templates.module';
import { WebsocketsModule } from '../websockets/websockets.module';

/**
 * Module that configures and provides notification functionality for the AUSTA SuperApp.
 * Aggregates required components for sending notifications across all user journeys
 * and supports gamification-related notifications.
 */
@Module({
    imports: [PreferencesModule, TemplatesModule, WebsocketsModule, KafkaModule, LoggerModule, TracingModule],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule {}
