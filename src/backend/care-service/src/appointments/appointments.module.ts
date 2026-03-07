import { Module } from '@nestjs/common'; // v10.0.0+

import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

/**
 * Configures the AppointmentsModule for managing appointment-related features.
 * This module is responsible for appointment booking and management within the Care Now journey,
 * allowing users to schedule, modify, and cancel appointments with healthcare providers.
 *
 * Note: PrismaService is provided globally via DatabaseModule in the root AppModule.
 */
@Module({
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentsModule {}
