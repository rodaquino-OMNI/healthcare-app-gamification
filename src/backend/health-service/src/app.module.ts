import { AuditModule, AuditInterceptor } from '@app/shared/audit';
import { Module } from '@nestjs/common'; // NestJS Common 10.0.0+
import { ConfigModule } from '@nestjs/config'; // NestJS Config 2.3.1+
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { ActivityModule } from './activity/activity.module'; // Manages activity tracking and fitness data for the Health Journey
import { health } from './config/configuration'; // Configuration function for the Health Service
import { validationSchema } from './config/validation.schema'; // Validation schema for environment variables
import { CycleModule } from './cycle/cycle.module'; // Manages menstrual cycle and reproductive health tracking
import { DevicesModule } from './devices/devices.module'; // Manages device connections for health data synchronization
import { HealthModule } from './health/health.module'; // Core module for managing health metrics, goals, and medical history
import { HealthCheckModule } from './healthcheck/healthcheck.module'; // Health check endpoint for service liveness/readiness
import { InsightsModule } from './insights/insights.module'; // Provides health insights and recommendations based on user data
import { FhirModule } from './integrations/fhir/fhir.module'; // Integrates with external health record systems using FHIR standard
import { WearablesModule } from './integrations/wearables/wearables.module'; // Manages integration with various wearable devices
import { NutritionModule } from './nutrition/nutrition.module'; // Manages nutritional intake tracking and dietary goals
import { SleepModule } from './sleep/sleep.module'; // Manages sleep tracking, quality analysis, and sleep goals
import { WellnessModule } from './wellness/wellness.module'; // Manages AI wellness companion chat and recommendations
import { PrismaService } from '../../shared/src/database/prisma.service'; // Database access service using Prisma ORM
import { ExceptionsModule } from '../../shared/src/exceptions/exceptions.module'; // Provides global exception handling
import { KafkaModule } from '../../shared/src/kafka/kafka.module'; // Enables event streaming for gamification and notifications
import { LoggerModule } from '../../shared/src/logging/logger.module'; // Provides consistent logging across the service
import { RedisModule } from '../../shared/src/redis/redis.module'; // Provides caching and real-time data capabilities
import { TracingModule } from '../../shared/src/tracing/tracing.module'; // Enables distributed tracing for monitoring and debugging

/**
 * Root module for the Health Service orchestrating all components for the My Health Journey.
 * Configures health data management, device connections, integrations, and cross-cutting concerns.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            // Configures the ConfigModule to load environment variables and validate them.
            load: [health], // Loads the health-specific configuration.
            validationSchema, // Joi validation schema for environment variables.
            isGlobal: true, // Makes the ConfigModule globally available.
        }),
        PrometheusModule.register(),
        LoggerModule, // Imports the LoggerModule for application-wide logging.
        ExceptionsModule, // Imports the ExceptionsModule for global exception handling.
        KafkaModule, // Imports the KafkaModule for event streaming.
        RedisModule, // Imports the RedisModule for caching.
        TracingModule, // Imports the TracingModule for distributed tracing.
        HealthModule, // Imports the HealthModule for managing health data.
        DevicesModule, // Imports the DevicesModule for managing device connections.
        InsightsModule, // Imports the InsightsModule for generating health insights.
        FhirModule, // Imports the FhirModule for integrating with external health record systems.
        WearablesModule, // Imports the WearablesModule for integrating with wearable devices.
        AuditModule,
        HealthCheckModule, // Health check endpoint for service liveness/readiness probes.
        SleepModule, // Imports the SleepModule for managing sleep tracking and analysis.
        ActivityModule, // Imports the ActivityModule for managing activity and fitness tracking.
        NutritionModule, // Manages nutritional data and dietary goals.
        CycleModule, // Manages menstrual cycle and reproductive health.
        WellnessModule, // Manages AI wellness companion chat and recommendations.
    ],
    controllers: [], // No controllers are defined directly in the AppModule.
    providers: [PrismaService, { provide: APP_INTERCEPTOR, useClass: AuditInterceptor }],
})
export class AppModule {
    /**
     * The constructor is empty as this is a module class.
     */
    constructor() {}
}
