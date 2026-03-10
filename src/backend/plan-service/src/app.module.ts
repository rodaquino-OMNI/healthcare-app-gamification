import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { DatabaseModule } from '@app/shared/database/database.module';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { TracingModule } from '@app/shared/tracing/tracing.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ClaimsModule } from './claims/claims.module';
import { planService } from './config/configuration';
import { CostSimulatorModule } from './cost-simulator/cost-simulator.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthModule } from './health/health.module';
import { InsuranceModule } from './insurance/insurance.module';
import { PlansModule } from './plans/plans.module';

/**
 * Root module for the Plan Service that configures and organizes all the necessary components.
 * Integrates insurance plan management, claims processing, cost simulation,
 * document handling, and insurance verification.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [planService],
            isGlobal: true,
        }),
        PrometheusModule.register(),
        LoggerModule,
        ExceptionsModule,
        KafkaModule,
        RedisModule,
        TracingModule,
        PlansModule,
        ClaimsModule,
        CostSimulatorModule,
        DocumentsModule,
        InsuranceModule,
        AuditModule,
        DatabaseModule,
        HealthModule,
    ],
    controllers: [],
    providers: [{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {
    /**
     * The constructor is empty as this is a module class.
     */
    constructor() {}
}
