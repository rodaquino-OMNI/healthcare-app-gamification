import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { Module } from '@nestjs/common'; // v10.0.0+

import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

/**
 * Module that provides the ProfilesService and ProfilesController for managing user game profiles.
 */
@Module({
    imports: [KafkaModule, LoggerModule, RedisModule, TracingModule],
    controllers: [ProfilesController],
    providers: [ProfilesService],
    exports: [ProfilesService],
})
export class ProfilesModule {}
