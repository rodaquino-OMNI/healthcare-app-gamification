import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { ConsentGuard, RequireConsent } from '@app/shared/consent';
import { ConsentType } from '@app/shared/consent';
import { FhirService } from './fhir.service';

/**
 * Controller exposing FHIR R4-compliant patient data endpoints.
 *
 * All routes require:
 * 1. JWT authentication (JwtAuthGuard)
 * 2. Role-based access (RolesGuard)
 * 3. Active HEALTH_DATA_SHARING consent (ConsentGuard + @RequireConsent)
 *
 * userId scoping is enforced at the service layer — FhirService throws
 * ForbiddenException when patientId !== requestingUserId.
 */
@ApiTags('fhir')
@Controller('api/fhir')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FhirController {
  constructor(private readonly fhirService: FhirService) {}

  /**
   * Retrieves a patient record from the FHIR-compliant system.
   * Requires HEALTH_DATA_SHARING consent.
   */
  @Get('patient/:patientId')
  @UseGuards(ConsentGuard)
  @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
  @ApiOperation({ summary: 'Get patient record (FHIR R4)' })
  @ApiResponse({ status: 200, description: 'Patient record retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied or consent not granted' })
  async getPatientRecord(
    @Param('patientId') patientId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.fhirService.getPatientRecord(patientId, req.user.id);
  }

  /**
   * Retrieves a patient's medical history from the FHIR-compliant system.
   * Requires HEALTH_DATA_SHARING consent.
   */
  @Get('patient/:patientId/history')
  @UseGuards(ConsentGuard)
  @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
  @ApiOperation({ summary: 'Get medical history (FHIR R4)' })
  @ApiResponse({ status: 200, description: 'Medical history retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied or consent not granted' })
  async getMedicalHistory(
    @Param('patientId') patientId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.fhirService.getMedicalHistory(patientId, req.user.id);
  }

  /**
   * Retrieves health metrics of a specific type from the FHIR-compliant system.
   * Requires HEALTH_DATA_SHARING consent.
   */
  @Get('patient/:patientId/metrics/:metricType')
  @UseGuards(ConsentGuard)
  @RequireConsent(ConsentType.HEALTH_DATA_SHARING)
  @ApiOperation({ summary: 'Get health metrics by type (FHIR R4)' })
  @ApiResponse({ status: 200, description: 'Health metrics retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied or consent not granted' })
  async getHealthMetrics(
    @Param('patientId') patientId: string,
    @Param('metricType') metricType: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.fhirService.getHealthMetricsFromFhir(
      patientId,
      metricType,
      req.user.id,
    );
  }
}
