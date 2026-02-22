import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConsentGuard, CONSENT_KEY, RequireConsent } from './consent.guard';
import { ConsentService } from './consent.service';
import { ConsentType } from './dto/create-consent.dto';
import { AppException, ErrorType } from '../exceptions/exceptions.types';

const mockConsentService = {
  hasActiveConsent: jest.fn(),
};

const mockReflector = {
  get: jest.fn(),
};

/**
 * Creates a mock ExecutionContext for HTTP requests.
 */
function createMockContext(user: Record<string, any> | null): ExecutionContext {
  const mockRequest = { user };
  return {
    getHandler: jest.fn().mockReturnValue(() => {}),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    }),
  } as unknown as ExecutionContext;
}

describe('ConsentGuard', () => {
  let guard: ConsentGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsentGuard,
        { provide: ConsentService, useValue: mockConsentService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<ConsentGuard>(ConsentGuard);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // No consent metadata
  // ─────────────────────────────────────────────────────────────────────────

  describe('when no consent metadata is set on the route handler', () => {
    it('allows the request through without checking consent', async () => {
      mockReflector.get.mockReturnValue(undefined);
      const context = createMockContext({ id: 'user-001' });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockConsentService.hasActiveConsent).not.toHaveBeenCalled();
    });

    it('allows the request through when metadata is null', async () => {
      mockReflector.get.mockReturnValue(null);
      const context = createMockContext({ id: 'user-001' });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockConsentService.hasActiveConsent).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // User has active consent
  // ─────────────────────────────────────────────────────────────────────────

  describe('when user has active consent for the required type', () => {
    it('allows the request through', async () => {
      mockReflector.get.mockReturnValue(ConsentType.HEALTH_DATA_SHARING);
      mockConsentService.hasActiveConsent.mockResolvedValue(true);
      const context = createMockContext({ id: 'user-002' });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockConsentService.hasActiveConsent).toHaveBeenCalledWith(
        'user-002',
        ConsentType.HEALTH_DATA_SHARING,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // User lacks required consent
  // ─────────────────────────────────────────────────────────────────────────

  describe('when user lacks the required consent', () => {
    it('throws CONSENT_004 (FORBIDDEN)', async () => {
      mockReflector.get.mockReturnValue(ConsentType.TELEMEDICINE);
      mockConsentService.hasActiveConsent.mockResolvedValue(false);
      const context = createMockContext({ id: 'user-003' });

      try {
        await guard.canActivate(context);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.FORBIDDEN);
        expect(error.code).toBe('CONSENT_004');
        expect(error.message).toContain(ConsentType.TELEMEDICINE);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // No authenticated user on the request
  // ─────────────────────────────────────────────────────────────────────────

  describe('when there is no authenticated user on the request', () => {
    it('throws CONSENT_003 (UNAUTHORIZED)', async () => {
      mockReflector.get.mockReturnValue(ConsentType.DATA_PROCESSING);
      const context = createMockContext(null);

      try {
        await guard.canActivate(context);
        fail('Expected AppException to be thrown');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.UNAUTHORIZED);
        expect(error.code).toBe('CONSENT_003');
        expect(error.message).toContain('Authentication required');
      }
    });

    it('does not call hasActiveConsent when there is no user', async () => {
      mockReflector.get.mockReturnValue(ConsentType.MARKETING);
      const context = createMockContext(null);

      try {
        await guard.canActivate(context);
      } catch {
        // expected
      }

      expect(mockConsentService.hasActiveConsent).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // user.id vs user.sub fallback
  // ─────────────────────────────────────────────────────────────────────────

  describe('user identifier resolution', () => {
    it('uses user.id when it is present', async () => {
      mockReflector.get.mockReturnValue(ConsentType.RESEARCH);
      mockConsentService.hasActiveConsent.mockResolvedValue(true);
      const context = createMockContext({ id: 'explicit-id', sub: 'jwt-sub' });

      await guard.canActivate(context);

      expect(mockConsentService.hasActiveConsent).toHaveBeenCalledWith(
        'explicit-id',
        ConsentType.RESEARCH,
      );
    });

    it('falls back to user.sub when user.id is not present', async () => {
      mockReflector.get.mockReturnValue(ConsentType.THIRD_PARTY_SHARING);
      mockConsentService.hasActiveConsent.mockResolvedValue(true);
      const context = createMockContext({ sub: 'jwt-sub-only' });

      await guard.canActivate(context);

      expect(mockConsentService.hasActiveConsent).toHaveBeenCalledWith(
        'jwt-sub-only',
        ConsentType.THIRD_PARTY_SHARING,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CONSENT_KEY and RequireConsent exports
  // ─────────────────────────────────────────────────────────────────────────

  describe('CONSENT_KEY constant', () => {
    it('exports the correct metadata key string', () => {
      expect(CONSENT_KEY).toBe('required_consent');
    });
  });

  describe('RequireConsent decorator', () => {
    it('is a function (decorator factory)', () => {
      expect(typeof RequireConsent).toBe('function');
    });

    it('creates a decorator when called with a ConsentType', () => {
      const decorator = RequireConsent(ConsentType.HEALTH_DATA_SHARING);
      expect(typeof decorator).toBe('function');
    });
  });
});
