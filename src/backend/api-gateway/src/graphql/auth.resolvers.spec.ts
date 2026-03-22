/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */

// ---------------------------------------------------------------------------
// Mock @nestjs/graphql to avoid schema compilation at test time
// ---------------------------------------------------------------------------
jest.mock('@nestjs/graphql', () => ({
    Resolver: () => () => undefined,
    Query: () => () => undefined,
    Mutation: () => () => undefined,
    Args: () => () => undefined,
}));

// ---------------------------------------------------------------------------
// Mock @nestjs/passport / jwt guard used indirectly
// ---------------------------------------------------------------------------
jest.mock('@nestjs/passport', () => {
    const AuthGuard = (_strategy: string) =>
        class MockAuthGuard {
            canActivate() {
                return true;
            }
        };
    return { AuthGuard };
});

// ---------------------------------------------------------------------------
// Mock @nestjs/graphql GqlExecutionContext used by jwt-auth.guard
// ---------------------------------------------------------------------------
jest.mock('@nestjs/graphql', () => ({
    Resolver: () => () => undefined,
    Query: () => () => undefined,
    Mutation: () => () => undefined,
    Args: () => () => undefined,
    GqlExecutionContext: {
        create: jest.fn().mockReturnValue({
            getContext: jest.fn().mockReturnValue({ req: {} }),
        }),
    },
}));

import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { AuthResolvers } from './auth.resolvers';

describe('AuthResolvers', () => {
    let resolvers: AuthResolvers;

    const mockHttpService = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockCacheManager = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
        del: jest.fn().mockResolvedValue(undefined),
    };

    const mockAuthServiceUrl = 'http://auth-service:3001';

    beforeEach(async () => {
        jest.clearAllMocks();

        mockConfigService.get.mockReturnValue(mockAuthServiceUrl);
        mockCacheManager.get.mockResolvedValue(null);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolvers,
                { provide: HttpService, useValue: mockHttpService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: CACHE_MANAGER, useValue: mockCacheManager },
            ],
        }).compile();

        resolvers = module.get<AuthResolvers>(AuthResolvers);
    });

    it('should be defined', () => {
        expect(resolvers).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // login
    // -------------------------------------------------------------------------
    describe('login', () => {
        it('should POST to auth service login endpoint and return response data', async () => {
            const mockResponse = {
                data: { access_token: 'mock-token', user: { id: 'user-1' } },
            };
            mockHttpService.post.mockReturnValue(of(mockResponse));

            const result = await resolvers.login('user@example.com', 'mock-password');

            expect(mockHttpService.post).toHaveBeenCalledWith(`${mockAuthServiceUrl}/auth/login`, {
                email: 'user@example.com',
                password: 'mock-password',
            });
            expect(result).toEqual(mockResponse.data);
        });

        it('should propagate http errors from the auth service', async () => {
            const { throwError } = await import('rxjs');
            mockHttpService.post.mockReturnValue(throwError(() => new Error('Unauthorized')));

            await expect(resolvers.login('user@example.com', 'wrong-password')).rejects.toThrow(
                'Unauthorized'
            );
        });
    });

    // -------------------------------------------------------------------------
    // register
    // -------------------------------------------------------------------------
    describe('register', () => {
        it('should POST to auth service register endpoint and return the new user', async () => {
            const newUser = { id: 'user-2', name: 'Jane', email: 'jane@example.com' };
            mockHttpService.post.mockReturnValue(of({ data: newUser }));

            const result = await resolvers.register('Jane', 'jane@example.com', 'mock-password');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/register`,
                { name: 'Jane', email: 'jane@example.com', password: 'mock-password' }
            );
            expect(result).toEqual(newUser);
        });
    });

    // -------------------------------------------------------------------------
    // getUser
    // -------------------------------------------------------------------------
    describe('getUser', () => {
        it('should GET the user by ID from auth service', async () => {
            const user = { id: 'user-1', name: 'Jane', email: 'jane@example.com' };
            mockHttpService.get.mockReturnValue(of({ data: user }));

            const result = await resolvers.getUser({ id: 'user-1' }, 'user-1');

            expect(mockHttpService.get).toHaveBeenCalledWith(`${mockAuthServiceUrl}/users/user-1`);
            expect(result).toEqual(user);
        });

        it('should propagate errors when user is not found', async () => {
            const { throwError } = await import('rxjs');
            mockHttpService.get.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.getUser({}, 'nonexistent-id')).rejects.toThrow('Not Found');
        });
    });

    // -------------------------------------------------------------------------
    // logout
    // -------------------------------------------------------------------------
    describe('logout', () => {
        it('should POST to auth service logout endpoint with the user ID', async () => {
            const mockUser = { id: 'user-1', email: 'jane@example.com' };
            mockHttpService.post.mockReturnValue(of({ data: { success: true } }));

            const result = await resolvers.logout(mockUser);

            expect(mockHttpService.post).toHaveBeenCalledWith(`${mockAuthServiceUrl}/auth/logout`, {
                userId: 'user-1',
            });
            expect(result).toEqual({ success: true });
        });
    });

    // -------------------------------------------------------------------------
    // refreshToken
    // -------------------------------------------------------------------------
    describe('refreshToken', () => {
        it('should POST to the refresh token endpoint with the user ID', async () => {
            const tokenData = { access_token: 'new-mock-token' };
            mockHttpService.post.mockReturnValue(of({ data: tokenData }));

            const result = await resolvers.refreshToken({ id: 'user-1' });

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/refresh`,
                { userId: 'user-1' }
            );
            expect(result).toEqual(tokenData);
        });
    });

    // -------------------------------------------------------------------------
    // requestPasswordReset
    // -------------------------------------------------------------------------
    describe('requestPasswordReset', () => {
        it('should POST to the reset-request endpoint with the user email', async () => {
            mockHttpService.post.mockReturnValue(of({ data: { message: 'Email sent' } }));

            const result = await resolvers.requestPasswordReset('jane@example.com');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/password/reset-request`,
                { email: 'jane@example.com' }
            );
            expect(result).toEqual({ message: 'Email sent' });
        });
    });

    // -------------------------------------------------------------------------
    // resetPassword
    // -------------------------------------------------------------------------
    describe('resetPassword', () => {
        it('should POST to the reset endpoint with token and new password', async () => {
            mockHttpService.post.mockReturnValue(of({ data: { success: true } }));

            const result = await resolvers.resetPassword('mock-reset-token', 'new-mock-password');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/password/reset`,
                { token: 'mock-reset-token', password: 'new-mock-password' }
            );
            expect(result).toEqual({ success: true });
        });
    });

    // -------------------------------------------------------------------------
    // updateUser
    // -------------------------------------------------------------------------
    describe('updateUser', () => {
        it('should PATCH user data via auth service and return updated user', async () => {
            const updatedUser = { id: 'user-1', name: 'Jane Updated', email: 'jane@example.com' };
            mockHttpService.patch.mockReturnValue(of({ data: updatedUser }));

            const result = await resolvers.updateUser({ id: 'user-1' }, 'Jane Updated', undefined);

            expect(mockHttpService.patch).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/users/user-1`,
                { name: 'Jane Updated', email: undefined }
            );
            expect(result).toEqual(updatedUser);
        });

        it('should propagate errors from auth service', async () => {
            mockHttpService.patch.mockReturnValue(throwError(() => new Error('Forbidden')));

            await expect(resolvers.updateUser({ id: 'user-1' }, 'Name', undefined)).rejects.toThrow(
                'Forbidden'
            );
        });
    });

    // -------------------------------------------------------------------------
    // register - error handling
    // -------------------------------------------------------------------------
    describe('register - error handling', () => {
        it('should propagate errors from auth service', async () => {
            mockHttpService.post.mockReturnValue(
                throwError(() => new Error('Email already exists'))
            );

            await expect(resolvers.register('Jane', 'existing@email.com', 'pass')).rejects.toThrow(
                'Email already exists'
            );
        });
    });

    // -------------------------------------------------------------------------
    // logout - error handling
    // -------------------------------------------------------------------------
    describe('logout - error handling', () => {
        it('should propagate errors from auth service', async () => {
            mockHttpService.post.mockReturnValue(throwError(() => new Error('Session expired')));

            await expect(resolvers.logout({ id: 'user-1' })).rejects.toThrow('Session expired');
        });
    });

    // -------------------------------------------------------------------------
    // refreshToken - error handling
    // -------------------------------------------------------------------------
    describe('refreshToken - error handling', () => {
        it('should propagate errors from auth service', async () => {
            mockHttpService.post.mockReturnValue(throwError(() => new Error('Token expired')));

            await expect(resolvers.refreshToken({ id: 'user-1' })).rejects.toThrow('Token expired');
        });
    });

    // -------------------------------------------------------------------------
    // changePassword
    // -------------------------------------------------------------------------
    describe('changePassword', () => {
        it('should POST to change password endpoint', async () => {
            const mockUser = { id: 'user-1', email: 'test@example.com' };
            mockHttpService.post.mockReturnValue(of({ data: { success: true } }));

            const result = await resolvers.changePassword(mockUser, 'old-pass', 'new-pass');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/password/change`,
                { userId: 'user-1', oldPassword: 'old-pass', newPassword: 'new-pass' }
            );
            expect(result).toEqual({ success: true });
        });

        it('should propagate errors from auth service', async () => {
            mockHttpService.post.mockReturnValue(throwError(() => new Error('Invalid password')));

            await expect(
                resolvers.changePassword({ id: 'user-1' }, 'wrong', 'new')
            ).rejects.toThrow('Invalid password');
        });
    });

    // -------------------------------------------------------------------------
    // verifyMFA
    // -------------------------------------------------------------------------
    describe('verifyMFA', () => {
        it('should POST to MFA verify endpoint with code', async () => {
            const mockUser = { id: 'user-1' };
            mockHttpService.post.mockReturnValue(of({ data: { verified: true } }));

            const result = await resolvers.verifyMFA(mockUser, '123456');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/mfa/verify`,
                { userId: 'user-1', code: '123456' }
            );
            expect(result).toEqual({ verified: true });
        });

        it('should propagate errors for invalid code', async () => {
            mockHttpService.post.mockReturnValue(throwError(() => new Error('Invalid MFA code')));

            await expect(resolvers.verifyMFA({ id: 'u1' }, '000000')).rejects.toThrow(
                'Invalid MFA code'
            );
        });
    });

    // -------------------------------------------------------------------------
    // setupMFA
    // -------------------------------------------------------------------------
    describe('setupMFA', () => {
        it('should POST to MFA setup endpoint', async () => {
            const mockUser = { id: 'user-1' };
            const mfaData = { qrCode: 'data:image/png;base64,...', secret: 'JBSWY3DPEHPK3PXP' };
            mockHttpService.post.mockReturnValue(of({ data: mfaData }));

            const result = await resolvers.setupMFA(mockUser);

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/mfa/setup`,
                { userId: 'user-1' }
            );
            expect(result).toEqual(mfaData);
        });

        it('should propagate errors', async () => {
            mockHttpService.post.mockReturnValue(
                throwError(() => new Error('MFA already enabled'))
            );

            await expect(resolvers.setupMFA({ id: 'user-1' })).rejects.toThrow(
                'MFA already enabled'
            );
        });
    });

    // -------------------------------------------------------------------------
    // disableMFA
    // -------------------------------------------------------------------------
    describe('disableMFA', () => {
        it('should POST to MFA disable endpoint', async () => {
            const mockUser = { id: 'user-1' };
            mockHttpService.post.mockReturnValue(of({ data: { success: true } }));

            const result = await resolvers.disableMFA(mockUser);

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/mfa/disable`,
                { userId: 'user-1' }
            );
            expect(result).toEqual({ success: true });
        });

        it('should propagate errors', async () => {
            mockHttpService.post.mockReturnValue(throwError(() => new Error('MFA not enabled')));

            await expect(resolvers.disableMFA({ id: 'u1' })).rejects.toThrow('MFA not enabled');
        });
    });

    // -------------------------------------------------------------------------
    // socialLogin
    // -------------------------------------------------------------------------
    describe('socialLogin', () => {
        it('should POST to social login endpoint with provider and token', async () => {
            const loginData = { access_token: 'jwt-token', user: { id: 'u1' } };
            mockHttpService.post.mockReturnValue(of({ data: loginData }));

            const result = await resolvers.socialLogin('google', 'google-oauth-token');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/social/google`,
                { token: 'google-oauth-token' }
            );
            expect(result).toEqual(loginData);
        });

        it('should propagate errors for invalid provider', async () => {
            mockHttpService.post.mockReturnValue(throwError(() => new Error('Unknown provider')));

            await expect(resolvers.socialLogin('invalid', 'token')).rejects.toThrow(
                'Unknown provider'
            );
        });
    });

    // -------------------------------------------------------------------------
    // biometricLogin
    // -------------------------------------------------------------------------
    describe('biometricLogin', () => {
        it('should POST biometric data to auth service', async () => {
            const loginData = { access_token: 'jwt-token' };
            mockHttpService.post.mockReturnValue(of({ data: loginData }));

            const result = await resolvers.biometricLogin('fingerprint-data-base64');

            expect(mockHttpService.post).toHaveBeenCalledWith(
                `${mockAuthServiceUrl}/auth/biometric`,
                { biometricData: 'fingerprint-data-base64' }
            );
            expect(result).toEqual(loginData);
        });

        it('should propagate errors', async () => {
            mockHttpService.post.mockReturnValue(
                throwError(() => new Error('Biometric not recognized'))
            );

            await expect(resolvers.biometricLogin('bad-data')).rejects.toThrow(
                'Biometric not recognized'
            );
        });
    });
});
