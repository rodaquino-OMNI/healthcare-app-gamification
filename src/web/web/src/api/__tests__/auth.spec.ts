/**
 * Tests for src/web/web/src/api/auth.ts
 *
 * The web auth module uses restClient (axios) via @/api/client.
 * We mock restClient to validate endpoints, methods, and error handling.
 */

import { login, logout, getProfile, changePassword, enable2FA, disable2FA, configure2FA, deleteAccount } from '../auth';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../client', () => ({
    restClient: mockClient,
}));

jest.mock('shared/constants/api', () => ({
    API_BASE_URL: 'https://api.austa.com.br',
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

describe('login', () => {
    it('should POST /auth/login with email and password', async () => {
        const session = { accessToken: 'at', refreshToken: 'rt', expiresAt: 123 };
        mockClient.post.mockResolvedValue({ data: session });

        const result = await login('user@test.com', 'pass123');

        expect(mockClient.post).toHaveBeenCalledWith('https://api.austa.com.br/auth/login', {
            email: 'user@test.com',
            password: 'pass123',
        });
        expect(result).toEqual(session);
    });

    it('should throw on network error', async () => {
        mockClient.post.mockRejectedValue(new Error('Network error'));

        await expect(login('a@b.com', 'p')).rejects.toThrow('Network error');
    });
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

describe('logout', () => {
    it('should POST /auth/logout', async () => {
        mockClient.post.mockResolvedValue({});

        await logout();

        expect(mockClient.post).toHaveBeenCalledWith('https://api.austa.com.br/auth/logout');
    });
});

// ---------------------------------------------------------------------------
// getProfile
// ---------------------------------------------------------------------------

describe('getProfile', () => {
    it('should GET /auth/profile', async () => {
        const profile = { name: 'John', email: 'john@test.com' };
        mockClient.get.mockResolvedValue({ data: profile });

        const result = await getProfile();

        expect(mockClient.get).toHaveBeenCalledWith('https://api.austa.com.br/auth/profile');
        expect(result).toEqual(profile);
    });
});

// ---------------------------------------------------------------------------
// changePassword
// ---------------------------------------------------------------------------

describe('changePassword', () => {
    it('should PUT /auth/change-password', async () => {
        mockClient.put.mockResolvedValue({});

        await changePassword('old-pass', 'new-pass');

        expect(mockClient.put).toHaveBeenCalledWith('https://api.austa.com.br/auth/change-password', {
            currentPassword: 'old-pass',
            newPassword: 'new-pass',
        });
    });
});

// ---------------------------------------------------------------------------
// enable2FA
// ---------------------------------------------------------------------------

describe('enable2FA', () => {
    it('should POST /auth/2fa/enable and return QR/secret', async () => {
        const data = { qrCode: 'qr://code', secret: 'ABC123' };
        mockClient.post.mockResolvedValue({ data });

        const result = await enable2FA();

        expect(mockClient.post).toHaveBeenCalledWith('https://api.austa.com.br/auth/2fa/enable');
        expect(result).toEqual(data);
    });
});

// ---------------------------------------------------------------------------
// disable2FA
// ---------------------------------------------------------------------------

describe('disable2FA', () => {
    it('should POST /auth/2fa/disable', async () => {
        mockClient.post.mockResolvedValue({});

        await disable2FA();

        expect(mockClient.post).toHaveBeenCalledWith('https://api.austa.com.br/auth/2fa/disable');
    });
});

// ---------------------------------------------------------------------------
// configure2FA
// ---------------------------------------------------------------------------

describe('configure2FA', () => {
    it('should PUT /auth/2fa/configure with method and optional phone', async () => {
        mockClient.put.mockResolvedValue({});

        await configure2FA('sms', '+5511999999999');

        expect(mockClient.put).toHaveBeenCalledWith('https://api.austa.com.br/auth/2fa/configure', {
            method: 'sms',
            phone: '+5511999999999',
        });
    });
});

// ---------------------------------------------------------------------------
// deleteAccount
// ---------------------------------------------------------------------------

describe('deleteAccount', () => {
    it('should DELETE /users/me with password and reason', async () => {
        mockClient.delete.mockResolvedValue({});

        await deleteAccount('my-password', 'Not using anymore');

        expect(mockClient.delete).toHaveBeenCalledWith('https://api.austa.com.br/users/me', {
            data: { password: 'my-password', reason: 'Not using anymore' },
        });
    });
});
