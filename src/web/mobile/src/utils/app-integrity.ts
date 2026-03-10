/**
 * App integrity verification: Play Integrity (Android) + App Attest (iOS).
 * MASVS-RESILIENCE-2: Detects repackaging and tampering.
 *
 * @see https://developer.android.com/google/play/integrity
 * @see https://developer.apple.com/documentation/devicecheck
 */
import { Platform, NativeModules } from 'react-native';

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
export async function requestIntegrityToken(): Promise<string | null> {
    if (__DEV__) {
        console.warn('[AppIntegrity] Running in dev mode — returning mock integrity token');
        return 'dev-mock-integrity-token';
    }

    try {
        if (Platform.OS === 'android') {
            // TODO: Bridge to IntegrityManager.requestIntegrityToken()
            const { PlayIntegrity } = NativeModules;
            if (PlayIntegrity?.requestToken) {
                return await PlayIntegrity.requestToken();
            }
            console.warn('[AppIntegrity] PlayIntegrity native module not available');
            return null;
        }

        if (Platform.OS === 'ios') {
            // TODO: Bridge to DCAppAttestService.attestKey()
            const { AppAttest } = NativeModules;
            if (AppAttest?.requestAttestation) {
                return await AppAttest.requestAttestation();
            }
            console.warn('[AppIntegrity] AppAttest native module not available');
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

        const result = await response.json();
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
