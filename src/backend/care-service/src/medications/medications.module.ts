import { Module } from '@nestjs/common'; // v10.0.0+
import { TypeOrmModule } from '@nestjs/typeorm'; // latest

import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { Medication } from './entities/medication.entity';

/**
 * Configures the MedicationsModule for managing medication-related features.
 * This module is responsible for medication tracking within the Care Now journey,
 * allowing users to manage their medications, set reminders, and monitor adherence.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Medication])],
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}