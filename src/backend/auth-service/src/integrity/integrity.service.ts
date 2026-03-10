import { LoggerService } from '@app/shared/logging/logger.service';
import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/** Integrity verification verdict returned by platform APIs. */
export interface IntegrityVerdict {
    /** Whether the attestation token passed verification. */
    verified: boolean;
    /** Human-readable verdict label from the platform API. */
    verdict: string;
}

/**
 * Service for verifying mobile app integrity attestation tokens.
 *
 * Android: Validates tokens against Google Play Integrity API.
 * iOS: Validates tokens against Apple App Attest / DeviceCheck API.
 *
 * MASVS-RESILIENCE-2: Server-side attestation verification ensures
 * the mobile client has not been repackaged or tampered with.
 */
@Injectable()
export class IntegrityService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly logger: LoggerService
    ) {}

    /**
     * Route verification to the correct platform handler.
     * @param token Attestation token from the mobile client
     * @param platform 'android' or 'ios'
     */
    async verify(token: string, platform: string): Promise<IntegrityVerdict> {
        this.logger.log(`Verifying integrity for platform: ${platform}`, 'IntegrityService');

        if (platform === 'android') {
            return this.verifyAndroidIntegrity(token);
        }

        if (platform === 'ios') {
            return this.verifyIosIntegrity(token);
        }

        this.logger.warn(`Unsupported platform for integrity check: ${platform}`, 'IntegrityService');
        return { verified: false, verdict: 'UNSUPPORTED_PLATFORM' };
    }

    /**
     * Verify an Android Play Integrity API token.
     *
     * Calls the Google Play Integrity API to decode the integrity token
     * and checks the device/app recognition verdicts.
     *
     * @see https://developer.android.com/google/play/integrity/verdict
     *
     * TODO: Configure GOOGLE_PLAY_INTEGRITY_API_KEY in environment variables
     * TODO: Set GOOGLE_CLOUD_PROJECT_NUMBER in environment variables
     */
    async verifyAndroidIntegrity(token: string): Promise<IntegrityVerdict> {
        // TODO: Replace with actual Google Play Integrity API key from env
        const apiKey = this.configService.get<string>('GOOGLE_PLAY_INTEGRITY_API_KEY', '');

        if (!apiKey) {
            this.logger.warn(
                'GOOGLE_PLAY_INTEGRITY_API_KEY not configured — skipping verification',
                'IntegrityService'
            );
            return { verified: false, verdict: 'API_KEY_NOT_CONFIGURED' };
        }

        try {
            // Google Play Integrity API v1 endpoint
            const url = `https://playintegrity.googleapis.com/v1/${token}:decodeIntegrityToken`;

            const response = await firstValueFrom(
                this.httpService.post(
                    url,
                    { integrity_token: token },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${apiKey}`,
                        },
                        timeout: 5000,
                    }
                )
            );

            const payload = response.data?.tokenPayloadExternal;
            if (!payload) {
                return { verified: false, verdict: 'INVALID_PAYLOAD' };
            }

            // Check device integrity verdicts
            const deviceLabels: string[] = payload.deviceIntegrity?.deviceRecognitionVerdict ?? [];

            // MEETS_DEVICE_INTEGRITY = genuine device, not rooted
            // MEETS_BASIC_INTEGRITY = device may be rooted but passes basic checks
            // MEETS_STRONG_INTEGRITY = recent device with hardware-backed keystore
            const meetsBasic = deviceLabels.includes('MEETS_BASIC_INTEGRITY');
            const meetsDevice = deviceLabels.includes('MEETS_DEVICE_INTEGRITY');
            const meetsStrong = deviceLabels.includes('MEETS_STRONG_INTEGRITY');

            const verdict = meetsStrong
                ? 'MEETS_STRONG_INTEGRITY'
                : meetsDevice
                  ? 'MEETS_DEVICE_INTEGRITY'
                  : meetsBasic
                    ? 'MEETS_BASIC_INTEGRITY'
                    : 'DOES_NOT_MEET_INTEGRITY';

            this.logger.log(
                `Android integrity verdict: ${verdict} (labels: ${deviceLabels.join(', ')})`,
                'IntegrityService'
            );

            return { verified: meetsBasic || meetsDevice || meetsStrong, verdict };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMsg = error.message || 'Unknown error';
            this.logger.error(
                `Android integrity verification failed: ${errorMsg}`,
                error.stack || '',
                'IntegrityService'
            );
            return { verified: false, verdict: 'VERIFICATION_ERROR' };
        }
    }

    /**
     * Verify an iOS App Attest token.
     *
     * Validates the attestation object against Apple's servers to confirm
     * the app is a legitimate, unmodified build running on genuine hardware.
     *
     * @see https://developer.apple.com/documentation/devicecheck/validating_apps_that_connect_to_your_server
     *
     * TODO: Configure APPLE_APP_ATTEST_KEY_ID in environment variables
     * TODO: Configure APPLE_TEAM_ID in environment variables
     */
    async verifyIosIntegrity(token: string): Promise<IntegrityVerdict> {
        // TODO: Replace with actual Apple App Attest configuration from env
        const teamId = this.configService.get<string>('APPLE_TEAM_ID', '');
        const keyId = this.configService.get<string>('APPLE_APP_ATTEST_KEY_ID', '');

        if (!teamId || !keyId) {
            this.logger.warn('Apple App Attest credentials not configured — skipping verification', 'IntegrityService');
            return { verified: false, verdict: 'CREDENTIALS_NOT_CONFIGURED' };
        }

        try {
            // Apple App Attest verification endpoint
            const environment =
                this.configService.get<string>('NODE_ENV') === 'production' ? 'production' : 'development';

            const baseUrl =
                environment === 'production'
                    ? 'https://data.appattest.apple.com'
                    : 'https://data-development.appattest.apple.com';

            const response = await firstValueFrom(
                this.httpService.post(
                    `${baseUrl}/v1/attestation/verify`,
                    {
                        attestation_object: token,
                        key_id: keyId,
                        team_id: teamId,
                    },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 5000,
                    }
                )
            );

            const verified = response.status === 200;
            const verdict = verified ? 'ATTESTATION_VALID' : 'ATTESTATION_INVALID';

            this.logger.log(`iOS integrity verdict: ${verdict}`, 'IntegrityService');

            return { verified, verdict };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMsg = error.message || 'Unknown error';
            this.logger.error(`iOS integrity verification failed: ${errorMsg}`, error.stack || '', 'IntegrityService');
            return { verified: false, verdict: 'VERIFICATION_ERROR' };
        }
    }
}
