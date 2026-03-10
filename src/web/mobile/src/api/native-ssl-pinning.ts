/**
 * Native TLS Certificate Pinning via react-native-ssl-pinning
 *
 * Provides a fetch wrapper that enforces SPKI-based certificate pinning
 * at the TLS layer (not just headers). On Android, pinning is also handled
 * by network_security_config.xml for all HTTP clients including OkHttp/Apollo.
 *
 * TODO(ops): Replace placeholder SPKI hashes in ssl-pinning.ts with real
 * certificate hashes before production deployment.
 */

// eslint-disable-next-line import/no-unresolved
import { fetch as sslFetch } from 'react-native-ssl-pinning';

import { SSL_PINS, getPinConfig, isProductionPinned } from './ssl-pinning';

// React Native global __DEV__ flag
declare const __DEV__: boolean;

/**
 * Request options compatible with react-native-ssl-pinning's fetch API.
 */
export interface PinnedFetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
    headers?: Record<string, string>;
    body?: string;
    timeoutInterval?: number;
    /** Additional SSL pinning overrides (rarely needed) */
    sslPinning?: {
        certs?: string[];
    };
}

/**
 * Builds the SSL pinning configuration for react-native-ssl-pinning.
 *
 * - Android: Pinning is primarily handled by network_security_config.xml.
 *   We still pass pins here for defense-in-depth.
 * - iOS: Pins are passed directly to the native TLS implementation via
 *   the react-native-ssl-pinning bridge.
 */
function buildSslConfig(hostname: string): { sslPinning: { certs: string[] } } | Record<string, never> {
    const pinConfig = getPinConfig(hostname);

    if (!pinConfig) {
        return {};
    }

    // In dev mode, skip pinning unless explicitly enforced for this domain
    if (__DEV__ && !pinConfig.enforceInDev) {
        return {};
    }

    // Strip 'sha256/' prefix — react-native-ssl-pinning expects raw base64 hashes
    const rawPins = pinConfig.pins.map((pin) => pin.replace('sha256/', ''));

    return {
        sslPinning: {
            certs: rawPins,
        },
    };
}

/**
 * Extracts the hostname from a URL string.
 */
function extractHostname(url: string): string {
    try {
        return new URL(url).hostname;
    } catch {
        // If URL parsing fails, return empty string (pinning will be skipped)
        return '';
    }
}

/**
 * Fetch wrapper with native TLS certificate pinning.
 *
 * In development mode (__DEV__), pinning is bypassed unless the domain
 * has `enforceInDev: true` in its PinConfig. This allows local proxies
 * like Charles/Proxyman during development.
 *
 * @param url - The request URL
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns The fetch response
 * @throws Will throw if the server certificate does not match pinned hashes
 */
export async function pinnedFetch(url: string, options: PinnedFetchOptions = {}): Promise<Response> {
    const hostname = extractHostname(url);
    const sslConfig = buildSslConfig(hostname);

    // Log a warning in dev mode when placeholder pins are still in use
    if (__DEV__ && !isProductionPinned()) {
        console.warn(
            '[native-ssl-pinning] Placeholder SPKI hashes detected. ' +
                'Replace with real certificate pins before production deployment.'
        );
    }

    const fetchOptions = {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body,
        timeoutInterval: options.timeoutInterval || 30000,
        ...sslConfig,
        // Allow caller to override SSL config if needed (e.g., cert-based pinning)
        ...(options.sslPinning ? { sslPinning: options.sslPinning } : {}),
    };

    const response = await (sslFetch as (url: string, options: Record<string, unknown>) => Promise<Response>)(
        url,
        fetchOptions
    );
    return response;
}

/**
 * Returns all configured pin domains for diagnostic purposes.
 * Useful for health-check screens or debug menus.
 */
export function getPinnedDomains(): string[] {
    return Object.keys(SSL_PINS);
}
