/* eslint-disable */
import { ConsentModule } from '@app/shared/consent';
import { PrismaService } from '@app/shared/database/prisma.service';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { Module } from '@nestjs/common'; // NestJS Common 10.0.0+
import { ConfigModule } from '@nestjs/config';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { DevicesModule } from '../devices/devices.module';
import { WearablesModule } from '../integrations/wearables/wearables.module';

/**
 * Configures the HealthModule aggregating the controller and service for managing health data.
 */
@Module({
    imports: [
        ConfigModule,
        ConsentModule,
        DevicesModule,
        ExceptionsModule,
        LoggerModule,
        WearablesModule,
        KafkaModule,
        RedisModule,
    ],
    controllers: [HealthController],
    providers: [HealthService, PrismaService],
    exports: [HealthService],
})
export class HealthModule {
    /**
     * The constructor is empty as this is a module class.
     */
    constructor() {}
}
