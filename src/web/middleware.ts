import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect against the Authorization Bypass vulnerability (CVE-2024-36289)
 * 
 * This middleware provides additional protection beyond the patched version (14.2.25)
 * by explicitly checking for and rejecting any requests containing the x-middleware-subrequest
 * header, which could be used in an authorization bypass attack.
 */
export function middleware(request: NextRequest) {
  // Check for the x-middleware-subrequest header which could be used in the attack
  if (request.headers.get('x-middleware-subrequest')) {
    // Log potential attack attempt
    console.warn('Potential authorization bypass attempt detected!', {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    });
    
    // Return 403 Forbidden for potential attack
    return new NextResponse('Forbidden', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
  // Add security headers to the response
  const response = NextResponse.next();
  response.headers.set('X-Middleware-Protected', '1');
  
  return response;
}

// Match only paths that could require authorization
export const config = {
  matcher: [
    // Skip public files and API routes
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};