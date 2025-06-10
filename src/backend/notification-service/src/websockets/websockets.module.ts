import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';

@Module({
  imports: [KafkaModule, RedisModule],
  providers: [WebsocketsGateway, NotificationsService, LoggerService, TracingService],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}