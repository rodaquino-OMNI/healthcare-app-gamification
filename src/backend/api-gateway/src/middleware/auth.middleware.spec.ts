/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
/**
 * Unit tests for AuthMiddleware.
 *
 * The middleware is instantiated directly without NestJS DI so that all
 * collaborators can be supplied as plain mock objects.  The only real module
 * that is exercised is `jsonwebtoken`; everything else is replaced by
 * jest.fn() stubs.
 */

// ---------------------------------------------------------------------------
// Module-level mocks – must be declared before any imports that pull in the
// mocked modules.
// ---------------------------------------------------------------------------

// Mock the path-aliased services so Jest never tries to resolve @app/* paths.
jest.mock('@app/auth/auth/auth.service', () => ({ AuthService: class {} }), { virtual: true });
jest.mock('@app/auth/users/users.service', () => ({ UsersService: class {} }), { virtual: true });
jest.mock('@app/shared/logging/logger.service', () => ({ LoggerService: class {} }), {
    virtual: true,
});

// Mock the configuration module so its registerAs side-effects are skipped.
jest.mock('../config/configuration', () => ({ configuration: {} }), { virtual: true });

// Mock jsonwebtoken so we can control verify() behaviour in each test.
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { AuthMiddleware } from './auth.middleware';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal Express-like request object. */
function buildRequest(authHeader?: string): any {
    return {
        headers: authHeader ? { authorization: authHeader } : {},
    };
}

/** Build a minimal Express-like response object (unused by the middleware). */
function buildResponse(): any {
    return {};
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const TEST_JWT_SECRET = 'test-secret';

beforeAll(() => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;
});

afterAll(() => {
    delete process.env.JWT_SECRET;
});

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a fresh AuthMiddleware with stub collaborators.
 *
 * @param usersServiceOverrides  Optional overrides for the UsersService stub.
 * @param configOverride         Optional configuration object to inject.
 */
function buildMiddleware(
    usersServiceOverrides: Partial<{ findOne: jest.Mock }> = {},
    configOverride: any = {}
) {
    const mockAuthService = {};

    const mockUsersService = {
        findOne: jest.fn().mockResolvedValue({ id: 'user-123', email: 'user@example.com' }),
        ...usersServiceOverrides,
    };

    const mockLoggerService = {
        setContext: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
    };

    const middleware = new AuthMiddleware(
        mockAuthService as any,
        mockUsersService as any,
        mockLoggerService as any,
        configOverride
    );

    return { middleware, mockAuthService, mockUsersService, mockLoggerService };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AuthMiddleware', () => {
    let verifyMock: jest.Mock;

    beforeEach(() => {
        verifyMock = jwt.verify as unknown as jest.Mock;
        verifyMock.mockReset();
    });

    // -------------------------------------------------------------------------
    // Constructor side-effect
    // -------------------------------------------------------------------------

    it('calls loggerService.setContext with "AuthMiddleware" during construction', () => {
        const { mockLoggerService } = buildMiddleware();
        expect(mockLoggerService.setContext).toHaveBeenCalledWith('AuthMiddleware');
    });

    // -------------------------------------------------------------------------
    // Test 1 – No authorization header → calls next()
    // -------------------------------------------------------------------------

    it('calls next() when no authorization header is present', async () => {
        const { middleware } = buildMiddleware();
        const req = buildRequest(); // no header
        const res = buildResponse();
        const next = jest.fn();

        await middleware.use(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(verifyMock).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Test 2 – Invalid format (not "Bearer <token>") → throws UNAUTHORIZED
    // -------------------------------------------------------------------------

    it('throws HttpException UNAUTHORIZED when the Authorization header uses Basic scheme', async () => {
        const { middleware } = buildMiddleware();
        const req = buildRequest('Basic dXNlcjpwYXNz'); // Basic auth, not Bearer
        const res = buildResponse();
        const next = jest.fn();

        await expect(middleware.use(req, res, next)).rejects.toThrow(HttpException);

        try {
            await middleware.use(req, res, next);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            expect((error as HttpException).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        }

        expect(next).not.toHaveBeenCalled();
    });

    it('throws HttpException UNAUTHORIZED when the Authorization header has only one segment', async () => {
        const { middleware } = buildMiddleware();
        const req = buildRequest('justatoken');
        const res = buildResponse();
        const next = jest.fn();

        await expect(middleware.use(req, res, next)).rejects.toThrow(HttpException);

        try {
            await middleware.use(req, res, next);
        } catch (error) {
            expect((error as HttpException).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        }
    });

    // -------------------------------------------------------------------------
    // Test 3 – Valid Bearer token → verifies, finds user, sets req.user, next()
    // -------------------------------------------------------------------------

    it('sets req.user and calls next() when a valid Bearer token is supplied', async () => {
        const decodedPayload = { sub: 'user-123', email: 'user@example.com' };
        verifyMock.mockReturnValue(decodedPayload);

        const { middleware, mockUsersService } = buildMiddleware();
        const req = buildRequest('Bearer valid.jwt.token');
        const res = buildResponse();
        const next = jest.fn();

        await middleware.use(req, res, next);

        // verify() must be called with the raw token and the secret from process.env
        expect(verifyMock).toHaveBeenCalledWith('valid.jwt.token', TEST_JWT_SECRET);

        // The user's id must be looked up
        expect(mockUsersService.findOne).toHaveBeenCalledWith('user-123');

        // req.user must be populated
        expect(req.user).toEqual({ id: 'user-123', email: 'user@example.com' });

        // next() must be invoked exactly once
        expect(next).toHaveBeenCalledTimes(1);
    });

    // -------------------------------------------------------------------------
    // Test 4 – Expired / invalid token → throws UNAUTHORIZED
    // -------------------------------------------------------------------------

    it('throws HttpException UNAUTHORIZED when jwt.verify throws (expired token)', async () => {
        verifyMock.mockImplementation(() => {
            throw new Error('jwt expired');
        });

        const { middleware } = buildMiddleware();
        const req = buildRequest('Bearer expired.jwt.token');
        const res = buildResponse();
        const next = jest.fn();

        let thrownError: unknown;
        try {
            await middleware.use(req, res, next);
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).toBeInstanceOf(HttpException);
        expect((thrownError as HttpException).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(next).not.toHaveBeenCalled();
    });

    it('throws HttpException UNAUTHORIZED when jwt.verify throws a JsonWebTokenError', async () => {
        verifyMock.mockImplementation(() => {
            const err = new Error('invalid signature');
            err.name = 'JsonWebTokenError';
            throw err;
        });

        const { middleware } = buildMiddleware();
        const req = buildRequest('Bearer bad.signature.token');
        const res = buildResponse();
        const next = jest.fn();

        await expect(middleware.use(req, res, next)).rejects.toMatchObject({
            status: HttpStatus.UNAUTHORIZED,
        });

        expect(next).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Test 5 – User not found after successful token verification → UNAUTHORIZED
    // -------------------------------------------------------------------------

    it('throws HttpException UNAUTHORIZED when usersService.findOne throws (user not found)', async () => {
        const decodedPayload = { sub: 'unknown-user', email: 'ghost@example.com' };
        verifyMock.mockReturnValue(decodedPayload);

        const { middleware } = buildMiddleware({
            findOne: jest.fn().mockRejectedValue(new Error('User not found')),
        });

        const req = buildRequest('Bearer valid.but.unknown.user');
        const res = buildResponse();
        const next = jest.fn();

        let thrownError: unknown;
        try {
            await middleware.use(req, res, next);
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).toBeInstanceOf(HttpException);
        expect((thrownError as HttpException).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(next).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Test 6 – getJwtSecret() configuration resolution paths
    // -------------------------------------------------------------------------

    describe('getJwtSecret() – configuration resolution', () => {
        it('reads the secret from configuration when supplied as a function (registerAs result)', async () => {
            const decodedPayload = { sub: 'user-fn', email: 'fn@example.com' };
            verifyMock.mockReturnValue(decodedPayload);

            const mockUsersService = {
                findOne: jest.fn().mockResolvedValue({ id: 'user-fn', email: 'fn@example.com' }),
            };
            const mockLoggerService = { setContext: jest.fn(), log: jest.fn(), error: jest.fn() };

            // configuration as a function — mirrors registerAs result
            const configFn = () => ({ auth: { jwtSecret: 'fn-secret' } });

            const middleware = new AuthMiddleware(
                {} as any,
                mockUsersService as any,
                mockLoggerService as any,
                configFn
            );

            const req = buildRequest('Bearer some.token');
            const next = jest.fn();

            await middleware.use(req, buildResponse(), next);

            expect(verifyMock).toHaveBeenCalledWith('some.token', 'fn-secret');
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('reads the secret from configuration.apiGateway.auth.jwtSecret when present', async () => {
            const decodedPayload = { sub: 'user-gw', email: 'gw@example.com' };
            verifyMock.mockReturnValue(decodedPayload);

            const mockUsersService = {
                findOne: jest.fn().mockResolvedValue({ id: 'user-gw', email: 'gw@example.com' }),
            };
            const mockLoggerService = { setContext: jest.fn(), log: jest.fn(), error: jest.fn() };

            const configObj = { apiGateway: { auth: { jwtSecret: 'gw-secret' } } };

            const middleware = new AuthMiddleware(
                {} as any,
                mockUsersService as any,
                mockLoggerService as any,
                configObj
            );

            const req = buildRequest('Bearer some.token');
            const next = jest.fn();

            await middleware.use(req, buildResponse(), next);

            expect(verifyMock).toHaveBeenCalledWith('some.token', 'gw-secret');
        });

        it('reads the secret from configuration.auth.jwtSecret when present', async () => {
            const decodedPayload = { sub: 'user-auth', email: 'auth@example.com' };
            verifyMock.mockReturnValue(decodedPayload);

            const mockUsersService = {
                findOne: jest
                    .fn()
                    .mockResolvedValue({ id: 'user-auth', email: 'auth@example.com' }),
            };
            const mockLoggerService = { setContext: jest.fn(), log: jest.fn(), error: jest.fn() };

            const configObj = { auth: { jwtSecret: 'auth-secret' } };

            const middleware = new AuthMiddleware(
                {} as any,
                mockUsersService as any,
                mockLoggerService as any,
                configObj
            );

            const req = buildRequest('Bearer some.token');
            const next = jest.fn();

            await middleware.use(req, buildResponse(), next);

            expect(verifyMock).toHaveBeenCalledWith('some.token', 'auth-secret');
        });

        it('falls back to process.env.JWT_SECRET when configuration has no secret paths', async () => {
            const decodedPayload = { sub: 'user-env', email: 'env@example.com' };
            verifyMock.mockReturnValue(decodedPayload);

            const mockUsersService = {
                findOne: jest.fn().mockResolvedValue({ id: 'user-env', email: 'env@example.com' }),
            };
            const mockLoggerService = { setContext: jest.fn(), log: jest.fn(), error: jest.fn() };

            // Empty configuration – secret must come from env
            const middleware = new AuthMiddleware(
                {} as any,
                mockUsersService as any,
                mockLoggerService as any,
                {}
            );

            const req = buildRequest('Bearer env.fallback.token');
            const next = jest.fn();

            await middleware.use(req, buildResponse(), next);

            // process.env.JWT_SECRET was set to TEST_JWT_SECRET in beforeAll
            expect(verifyMock).toHaveBeenCalledWith('env.fallback.token', TEST_JWT_SECRET);
        });
    });
});
