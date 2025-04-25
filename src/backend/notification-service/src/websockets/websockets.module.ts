import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { KafkaModule } from 'src/backend/shared/src/kafka/kafka.module';
import { RedisModule } from 'src/backend/shared/src/redis/redis.module';
import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
import { TracingService } from 'src/backend/shared/src/tracing/tracing.service';

@Module({
  imports: [KafkaModule, RedisModule],
  providers: [WebsocketsGateway, NotificationsService, LoggerService, TracingService],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}