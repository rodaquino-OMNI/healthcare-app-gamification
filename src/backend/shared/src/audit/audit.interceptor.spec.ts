import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { AuditInterceptor } from './audit.interceptor';
import { AuditService } from './audit.service';
import { AuditAction } from './dto/audit-log.dto';

/**
 * Helper that builds a minimal ExecutionContext mock from the supplied request
 * properties. The response always carries statusCode 200.
 */
function buildMockContext(
  request: {
    method?: string;
    url?: string;
    params?: Record<string, string>;
    user?: { id?: string; sub?: string } | null;
    headers?: Record<string, string>;
    ip?: string;
  },
  options: {
    controllerName?: string;
    handlerName?: string;
  } = {},
): ExecutionContext {
  const mockResponse = { statusCode: 200 };
  const httpAdapter = {
    getRequest: () => ({
      method: 'GET',
      url: '/test',
      params: {},
      user: { id: 'user-default' },
      headers: {},
      ip: '127.0.0.1',
      ...request,
    }),
    getResponse: () => mockResponse,
  };

  return {
    switchToHttp: () => httpAdapter,
    getClass: () => ({
      name: options.controllerName ?? 'TestController',
    }),
    getHandler: () => ({
      name: options.handlerName ?? 'testHandler',
    }),
  } as unknown as ExecutionContext;
}

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let auditService: jest.Mocked<AuditService>;

  const mockResponse = {};

  const mockCallHandler: CallHandler = {
    handle: jest.fn().mockReturnValue(of(mockResponse)),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    auditService = {
      log: jest.fn(),
      logPHIAccess: jest.fn(),
    } as unknown as jest.Mocked<AuditService>;

    interceptor = new AuditInterceptor(auditService);
  });

  // ------------------------------------------------------------------
  // 1. Basic existence
  // ------------------------------------------------------------------
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  // ------------------------------------------------------------------
  // 2. intercept() calls next.handle() and returns an observable
  // ------------------------------------------------------------------
  it('should call next.handle() and return an observable', (done) => {
    const context = buildMockContext({ method: 'GET', user: { id: 'user-1' } });

    const result = interceptor.intercept(context, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);

    result.subscribe({
      next: (value) => {
        expect(value).toBe(mockResponse);
      },
      complete: done,
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 3. GET request → AuditAction.READ logged after response
  // ------------------------------------------------------------------
  it('should log an audit entry after a successful response', (done) => {
    const context = buildMockContext(
      {
        method: 'GET',
        url: '/health/metrics',
        params: {},
        user: { id: 'user-get' },
        headers: { 'user-agent': 'TestAgent/1.0' },
        ip: '10.0.0.1',
      },
      { controllerName: 'HealthController', handlerName: 'getMetrics' },
    );

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledTimes(1);
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: 'user-get',
            action: AuditAction.READ,
            resourceType: 'Health',
            ipAddress: '10.0.0.1',
            userAgent: 'TestAgent/1.0',
            metadata: expect.objectContaining({
              handler: 'getMetrics',
              path: '/health/metrics',
              statusCode: 200,
            }),
          }),
        );
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 4. HTTP method → AuditAction mapping
  // ------------------------------------------------------------------
  it('should map GET method to AuditAction.READ', (done) => {
    const context = buildMockContext({
      method: 'GET',
      url: '/health/metrics',
      user: { id: 'user-get' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ action: AuditAction.READ }),
        );
        done();
      },
      error: done,
    });
  });

  it('should map POST method to AuditAction.WRITE', (done) => {
    const context = buildMockContext({
      method: 'POST',
      url: '/plans',
      user: { id: 'user-post' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ action: AuditAction.WRITE }),
        );
        done();
      },
      error: done,
    });
  });

  it('should map PUT method to AuditAction.WRITE', (done) => {
    const context = buildMockContext({
      method: 'PUT',
      url: '/plans/1',
      user: { id: 'user-put' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ action: AuditAction.WRITE }),
        );
        done();
      },
      error: done,
    });
  });

  it('should map PATCH method to AuditAction.WRITE', (done) => {
    const context = buildMockContext({
      method: 'PATCH',
      url: '/users/profile',
      user: { id: 'user-patch' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ action: AuditAction.WRITE }),
        );
        done();
      },
      error: done,
    });
  });

  it('should map DELETE method to AuditAction.DELETE', (done) => {
    const context = buildMockContext({
      method: 'DELETE',
      url: '/documents/doc-1',
      user: { id: 'user-delete' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ action: AuditAction.DELETE }),
        );
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 5. Skips logging when there is no userId on the request
  // ------------------------------------------------------------------
  it('should skip logging when no user is present on request', (done) => {
    const context = buildMockContext({
      method: 'GET',
      url: '/public/info',
      user: null,
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).not.toHaveBeenCalled();
        done();
      },
      error: done,
    });
  });

  it('should skip logging when user object exists but has no id or sub', (done) => {
    const context = buildMockContext({
      method: 'GET',
      url: '/public/status',
      user: {} as any,
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).not.toHaveBeenCalled();
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 6. Strips "Controller" suffix from controller name for resourceType
  // ------------------------------------------------------------------
  it('should strip "Controller" suffix from class name for resourceType', (done) => {
    const context = buildMockContext(
      { method: 'GET', user: { id: 'user-type' } },
      { controllerName: 'ClaimsController' },
    );

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ resourceType: 'Claims' }),
        );
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 7. Includes handler name, path, and statusCode in metadata
  // ------------------------------------------------------------------
  it('should include handler name, path, and statusCode in metadata', (done) => {
    const context = buildMockContext(
      {
        method: 'GET',
        url: '/health/metrics',
        user: { id: 'user-meta' },
      },
      { controllerName: 'HealthController', handlerName: 'findAll' },
    );

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: expect.objectContaining({
              handler: 'findAll',
              path: '/health/metrics',
              statusCode: 200,
            }),
          }),
        );
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 8. Extracts resourceId from request.params.id
  // ------------------------------------------------------------------
  it('should extract resourceId from request.params.id', (done) => {
    const context = buildMockContext({
      method: 'GET',
      url: '/claims/claim-777',
      params: { id: 'claim-777' },
      user: { id: 'user-resource' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ resourceId: 'claim-777' }),
        );
        done();
      },
      error: done,
    });
  });

  it('should set resourceId to undefined when params.id is absent', (done) => {
    const context = buildMockContext({
      method: 'GET',
      url: '/claims',
      params: {},
      user: { id: 'user-list' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ resourceId: undefined }),
        );
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 9. Falls back to user.sub when user.id is absent
  // ------------------------------------------------------------------
  it('should use user.sub as userId when user.id is not present', (done) => {
    const context = buildMockContext({
      method: 'GET',
      user: { sub: 'sub-user-999' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ userId: 'sub-user-999' }),
        );
        done();
      },
      error: done,
    });
  });

  // ------------------------------------------------------------------
  // 10. Falls back to x-forwarded-for header when request.ip is absent
  // ------------------------------------------------------------------
  it('should fall back to x-forwarded-for header for ipAddress', (done) => {
    const context = buildMockContext({
      method: 'GET',
      user: { id: 'user-proxy' },
      ip: undefined,
      headers: { 'x-forwarded-for': '203.0.113.42' },
    });

    interceptor.intercept(context, mockCallHandler).subscribe({
      complete: () => {
        expect(auditService.log).toHaveBeenCalledWith(
          expect.objectContaining({ ipAddress: '203.0.113.42' }),
        );
        done();
      },
      error: done,
    });
  });
});
