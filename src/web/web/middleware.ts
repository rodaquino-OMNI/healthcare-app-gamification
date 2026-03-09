/**
 * Middleware to protect against the Authorization Bypass vulnerability (CVE-2024-36289)
 *
 * Rejects requests containing the x-middleware-subrequest header, which could
 * be used in an authorization bypass attack.
 *
 * @note This file must be directly in web/ folder, not web/web/
 */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
    if (request.headers.get('x-middleware-subrequest')) {
        // Log only the URL — never dump full headers (avoids leaking Authorization/cookies)
        console.warn('Potential authorization bypass attempt detected!', {
            url: request.url,
        });

        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const response = NextResponse.next();
    response.headers.set('X-Middleware-Protected', '1');

    return response;
}

export const config = {
    matcher: [
        // Skip public files and API routes
        '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
    ],
};
