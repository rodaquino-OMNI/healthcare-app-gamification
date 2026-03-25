import { Module } from '@nestjs/common'; // v10.0.0+

import { AppointmentsNotificationService } from './appointments-notification.service';
import { AppointmentsSchedulingService } from './appointments-scheduling.service';
import { AppointmentsValidationService } from './appointments-validation.service';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

/**
 * Configures the AppointmentsModule for managing appointment-related features.
 * This module is responsible for appointment booking and management within the Care Now journey,
 * allowing users to schedule, modify, and cancel appointments with healthcare providers.
 *
 * Internal services:
 * - AppointmentsValidationService: date, availability, and conflict validation
 * - AppointmentsNotificationService: Kafka event publishing
 * - AppointmentsSchedulingService: core CRUD and lifecycle operations
 * - AppointmentsService: public facade consumed by controllers
 *
 * Note: PrismaService is provided globally via DatabaseModule in the root AppModule.
 */
@Module({
    controllers: [AppointmentsController],
    providers: [
        AppointmentsValidationService,
        AppointmentsNotificationService,
        AppointmentsSchedulingService,
        AppointmentsService,
    ],
    exports: [AppointmentsService],
})
export class AppointmentsModule {}
