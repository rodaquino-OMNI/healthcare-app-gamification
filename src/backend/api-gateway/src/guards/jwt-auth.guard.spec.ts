/**
 * Unit tests for JwtAuthGuard.
 *
 * JwtAuthGuard extends AuthGuard('jwt') and overrides getRequest() so that
 * NestJS reads the incoming request from the GraphQL execution context rather
 * than from the HTTP execution context.  These tests verify that:
 *
 *   1. The guard can be instantiated.
 *   2. getRequest() delegates to GqlExecutionContext and returns the correct
 *      request object.
 *   3. The guard extends AuthGuard('jwt').
 */

// ---------------------------------------------------------------------------
// Mock @nestjs/graphql before importing anything that depends on it.
// GqlExecutionContext.create is the only API exercised by the guard.
// ---------------------------------------------------------------------------
const mockGetContext = jest.fn();
const mockGqlCtx = { getContext: mockGetContext };

jest.mock('@nestjs/graphql', () => ({
  GqlExecutionContext: {
    create: jest.fn().mockReturnValue(mockGqlCtx),
  },
}));

// ---------------------------------------------------------------------------
// Mock @nestjs/passport so that AuthGuard('jwt') does not attempt to load the
// Passport strategy at import time (which would require a full NestJS module).
// ---------------------------------------------------------------------------
jest.mock('@nestjs/passport', () => {
  // Singleton base class so that every call to AuthGuard() returns the same
  // constructor.  This is required for `instanceof` checks to work correctly
  // because JwtAuthGuard extends the result of AuthGuard('jwt') at class
  // definition time, and the test resolves the same value via jest.requireMock.
  class MockAuthGuard {
    canActivate() {
      return true;
    }
  }
  const AuthGuard = (_strategy: string) => MockAuthGuard;
  return { AuthGuard };
});

import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    // Reset call history between tests but keep the mock implementation.
    (GqlExecutionContext.create as jest.Mock).mockClear();
    mockGetContext.mockClear();
  });

  // -------------------------------------------------------------------------
  // Test 1 – guard is defined
  // -------------------------------------------------------------------------

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // Test 2 – extends AuthGuard('jwt')
  // -------------------------------------------------------------------------

  it('should extend AuthGuard (jwt)', () => {
    // Because @nestjs/passport is mocked above, AuthGuard('jwt') returns
    // MockAuthGuard. JwtAuthGuard extends it, so instanceof still works.
    const { AuthGuard } = jest.requireMock('@nestjs/passport');
    const Base = AuthGuard('jwt');
    expect(guard).toBeInstanceOf(Base);
  });

  // -------------------------------------------------------------------------
  // Test 3 – getRequest() extracts request from GraphQL execution context
  // -------------------------------------------------------------------------

  it('getRequest() delegates to GqlExecutionContext.create and returns ctx.getContext().req', () => {
    const mockRequest = { headers: { authorization: 'Bearer token' }, user: undefined };

    // Wire up the mock chain: getContext() → { req: mockRequest }
    mockGetContext.mockReturnValue({ req: mockRequest });

    // Build a minimal ExecutionContext stub
    const mockExecutionContext = {} as ExecutionContext;

    const result = guard.getRequest(mockExecutionContext);

    // GqlExecutionContext.create must be called with the execution context
    expect(GqlExecutionContext.create).toHaveBeenCalledTimes(1);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockExecutionContext);

    // getContext() must be called on the returned GQL context object
    expect(mockGetContext).toHaveBeenCalledTimes(1);

    // The returned value must be the req object from the GraphQL context
    expect(result).toBe(mockRequest);
  });

  it('getRequest() returns undefined when ctx.getContext() has no req property', () => {
    mockGetContext.mockReturnValue({}); // no req key

    const mockExecutionContext = {} as ExecutionContext;
    const result = guard.getRequest(mockExecutionContext);

    expect(result).toBeUndefined();
  });

  it('creates a new GqlExecutionContext on every call', () => {
    const mockRequest1 = { id: 'req-1' };
    const mockRequest2 = { id: 'req-2' };

    mockGetContext
      .mockReturnValueOnce({ req: mockRequest1 })
      .mockReturnValueOnce({ req: mockRequest2 });

    const ctx = {} as ExecutionContext;

    expect(guard.getRequest(ctx)).toBe(mockRequest1);
    expect(guard.getRequest(ctx)).toBe(mockRequest2);
    expect(GqlExecutionContext.create).toHaveBeenCalledTimes(2);
  });
});
