/**
 * SSL/TLS Certificate Pinning Configuration
 *
 * Pins are SHA-256 hashes of the Subject Public Key Info (SPKI).
 * Two pins are configured per domain: primary (current cert) and backup (next rotation).
 *
 * TODO(ops): Replace placeholder pins with real certificate SPKI hashes before production.
 * Generate with:
 *   openssl s_client -connect api.austa.com.br:443 |
 *   openssl x509 -pubkey -noout | openssl pkey -pubin -outform der |
 *   openssl dgst -sha256 -binary | openssl enc -base64
 */

export interface PinConfig {
    includeSubdomains: boolean;
    pins: [string, string]; // [primary, backup]
    enforceInDev: boolean;
}

/**
 * Reads a pin from the environment if available, otherwise returns the fallback.
 */
function getEnvPin(key: string, fallback: string): string {
    if (typeof process !== 'undefined' && process.env?.[key]) {
        return process.env[key]!;
    }
    return fallback;
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
