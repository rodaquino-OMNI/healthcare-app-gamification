/**
 * SSL/TLS Certificate Pinning Configuration
 *
 * Pins are SHA-256 hashes of the Subject Public Key Info (SPKI).
 * Two pins are configured per domain: primary (current cert) and backup (next rotation).
 *
 * HUMAN-ACTION(AUSTA-NNN): Replace placeholder pins with real certificate SPKI hashes before production.
 * Generate with:
 *   openssl s_client -connect api.austa.com.br:443 |
 *   openssl x509 -pubkey -noout | openssl pkey -pubin -outform der |
 *   openssl dgst -sha256 -binary | openssl enc -base64
 *
 * ## EAS Secret Setup (Production)
 * Run the following for each domain before building:
 *   eas secret:create --scope project --name SSL_PIN_API_PRIMARY --value "sha256/YOUR_HASH"
 *   eas secret:create --scope project --name SSL_PIN_API_BACKUP --value "sha256/YOUR_BACKUP_HASH"
 *   eas secret:create --scope project --name SSL_PIN_AUTH_PRIMARY --value "sha256/YOUR_HASH"
 *   eas secret:create --scope project --name SSL_PIN_AUTH_BACKUP --value "sha256/YOUR_BACKUP_HASH"
 *   eas secret:create --scope project --name SSL_PIN_CDN_PRIMARY --value "sha256/YOUR_HASH"
 *   eas secret:create --scope project --name SSL_PIN_CDN_BACKUP --value "sha256/YOUR_BACKUP_HASH"
 */

export interface PinConfig {
    includeSubdomains: boolean;
    pins: [string, string]; // [primary, backup]
    enforceInDev: boolean;
}

// eslint-disable-next-line import/no-unresolved
import Constants from 'expo-constants';

/**
 * SSL pins injected by app.config.js from EAS secrets at build time.
 * At runtime these are available via Constants.expoConfig.extra.sslPins.
 *
 * NOTE: Raw process.env.SSL_PIN_* does NOT work in Expo managed workflow
 * because Metro only inlines EXPO_PUBLIC_* prefixed vars. The pins are
 * bridged through app.config.js → extra → Constants instead.
 */
const runtimePins = (Constants.expoConfig?.extra?.sslPins ?? {}) as Record<string, string>;

/**
 * Reads a pin from the runtime config (populated by app.config.js from
 * EAS secrets), otherwise returns the fallback placeholder.
 */
function getEnvPin(key: string, fallback: string): string {
    return runtimePins[key] || fallback;
}

export const SSL_PINS: Record<string, PinConfig> = {
    'api.austa.com.br': {
        includeSubdomains: true,
        pins: [
            getEnvPin('SSL_PIN_API_PRIMARY', 'sha256/PLACEHOLDER_REPLACE_IN_PRODUCTION'),
            getEnvPin('SSL_PIN_API_BACKUP', 'sha256/PLACEHOLDER_REPLACE_IN_PRODUCTION'),
        ],
        enforceInDev: false,
    },
    'auth.austa.com.br': {
        includeSubdomains: false,
        pins: [
            getEnvPin('SSL_PIN_AUTH_PRIMARY', 'sha256/PLACEHOLDER_REPLACE_IN_PRODUCTION'),
            getEnvPin('SSL_PIN_AUTH_BACKUP', 'sha256/PLACEHOLDER_REPLACE_IN_PRODUCTION'),
        ],
        enforceInDev: false,
    },
    'cdn.austa.com.br': {
        includeSubdomains: true,
        pins: [
            getEnvPin('SSL_PIN_CDN_PRIMARY', 'sha256/PLACEHOLDER_REPLACE_IN_PRODUCTION'),
            getEnvPin('SSL_PIN_CDN_BACKUP', 'sha256/PLACEHOLDER_REPLACE_IN_PRODUCTION'),
        ],
        enforceInDev: false,
    },
};

/**
 * Validates that a hostname has pinning configured.
 * In development mode, always returns true unless enforceInDev is set.
 */
export function isPinConfigured(hostname: string): boolean {
    return hostname in SSL_PINS;
}

/**
 * Returns the pin configuration for a given hostname, checking subdomains.
 */
export function getPinConfig(hostname: string): PinConfig | undefined {
    // Direct match
    if (SSL_PINS[hostname]) {
        return SSL_PINS[hostname];
    }

    // Subdomain match
    for (const [domain, config] of Object.entries(SSL_PINS)) {
        if (config.includeSubdomains && hostname.endsWith(`.${domain}`)) {
            return config;
        }
    }

    return undefined;
}

/**
 * Validates that a pin string has the correct format: 'sha256/' followed by
 * a non-empty base64 payload.
 */
export function validatePinFormat(pin: string): boolean {
    if (!pin.startsWith('sha256/')) {
        return false;
    }
    const payload = pin.slice(7);
    if (payload.length === 0) {
        return false;
    }
    return /^[A-Za-z0-9+/]+=*$/.test(payload);
}

/**
 * Returns true when every configured pin has been replaced with a real
 * certificate hash (i.e. no pin contains 'PLACEHOLDER').
 */
export function isProductionPinned(): boolean {
    return Object.values(SSL_PINS).every((config) => config.pins.every((pin) => !pin.includes('PLACEHOLDER')));
}

/**
 * Logs a critical warning if the app is running in production with placeholder
 * SSL pins. Call this at app startup to surface misconfigurations via
 * Sentry/Crashlytics log capture.
 */
export function warnIfPlaceholderInProduction(): void {
    // eslint-disable-next-line no-underscore-dangle
    const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
    if (!isDev && !isProductionPinned()) {
        // eslint-disable-next-line no-console
        console.error(
            '[SSL-PINNING] CRITICAL: Production build detected with placeholder SSL pins. Configure EAS secrets before release.'
        );
    }
}
