/* eslint-disable */
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LoggerService } from '@app/shared/logging/logger.service';
import { TracingService } from '@app/shared/tracing/tracing.service';
import { truncate } from '@app/shared/utils/string.util';
import { HttpStatus, Injectable } from '@nestjs/common'; // NestJS Common 9.0.0+
import FhirClient from 'fhir-kit-client'; // FHIR Kit Client 4.0.0+

import { health } from '@app/health/config/configuration';
import { MedicalEvent } from '@app/health/health/entities/medical-event.entity';

/**
 * Adapts communication with FHIR-compliant systems to retrieve medical records and history.
 * This adapter handles authentication, data transformation, and error handling specific to FHIR APIs,
 * providing a consistent interface for the Health Service.
 *
 * Addresses requirements:
 * - F-101: Integrates with external health record systems
 * - F-101-RQ-002: Retrieves chronological medical events with contextual information
 */
@Injectable()
export class FHIRAdapter {
    private fhirClient: FhirClient;
    private config: Record<string, any>;

    /**
     * Initializes the FHIRAdapter.
     *
     * @param logger - Logger service for consistent logging
     * @param tracingService - Tracing service for distributed tracing
     */
    constructor(
        private readonly logger: LoggerService,
        private readonly tracingService: TracingService
    ) {
        this.initialize();
    }

    /**
     * Initializes the adapter with configuration and FHIR client setup
     */
    private initialize(): void {
        try {
            // Load configuration
            this.config = health();

            // Check if FHIR API is enabled
            if (!this.config.fhirApiEnabled) {
                this.logger.warn('FHIR API is disabled in configuration', 'FHIRAdapter');
                return;
            }

            // Initialize FHIR client
            this.fhirClient = new FhirClient({
                baseUrl: this.config.fhirApiUrl,
                customHeaders: this.getAuthHeaders(),
            });

            this.logger.log('FHIR adapter initialized successfully', 'FHIRAdapter');
        } catch (error) {
            this.logger.error('Failed to initialize FHIR adapter', (error as any).stack, 'FHIRAdapter');
            throw new AppException(
                'Failed to initialize FHIR adapter',
                ErrorType.TECHNICAL,
                'HEALTH_002',
                { detail: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Creates authorization headers based on configured authentication type
     *
     * @returns Authentication headers for FHIR API
     */
    private getAuthHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/fhir+json',
        };

        if (!this.config.fhirApiEnabled) {
            return headers;
        }

        switch (this.config.fhirApiAuthType) {
            case 'oauth2':
                // In a real implementation, this would fetch and manage OAuth tokens
                // For now, we'll assume the token is pre-configured or obtained elsewhere
                headers['Authorization'] = `Bearer ${this.config.fhirApiAccessToken}`;
                break;
            case 'basic':
                const credentials = Buffer.from(
                    `${this.config.fhirApiUsername}:${this.config.fhirApiPassword}`
                ).toString('base64');
                headers['Authorization'] = `Basic ${credentials}`;
                break;
            case 'none':
            default:
                // No authentication
                break;
        }

        return headers;
    }

    /**
     * Determines if an error is retryable based on HTTP status code
     *
     * @param error - The error to check
     * @returns True if the error is retryable, false otherwise
     */
    private isRetryable(error: any): boolean {
        // Consider server errors (5xx) and rate limiting (429) as retryable
        const status = error.response?.status;
        return status >= 500 || status === 429;
    }

    /**
     * Implements retry logic with exponential backoff for transient errors
     *
     * @param fn - The function to retry
     * @param retries - Number of retries left
     * @returns The result of the function call
     */
    private async retryWithBackoff<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retries <= 0 || !this.isRetryable(error)) {
                throw error as any;
            }

            const delay = Math.pow(2, 4 - retries) * 1000; // Exponential backoff: 1s, 2s, 4s
            this.logger.warn(`Retrying FHIR API call after ${delay}ms, ${retries} retries left`, 'FHIRAdapter');

            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.retryWithBackoff(fn, retries - 1);
        }
    }

    /**
     * Retrieves a patient record from a FHIR-compliant system.
     *
     * @param patientId - The unique identifier of the patient
     * @returns A promise that resolves to the patient record
     */
    public async getPatientRecord(patientId: string): Promise<any> {
        try {
            // Check if FHIR API is enabled
            if (!this.config.fhirApiEnabled) {
                throw new AppException('FHIR API is disabled', ErrorType.BUSINESS, 'HEALTH_001', { patientId });
            }

            // Use the tracing service to create a span for this operation
            return await this.tracingService.createSpan('fhir.getPatientRecord', async () => {
                this.logger.log(`Fetching patient record for patient ID: ${patientId}`, 'FHIRAdapter');

                try {
                    // Use the FHIR client to fetch the patient record
                    const response = await this.retryWithBackoff(() =>
                        this.fhirClient.read({
                            resourceType: 'Patient',
                            id: patientId,
                        })
                    );

                    // Transform FHIR patient to our internal format
                    const patientRecord = this.mapToPatientRecord(response);

                    this.logger.log(`Successfully fetched patient record for patient ID: ${patientId}`, 'FHIRAdapter');
                    return patientRecord;
                } catch (error) {
                    this.logger.error(
                        `Failed to fetch patient record for patient ID: ${patientId}`,
                        (error as any).stack,
                        'FHIRAdapter'
                    );

                    throw new AppException(
                        'Failed to fetch patient record',
                        ErrorType.EXTERNAL,
                        'HEALTH_004',
                        { patientId, error: (error as Error).message },
                        HttpStatus.BAD_GATEWAY
                    );
                }
            });
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            throw new AppException(
                'Error in patient record retrieval',
                ErrorType.TECHNICAL,
                'HEALTH_004',
                { patientId, error: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Retrieves a patient's medical history from a FHIR-compliant system.
     *
     * @param patientId - The unique identifier of the patient
     * @returns A promise that resolves to an array of medical events
     */
    public async getMedicalHistory(patientId: string): Promise<MedicalEvent[]> {
        try {
            // Check if FHIR API is enabled
            if (!this.config.fhirApiEnabled) {
                throw new AppException('FHIR API is disabled', ErrorType.BUSINESS, 'HEALTH_001', { patientId });
            }

            // Use the tracing service to create a span for this operation
            return await this.tracingService.createSpan('fhir.getMedicalHistory', async () => {
                this.logger.log(`Fetching medical history for patient ID: ${patientId}`, 'FHIRAdapter');

                try {
                    // Use the FHIR client to search for conditions related to the patient
                    const response = await this.retryWithBackoff(() =>
                        this.fhirClient.search({
                            resourceType: 'Condition',
                            searchParams: {
                                patient: patientId,
                                _sort: '-date', // Sort by date in descending order
                                _count: this.config.medicalHistoryMaxEvents || 1000, // Limit the number of records
                            },
                        })
                    );

                    // Transform FHIR conditions to our internal format
                    const medicalEvents = this.mapToMedicalEvents(response);

                    this.logger.log(
                        `Successfully fetched ${medicalEvents.length} medical events for patient ID: ${patientId}`,
                        'FHIRAdapter'
                    );
                    return medicalEvents;
                } catch (error) {
                    this.logger.error(
                        `Failed to fetch medical history for patient ID: ${patientId}`,
                        (error as any).stack,
                        'FHIRAdapter'
                    );

                    throw new AppException(
                        'Failed to fetch medical history',
                        ErrorType.EXTERNAL,
                        'HEALTH_005',
                        { patientId, error: (error as Error).message },
                        HttpStatus.BAD_GATEWAY
                    );
                }
            });
        } catch (error) {
            if (error instanceof AppException) {
                throw error as any;
            }

            throw new AppException(
                'Error in medical history retrieval',
                ErrorType.TECHNICAL,
                'HEALTH_005',
                { patientId, error: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Maps a FHIR Patient resource to our internal patient record format
     *
     * @param fhirPatient - The FHIR Patient resource
     * @returns Standardized patient record
     */
    private mapToPatientRecord(fhirPatient: any): any {
        try {
            // Validate FHIR patient resource
            if (!fhirPatient || !fhirPatient.resourceType || fhirPatient.resourceType !== 'Patient') {
                throw new Error('Invalid FHIR Patient resource');
            }

            // Extract name information
            const name = fhirPatient.name && fhirPatient.name.length > 0 ? fhirPatient.name[0] : null;
            const firstName = name && name.given && name.given.length > 0 ? name.given[0] : '';
            const lastName = name && name.family ? name.family : '';

            // Extract contact information
            const telecom = fhirPatient.telecom || [];
            const phone = telecom.find((t) => t.system === 'phone')?.value || '';
            const email = telecom.find((t) => t.system === 'email')?.value || '';

            // Extract address information
            const address = fhirPatient.address && fhirPatient.address.length > 0 ? fhirPatient.address[0] : null;
            const addressLine = address && address.line ? address.line.join(', ') : '';
            const city = address ? address.city || '' : '';
            const state = address ? address.state || '' : '';
            const postalCode = address ? address.postalCode || '' : '';

            // Extract identifiers (like CPF in Brazil)
            const identifiers =
                fhirPatient.identifier?.map((id) => ({
                    system: id.system,
                    value: id.value,
                })) || [];

            // Map to our internal patient record format
            return {
                id: fhirPatient.id,
                resourceType: 'PatientRecord',
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`.trim(),
                gender: fhirPatient.gender || '',
                birthDate: fhirPatient.birthDate || null,
                contact: {
                    phone,
                    email,
                },
                address: {
                    line: addressLine,
                    city,
                    state,
                    postalCode,
                },
                maritalStatus: fhirPatient.maritalStatus?.text || '',
                identifiers,
                communication:
                    fhirPatient.communication?.map((comm) => ({
                        language: comm.language?.text || '',
                    })) || [],
                source: 'FHIR',
                meta: {
                    version: fhirPatient.meta?.versionId || '1',
                    lastUpdated: fhirPatient.meta?.lastUpdated || new Date().toISOString(),
                },
            };
        } catch (error) {
            this.logger.error('Failed to map FHIR patient to internal format', (error as any).stack, 'FHIRAdapter');
            throw new AppException(
                'Failed to process patient data',
                ErrorType.TECHNICAL,
                'HEALTH_006',
                { detail: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Maps FHIR Condition resources to our internal MedicalEvent entities
     *
     * @param fhirResponse - The FHIR response containing Condition resources
     * @returns Array of MedicalEvent entities
     */
    private mapToMedicalEvents(fhirResponse: any): MedicalEvent[] {
        try {
            // Validate FHIR response
            if (!fhirResponse || !fhirResponse.entry || !Array.isArray(fhirResponse.entry)) {
                return [];
            }

            // Map each condition to a medical event
            return fhirResponse.entry
                .filter((entry) => entry.resource && entry.resource.resourceType === 'Condition')
                .map((entry) => {
                    const condition = entry.resource;

                    // Extract clinical status (reserved for future use)
                    const _clinicalStatus =
                        condition.clinicalStatus?.coding?.[0]?.display ||
                        condition.clinicalStatus?.coding?.[0]?.code ||
                        '';

                    // Extract condition code and description
                    const code = condition.code?.coding?.[0]?.display || condition.code?.coding?.[0]?.code || '';
                    const description = condition.code?.text || code || 'Unknown condition';

                    // Extract recorded date
                    let recordedDate = null;
                    if (condition.recordedDate) {
                        recordedDate = new Date(condition.recordedDate);
                    } else if (condition.onsetDateTime) {
                        recordedDate = new Date(condition.onsetDateTime);
                    } else {
                        recordedDate = new Date(); // Fallback to current date
                    }

                    // Extract provider information
                    const provider = condition.asserter?.display || '';

                    // Extract notes (reserved for future use)
                    const _notes = condition.note?.map((n) => n.text).join('\n') || '';

                    // Create a new MedicalEvent entity
                    const medicalEvent = new MedicalEvent();
                    medicalEvent.id = condition.id;
                    medicalEvent.type = 'condition';
                    medicalEvent.description = truncate(description, 255);
                    medicalEvent.date = recordedDate;
                    medicalEvent.provider = truncate(provider, 255);
                    medicalEvent.documents = condition.supportingInfo?.map((info) => info.reference) || [];
                    medicalEvent.createdAt = new Date();
                    medicalEvent.updatedAt = new Date();

                    return medicalEvent;
                });
        } catch (error) {
            this.logger.error('Failed to map FHIR conditions to medical events', (error as any).stack, 'FHIRAdapter');
            throw new AppException(
                'Failed to process medical history data',
                ErrorType.TECHNICAL,
                'HEALTH_007',
                { detail: (error as Error).message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
