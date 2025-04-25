import { Module } from '@nestjs/common'; // @nestjs/common v10.0.0+
import { ConfigModule } from '@nestjs/config'; // @nestjs/config v10.0.0+
import { TypeOrmModule } from '@nestjs/typeorm'; // @nestjs/typeorm v10.0.0+

import { NotificationsModule } from './notifications/notifications.module';
import { PreferencesModule } from './preferences/preferences.module';
import { TemplatesModule } from './templates/templates.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { notification } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { LoggerModule } from 'src/backend/shared/src/logging/logger.module';
import { RedisModule } from 'src/backend/shared/src/redis/redis.module';
import { TracingModule } from 'src/backend/shared/src/tracing/tracing.module';
import { Notification } from './notifications/entities/notification.entity';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Notification],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    NotificationsModule,
    PreferencesModule,
    TemplatesModule,
    WebsocketsModule,
    KafkaModule,
    LoggerModule,
    RedisModule,
    TracingModule,
  ],
})
export class AppModule {}