import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PreferencesModule } from '../preferences/preferences.module';
import { TemplatesModule } from '../templates/templates.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';

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