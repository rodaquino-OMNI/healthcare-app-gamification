import { SetMetadata } from '@nestjs/common';

export const PHI_ACCESS_KEY = 'phi_access';

export interface PhiAccessMetadata {
    resourceType: string;
    isPhi: true;
}

/**
 * Marks an endpoint as accessing Protected Health Information (PHI).
 * When applied, the AuditInterceptor will log LGPD-compliant PHI access entries.
 *
 * @param resourceType - The type of PHI resource being accessed (e.g., "HealthMetric", "Appointment")
 */
export const PhiAccess = (resourceType: string): MethodDecorator & ClassDecorator =>
    SetMetadata<string, PhiAccessMetadata>(PHI_ACCESS_KEY, { resourceType, isPhi: true });
