/* eslint-disable @typescript-eslint/no-explicit-any */

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
      canActivate() { return true; }
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

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
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

  const mockAuthServiceUrl = 'http://auth-service:3001';

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService.get.mockReturnValue(mockAuthServiceUrl);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolvers,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
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

      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${mockAuthServiceUrl}/auth/login`,
        { email: 'user@example.com', password: 'mock-password' },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should propagate http errors from the auth service', async () => {
      const { throwError } = await import('rxjs');
      mockHttpService.post.mockReturnValue(throwError(() => new Error('Unauthorized')));

      await expect(resolvers.login('user@example.com', 'wrong-password')).rejects.toThrow(
        'Unauthorized',
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
        { name: 'Jane', email: 'jane@example.com', password: 'mock-password' },
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

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${mockAuthServiceUrl}/users/user-1`,
      );
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

      expect(mockHttpService.post).toHaveBeenCalledWith(
        `${mockAuthServiceUrl}/auth/logout`,
        { userId: 'user-1' },
      );
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
        { userId: 'user-1' },
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
        { email: 'jane@example.com' },
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
        { token: 'mock-reset-token', password: 'new-mock-password' },
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
        { name: 'Jane Updated', email: undefined },
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
