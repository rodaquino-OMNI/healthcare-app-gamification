/**
 * Middleware for security hardening:
 *
 * 1. Protects against the Authorization Bypass vulnerability (CVE-2024-36289)
 *    by rejecting requests containing the x-middleware-subrequest header.
 *
 * 2. Generates a per-request CSP nonce and sets a nonce-based
 *    Content-Security-Policy header, replacing the static unsafe-inline
 *    directive for script-src.
 *
 * The nonce is forwarded to the page via the x-nonce request header so that
 * _document.tsx can pass it to <NextScript nonce={nonce}>.
 */
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate a cryptographically random nonce as a hex string.
 * crypto.getRandomValues is available in the Next.js Edge Runtime.
 */
function generateNonce(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Build the Content-Security-Policy header value for a given nonce.
 * style-src keeps 'unsafe-inline' because styled-components injects styles
 * at runtime and nonce-based style CSP would require additional SSR changes.
 */
function buildCsp(nonce: string): string {
    const isDev = process.env.NODE_ENV === 'development';
    const connectExtra = isDev ? ' http://localhost:* ws://localhost:*' : '';

    return [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}'`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' blob: data: https://storage.googleapis.com https://cdn.austa.com.br",
        "font-src 'self' https://fonts.gstatic.com",
        `connect-src 'self' https://*.austa.com.br https://*.sentry.io${connectExtra}`,
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join('; ');
}

export function middleware(request: NextRequest): NextResponse {
    // --- CVE-2024-36289: reject middleware subrequest bypass attempts ---
    if (request.headers.get('x-middleware-subrequest')) {
        // Log only the URL — never dump full headers (avoids leaking Authorization/cookies)
        console.warn('Potential authorization bypass attempt detected!', {
            url: request.url,
        });

        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // --- Nonce-based CSP ---
    const nonce = generateNonce();

    // Forward the nonce to the page so _document.tsx can read it from ctx.req.headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    // Override the static CSP set by next.config.js with the nonce-bearing one
    response.headers.set('Content-Security-Policy', buildCsp(nonce));
    response.headers.set('X-Middleware-Protected', '1');

    return response;
}

export const config = {
    matcher: [
        // Skip static assets — they do not need a per-request CSP nonce
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
