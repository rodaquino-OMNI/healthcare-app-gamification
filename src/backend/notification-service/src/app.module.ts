import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { DatabaseModule } from '@app/shared/database/database.module';

import { NotificationsModule } from './notifications/notifications.module';
import { PreferencesModule } from './preferences/preferences.module';
import { TemplatesModule } from './templates/templates.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { notification } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { HealthModule } from './health/health.module';

/**
 * Main module for the Notification Service that configures all required components.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [notification],
      validationSchema,
      isGlobal: true,
    }),
    DatabaseModule,
    NotificationsModule,
    PreferencesModule,
    TemplatesModule,
    WebsocketsModule,
    KafkaModule,
    LoggerModule,
    RedisModule,
    TracingModule,
    AuditModule,
    HealthModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {}
