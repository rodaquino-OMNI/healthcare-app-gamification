/**
 * Tests for src/web/mobile/src/api/auth.ts
 *
 * The mobile auth module uses the native fetch API (cross-fetch).
 * We mock global.fetch to validate endpoints, methods, and error handling.
 */

import {
    login,
    register,
    verifyMfa,
    refreshToken,
    socialLogin,
    forgotPassword,
    verifyEmail,
    setPassword,
    logout,
    getProfile,
    updateProfile,
    deleteAccount,
    registerBiometricKey,
    getBiometricChallenge,
    verifyBiometricSignature,
} from '../auth';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('cross-fetch', () => {
    const mockFetch = jest.fn();
    return { __esModule: true, default: mockFetch };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires -- Dynamic require for test mock isolation
const fetchModule = require('cross-fetch');
const mockFetch: jest.Mock = fetchModule.default;

function mockOkResponse(body: unknown) {
    return { ok: true, status: 200, json: jest.fn().mockResolvedValue(body) };
}

function mockErrorResponse(status: number, body: unknown) {
    return { ok: false, status, json: jest.fn().mockResolvedValue(body) };
}

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

describe('login', () => {
    it('should POST /auth/login with email and password', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const result = await login('test@test.com', 'password123');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/login');
        expect(options.method).toBe('POST');
        expect(JSON.parse(options.body)).toEqual({ email: 'test@test.com', password: 'password123' });
        expect(result).toEqual(session);
    });

    it('should throw on auth failure', async () => {
        mockFetch.mockResolvedValue(mockErrorResponse(401, { message: 'Invalid credentials' }));

        await expect(login('bad@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
});

// ---------------------------------------------------------------------------
// register
// ---------------------------------------------------------------------------

describe('register', () => {
    it('should POST /auth/register with user data', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const userData = { name: 'John', email: 'john@test.com', password: 'pass', acceptedTerms: true };
        const result = await register(userData);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/register');
        expect(options.method).toBe('POST');
        expect(result).toEqual(session);
    });

    it('should throw on registration failure', async () => {
        mockFetch.mockResolvedValue(mockErrorResponse(400, { message: 'Email taken' }));

        await expect(register({ name: 'J', email: 'j@t.com', password: 'p', acceptedTerms: true })).rejects.toThrow(
            'Email taken'
        );
    });
});

// ---------------------------------------------------------------------------
// verifyMfa
// ---------------------------------------------------------------------------

describe('verifyMfa', () => {
    it('should POST /auth/verify-mfa with code and temp token', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const result = await verifyMfa('123456', 'tmp-token');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/verify-mfa');
        expect(options.headers.Authorization).toBe('Bearer tmp-token');
        expect(JSON.parse(options.body)).toEqual({ code: '123456' });
        expect(result).toEqual(session);
    });

    it('should throw on MFA failure', async () => {
        mockFetch.mockResolvedValue(mockErrorResponse(400, { message: 'Invalid code' }));

        await expect(verifyMfa('000000', 'tmp')).rejects.toThrow('Invalid code');
    });
});

// ---------------------------------------------------------------------------
// refreshToken
// ---------------------------------------------------------------------------

describe('refreshToken', () => {
    it('should POST /auth/refresh with credentials', async () => {
        const session = { accessToken: 'new-at', refreshToken: 'new-rt', expiresAt: 999, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const result = await refreshToken();

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/refresh');
        expect(options.method).toBe('POST');
        expect(options.credentials).toBe('include');
        expect(result).toEqual(session);
    });
});

// ---------------------------------------------------------------------------
// socialLogin
// ---------------------------------------------------------------------------

describe('socialLogin', () => {
    it('should POST /auth/social/:provider', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const tokenData = { idToken: 'gtoken', provider: 'google' };
        const result = await socialLogin('google', tokenData);

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/social/google');
        expect(options.method).toBe('POST');
        expect(result).toEqual(session);
    });
});

// ---------------------------------------------------------------------------
// forgotPassword
// ---------------------------------------------------------------------------

describe('forgotPassword', () => {
    it('should POST /auth/forgot-password with email', async () => {
        mockFetch.mockResolvedValue(mockOkResponse({ message: 'Email sent' }));

        const result = await forgotPassword('test@test.com');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/forgot-password');
        expect(JSON.parse(options.body)).toEqual({ email: 'test@test.com' });
        expect(result.message).toBe('Email sent');
    });
});

// ---------------------------------------------------------------------------
// verifyEmail
// ---------------------------------------------------------------------------

describe('verifyEmail', () => {
    it('should POST /auth/verify-email with token', async () => {
        mockFetch.mockResolvedValue(mockOkResponse({ verified: true }));

        const result = await verifyEmail('verify-token');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/verify-email');
        expect(JSON.parse(options.body)).toEqual({ token: 'verify-token' });
        expect(result.verified).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// setPassword
// ---------------------------------------------------------------------------

describe('setPassword', () => {
    it('should POST /auth/set-password with token and new password', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const result = await setPassword('reset-token', 'NewPass123!');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/set-password');
        expect(JSON.parse(options.body)).toEqual({ token: 'reset-token', newPassword: 'NewPass123!' });
        expect(result).toEqual(session);
    });
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

describe('logout', () => {
    it('should POST /auth/logout with access token', async () => {
        mockFetch.mockResolvedValue({ ok: true, status: 200 });

        await logout('access-token');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/logout');
        expect(options.headers.Authorization).toBe('Bearer access-token');
    });

    it('should throw on logout failure', async () => {
        mockFetch.mockResolvedValue(mockErrorResponse(500, { message: 'Server error' }));

        await expect(logout('bad-token')).rejects.toThrow('Server error');
    });
});

// ---------------------------------------------------------------------------
// getProfile
// ---------------------------------------------------------------------------

describe('getProfile', () => {
    it('should GET /auth/profile with access token', async () => {
        const profile = { id: 'u1', name: 'John', email: 'john@test.com' };
        mockFetch.mockResolvedValue(mockOkResponse(profile));

        const result = await getProfile('access-token');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/profile');
        expect(options.method).toBe('GET');
        expect(options.headers.Authorization).toBe('Bearer access-token');
        expect(result).toEqual(profile);
    });
});

// ---------------------------------------------------------------------------
// updateProfile
// ---------------------------------------------------------------------------

describe('updateProfile', () => {
    it('should PUT /auth/profile with updates', async () => {
        const profile = { id: 'u1', name: 'Jane', email: 'jane@test.com' };
        mockFetch.mockResolvedValue(mockOkResponse(profile));

        const result = await updateProfile('access-token', { name: 'Jane' });

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/profile');
        expect(options.method).toBe('PUT');
        expect(JSON.parse(options.body)).toEqual({ name: 'Jane' });
        expect(result).toEqual(profile);
    });
});

// ---------------------------------------------------------------------------
// deleteAccount
// ---------------------------------------------------------------------------

describe('deleteAccount', () => {
    it('should DELETE /auth/account with confirmation code', async () => {
        mockFetch.mockResolvedValue({ ok: true, status: 200 });

        await deleteAccount('access-token', 'CONFIRM123');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/account');
        expect(options.method).toBe('DELETE');
        expect(JSON.parse(options.body)).toEqual({ confirmationCode: 'CONFIRM123' });
    });
});

// ---------------------------------------------------------------------------
// Biometric functions
// ---------------------------------------------------------------------------

describe('registerBiometricKey', () => {
    it('should POST /auth/biometric/register with public key', async () => {
        mockFetch.mockResolvedValue(mockOkResponse({ registered: true }));

        const result = await registerBiometricKey('access-token', 'rsa-pub-key');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/biometric/register');
        expect(JSON.parse(options.body)).toEqual({ publicKey: 'rsa-pub-key' });
        expect(result.registered).toBe(true);
    });
});

describe('getBiometricChallenge', () => {
    it('should GET /auth/biometric/challenge', async () => {
        mockFetch.mockResolvedValue(mockOkResponse({ challenge: 'abc123' }));

        const result = await getBiometricChallenge();

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/biometric/challenge');
        expect(options.method).toBe('GET');
        expect(result.challenge).toBe('abc123');
    });
});

describe('verifyBiometricSignature', () => {
    it('should POST /auth/biometric/verify with signature and challenge', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123, userId: 'u1' };
        mockFetch.mockResolvedValue(mockOkResponse({ session }));

        const result = await verifyBiometricSignature('sig123', 'challenge123');

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/auth/biometric/verify');
        expect(JSON.parse(options.body)).toEqual({ signature: 'sig123', challenge: 'challenge123' });
        expect(result).toEqual(session);
    });
});
