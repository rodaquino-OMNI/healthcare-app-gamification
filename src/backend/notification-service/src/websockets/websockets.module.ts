import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisModule } from '@app/shared/redis/redis.module';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { Module } from '@nestjs/common';

import { WebsocketsGateway } from './websockets.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
    imports: [KafkaModule, RedisModule],
    providers: [WebsocketsGateway, NotificationsService, LoggerService, TracingService],
    exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
