/**
 * Middleware to protect against the Authorization Bypass vulnerability (CVE-2024-36289)
 * 
 * This middleware provides additional protection by explicitly checking for and 
 * rejecting any requests containing the x-middleware-subrequest header, which could
 * be used in an authorization bypass attack.
 * 
 * @note This file must be directly in web/ folder, not web/web/
 */

// Type definitions for Next.js middleware
interface NextRequest {
  headers: {
    get(name: string): string | null;
    entries(): IterableIterator<[string, string]>;
  };
  url: string;
}

interface NextResponseInit {
  status?: number;
  headers?: Record<string, string>;
}

interface NextResponseClass {
  next(): { headers: Map<string, string> };
  json(body: any, options?: NextResponseInit): any;
}

// Using a conditional export approach to handle potential TypeScript issues
let NextResponse: NextResponseClass;

try {
  // Using dynamic import to avoid TypeScript errors
  const server = Function('return require("next/server")')();
  NextResponse = server.NextResponse;
} catch (error) {
  // Fallback implementation if next/server can't be imported
  NextResponse = {
    next() {
      return { headers: new Map() };
    },
    json(body: any, options?: NextResponseInit) { 
      return { body, ...options };
    }
  } as NextResponseClass;

  console.warn('Warning: next/server module not found. Using fallback implementation.');
}

/**
 * Middleware function to protect against authorization bypass attempts
 */
export function middleware(request: NextRequest): any {
  // Check for the x-middleware-subrequest header which could be used in the attack
  if (request.headers.get('x-middleware-subrequest')) {
    // Log potential attack attempt
    console.warn('Potential authorization bypass attempt detected!', {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    });
    
    // Return 403 Forbidden for potential attack
    return {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Forbidden'
    };
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