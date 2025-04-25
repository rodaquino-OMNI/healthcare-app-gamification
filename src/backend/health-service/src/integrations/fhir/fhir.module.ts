import { Module } from '@nestjs/common'; // NestJS Common 9.0.0+
import { FhirService } from './fhir.service';

/**
 * Configures the FHIR integration module for the Health Service.
 * This module provides functionality to interact with external FHIR-compliant healthcare systems
 * for retrieving patient records and medical history data.
 * 
 * Addresses requirement:
 * - F-101: Integrates with external health record systems to retrieve medical history
 */
@Module({
  imports: [],
  controllers: [],
  providers: [FhirService],
  exports: [FhirService],
})
export class FhirModule {}