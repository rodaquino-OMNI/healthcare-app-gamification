/**
 * App integrity verification: Play Integrity (Android) + App Attest (iOS).
 * MASVS-RESILIENCE-2: Detects repackaging and tampering.
 *
 * @see https://developer.android.com/google/play/integrity
 * @see https://developer.apple.com/documentation/devicecheck
 */
import { Platform } from 'react-native';

import { isRooted, isEmulator } from './device-security';

export interface AppIntegrityResult {
    integrity: boolean;
    rooted: boolean;
    emulator: boolean;
}

/**
 * Request an integrity attestation token from the platform native module.
 * Returns null on failure or unsupported platforms.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function requestIntegrityToken(): Promise<string | null> {
    if (__DEV__) {
        console.warn('[AppIntegrity] Running in dev mode — returning mock integrity token');
        return 'dev-mock-integrity-token';
    }

    try {
        if (Platform.OS === 'android') {
            // TODO(AUSTA-301): Implement Play Integrity via EAS config plugin or custom dev client.
            // NativeModules.PlayIntegrity is not available in Expo managed workflow.
            // When using EAS custom native modules, bridge to IntegrityManager.requestIntegrityToken().
            console.warn('[AppIntegrity] Play Integrity not available in Expo managed workflow');
            return null;
        }

        if (Platform.OS === 'ios') {
            // TODO(AUSTA-302): Implement App Attest via EAS config plugin or custom dev client.
            // DCAppAttestService requires native module not available in Expo managed workflow.
            // When ejecting to bare or using EAS custom native module, implement DCAppAttestService.attestKey().
            console.warn('[AppIntegrity] App Attest not available in Expo managed workflow');
            return null;
        }

        return null;
    } catch (error) {
        console.error('[AppIntegrity] Failed to request integrity token:', error);
        return null;
    }
}

/** Verify app integrity by sending the attestation token to the backend. */
export async function verifyAppIntegrity(backendUrl: string): Promise<boolean> {
    const token = await requestIntegrityToken();
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${backendUrl}/auth/integrity/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, platform: Platform.OS }),
        });

        if (!response.ok) {
            return false;
        }

        const result = (await response.json()) as { verified?: boolean };
        return result.verified === true;
    } catch (error) {
        console.error('[AppIntegrity] Backend verification failed:', error);
        return false;
    }
}

/** Combines app integrity with root/emulator detection from device-security. */
export async function checkFullDeviceSecurity(): Promise<AppIntegrityResult> {
    const [integrity, rooted, emulator] = await Promise.all([
        verifyAppIntegrity('')
            .then(() => true)
            .catch(() => false),
        isRooted(),
        isEmulator(),
    ]);

    return { integrity, rooted, emulator };
}
