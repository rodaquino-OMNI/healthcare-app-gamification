import { Module } from '@nestjs/common'; // ^9.0.0
import { TreatmentsService } from './treatments.service';
import { TreatmentsController } from './treatments.controller';
import { SharedModule } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreatmentPlan } from './entities/treatment-plan.entity';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';

/**
 * Configures the TreatmentsModule in NestJS, which encapsulates the treatment plan-related features
 * within the Care Service. This module imports and exports the TreatmentsService 
 * and TreatmentsController, making them available for use by other modules within the Care Service.
 * 
 * This module implements the Treatment Plan Execution requirement (F-102-RQ-005) from the Care Now journey,
 * allowing users to view and track progress of their prescribed treatment plans.
 */
@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([TreatmentPlan])
  ],
  controllers: [TreatmentsController],
  providers: [
    TreatmentsService,
    PrismaService,
    LoggerService,
    TracingService
  ],
  exports: [TreatmentsService],
})
export class TreatmentsModule {}