/**
 * Compliance module barrel — unified entry point for consent, privacy, and audit.
 * Phase 1: re-export only (no file moves). Existing import paths remain valid.
 *
 * Usage: import { ConsentService, PrivacyService, AuditService } from '@app/shared/compliance';
 */
export * from '../consent';
export * from '../privacy';
export * from '../audit';
