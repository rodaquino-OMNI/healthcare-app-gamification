import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { PrismaService } from '@app/shared/database/prisma.service';
import { ExceptionsModule } from '@app/shared/exceptions/exceptions.module';
import { KafkaModule } from '@app/shared/kafka/kafka.module';
import { LoggerModule } from '@app/shared/logging/logger.module';
import { RedisModule } from '@app/shared/redis/redis.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Module } from '@nestjs/common'; // v10.0.0+
import { ConfigModule } from '@nestjs/config'; // v10.0.0+
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppointmentsModule } from './appointments/appointments.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { HealthModule } from './health/health.module';
import { MedicationsModule } from './medications/medications.module';
import { ProvidersModule } from './providers/providers.module';
import { SymptomCheckerModule } from './symptom-checker/symptom-checker.module';
import { TelemedicineModule } from './telemedicine/telemedicine.module';
import { TreatmentsModule } from './treatments/treatments.module';

/**
 * Root module for the Care Service that configures and organizes all the necessary modules,
 * controllers, and providers for the Care Now journey of the AUSTA SuperApp. It integrates
 * various feature modules including appointments, medications, providers, symptom checker,
 * telemedicine, and treatments, along with shared infrastructure modules.
 *
 * This module addresses the following requirements:
 * - F-102: Care Now Journey - Provides immediate healthcare access through various features.
 * - F-102-RQ-002: Appointment Booking - Enables scheduling with healthcare providers.
 * - F-102-RQ-003: Telemedicine Access - Provides video consultation capabilities.
 * - F-102-RQ-004: Medication Tracking - Tracks schedules with reminders and adherence.
 * - F-102-RQ-005: Treatment Plan Execution - Displays and tracks prescribed treatment plans.
 */
@Module({
    imports: [
        // ConfigModule: Provides configuration management for the Care Service.
        ConfigModule.forRoot({
            load: [configuration],
            validationSchema: validationSchema,
            isGlobal: true,
        }),
        PrometheusModule.register(),
        // AppointmentsModule: Provides appointment booking and management functionality.
        AppointmentsModule,
        // MedicationsModule: Provides medication tracking and reminder functionality.
        MedicationsModule,
        // ProvidersModule: Provides healthcare provider search and management functionality.
        ProvidersModule,
        // SymptomCheckerModule: Provides symptom checking and preliminary guidance functionality.
        SymptomCheckerModule,
        // TelemedicineModule: Provides video consultation capabilities with healthcare providers.
        TelemedicineModule,
        // TreatmentsModule: Provides treatment plan tracking and management functionality.
        TreatmentsModule,
        // ExceptionsModule: Provides global exception handling.
        ExceptionsModule,
        // LoggerModule: Provides logging capabilities.
        LoggerModule,
        // KafkaModule: Provides Kafka integration for event streaming and gamification events.
        KafkaModule,
        // RedisModule: Provides Redis integration for caching and real-time features.
        RedisModule,
        AuditModule,
        HealthModule,
    ],
    // PrismaService: Provides database access through Prisma ORM.
    providers: [PrismaService, { provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {
    /**
     * The constructor is empty as this is a module class.
     * @constructor
     */
    constructor() {}
}
