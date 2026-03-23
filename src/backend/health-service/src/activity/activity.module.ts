import { ConsentModule } from '@app/shared/consent';
import { PrismaService } from '@app/shared/database/prisma.service';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
    imports: [
        ConfigModule,
        ConsentModule,
        ExceptionsModule,
        LoggerModule,
        KafkaModule,
        RedisModule,
    ],
    controllers: [ActivityController],
    providers: [ActivityService, PrismaService],
    exports: [ActivityService],
})
export class ActivityModule {}
