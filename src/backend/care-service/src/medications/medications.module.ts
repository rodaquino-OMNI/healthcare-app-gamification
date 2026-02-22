import { Module } from '@nestjs/common'; // v10.0.0+

import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

/**
 * Configures the MedicationsModule for managing medication-related features.
 * This module is responsible for medication tracking within the Care Now journey,
 * allowing users to manage their medications, set reminders, and monitor adherence.
 *
 * Note: PrismaService is provided globally via DatabaseModule in the root AppModule.
 */
@Module({
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}