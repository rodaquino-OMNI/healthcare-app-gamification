import { Module } from '@nestjs/common'; // v10.0.0+
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';

/**
 * Configures the SymptomCheckerModule, which encapsulates the symptom checker functionality
 * for the Care Now journey. This module is part of the Care Service and implements
 * requirement F-102-RQ-001 allowing users to input symptoms and receive preliminary guidance.
 */
@Module({
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
})
export class SymptomCheckerModule {}