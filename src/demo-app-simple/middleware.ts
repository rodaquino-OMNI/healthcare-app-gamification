import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security middleware for demo app
 * Protects against the Next.js Authorization Bypass vulnerability (CVE-2024-36289)
 */
export function middleware(request: NextRequest) {
  // Block any requests with the x-middleware-subrequest header
  if (request.headers.get('x-middleware-subrequest')) {
    console.warn('Security alert: Potential middleware bypass attempt detected');
    return new NextResponse('Forbidden', { status: 403 });
  }

  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Middleware-Protected', 'true');
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};