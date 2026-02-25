/**
 * SSL/TLS Certificate Pinning Configuration
 *
 * Pins are SHA-256 hashes of the Subject Public Key Info (SPKI).
 * Two pins are configured per domain: primary (current cert) and backup (next rotation).
 *
 * TODO(ops): Replace placeholder pins with real certificate SPKI hashes before production.
 * Generate with: openssl s_client -connect api.austa.com.br:443 | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
 */

export interface PinConfig {
  includeSubdomains: boolean;
  pins: [string, string]; // [primary, backup]
  enforceInDev: boolean;
}

export const SSL_PINS: Record<string, PinConfig> = {
  'api.austa.com.br': {
    includeSubdomains: true,
    pins: [
      'sha256/PLACEHOLDER_PRIMARY_PIN_REPLACE_BEFORE_PRODUCTION',
      'sha256/PLACEHOLDER_BACKUP_PIN_REPLACE_BEFORE_PRODUCTION',
    ],
    enforceInDev: false,
  },
  'auth.austa.com.br': {
    includeSubdomains: false,
    pins: [
      'sha256/PLACEHOLDER_PRIMARY_PIN_REPLACE_BEFORE_PRODUCTION',
      'sha256/PLACEHOLDER_BACKUP_PIN_REPLACE_BEFORE_PRODUCTION',
    ],
    enforceInDev: false,
  },
  'cdn.austa.com.br': {
    includeSubdomains: true,
    pins: [
      'sha256/PLACEHOLDER_PRIMARY_PIN_REPLACE_BEFORE_PRODUCTION',
      'sha256/PLACEHOLDER_BACKUP_PIN_REPLACE_BEFORE_PRODUCTION',
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
