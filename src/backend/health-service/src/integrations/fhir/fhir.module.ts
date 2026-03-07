import { ConsentModule } from '@app/shared/consent';
import { Module } from '@nestjs/common'; // NestJS Common 9.0.0+

import { FhirController } from './fhir.controller';
import { FhirService } from './fhir.service';

/**
 * Configures the FHIR integration module for the Health Service.
 * This module provides functionality to interact with external FHIR-compliant healthcare systems
 * for retrieving patient records and medical history data.
 *
 * Imports ConsentModule to enable ConsentGuard on FHIR endpoints,
 * ensuring HEALTH_DATA_SHARING consent is verified before data access.
 *
 * Addresses requirement:
 * - F-101: Integrates with external health record systems to retrieve medical history
 * - SEC-03: LGPD consent enforcement on health data endpoints
 */
@Module({
    imports: [ConsentModule],
    controllers: [FhirController],
    providers: [FhirService],
    exports: [FhirService],
})
export class FhirModule {}
