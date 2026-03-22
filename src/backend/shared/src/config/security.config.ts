import type { HelmetOptions } from 'helmet';

/**
 * Default Content-Security-Policy directives for all AUSTA services.
 * Healthcare apps require strict CSP to prevent PHI exfiltration via XSS.
 */
const AUSTA_CSP_DIRECTIVES = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    frameSrc: ["'self'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
};

/**
 * Returns helmet options with CSP enabled.
 * Override directives per-service if needed.
 */
export function getHelmetOptions(overrides?: Partial<typeof AUSTA_CSP_DIRECTIVES>): HelmetOptions {
    return {
        contentSecurityPolicy: {
            directives: {
                ...AUSTA_CSP_DIRECTIVES,
                ...overrides,
            },
        },
    };
}

/**
 * Default CORS origins for all AUSTA services.
 * Used as fallback when CORS_ORIGINS env var is not set.
 */
export const AUSTA_DEFAULT_CORS_ORIGINS: (string | RegExp)[] = [
    'https://app.austa.com.br',
    /\.austa\.com\.br$/,
];

/**
 * Parse CORS origins from env var or return production defaults.
 */
export function parseCorsOrigins(envValue?: string): (string | RegExp)[] {
    if (!envValue) {
        return AUSTA_DEFAULT_CORS_ORIGINS;
    }
    const origins = envValue
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    return origins.length > 0 ? origins : AUSTA_DEFAULT_CORS_ORIGINS;
}
