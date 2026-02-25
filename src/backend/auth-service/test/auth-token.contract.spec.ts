/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisService } from '@app/shared/redis/redis.service';

/**
 * Auth Token Contract Tests
 * Verify the JWT payload structure that JwtStrategy, JwtAuthGuard,
 * RolesGuard, and @CurrentUser all depend on.
 */
describe('Auth Token Contract', () => {
  let service: AuthService;
  let signedPayload: Record<string, any>;

  const mockUser = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Jane Doe',
    email: 'jane@example.com',
    roles: [{ name: 'patient' }, { name: 'admin' }],
  };

  const configMap: Record<string, any> = {
    'authService.jwt.secret': 'test-secret',
    'authService.jwt.accessTokenExpiration': '15m',
    'authService.jwt.refreshTokenExpiration': '7d',
    'authService.password.lockoutThreshold': 5,
  };

  const captureSigner = (payload: any) => {
    signedPayload = { ...payload };
    return 'mock.jwt.token';
  };

  const mockJwtService = { sign: jest.fn(captureSigner), verify: jest.fn() };
  const mockUsersService = {
    create: jest.fn(), findOne: jest.fn(),
    validateCredentials: jest.fn(), update: jest.fn(), remove: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn((key: string) => configMap[key]),
  };
  const noop = jest.fn();
  const mockLoggerService = {
    log: noop, error: noop, warn: noop, debug: noop, verbose: noop, setContext: noop,
  };
  const mockPrismaService = {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    role: { findFirst: jest.fn() },
    userRole: { create: jest.fn() },
  };
  const mockRedisService = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    expire: jest.fn(),
  };

  beforeEach(async () => {
    signedPayload = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();

    mockUsersService.validateCredentials.mockResolvedValue(mockUser);
    mockRedisService.get.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue('OK');
    mockJwtService.sign.mockImplementation(captureSigner);
    mockConfigService.get.mockImplementation((key: string) => configMap[key]);
  });

  it('should include sub, email, and roles in the JWT payload', async () => {
    await service.login('jane@example.com', 'password');

    expect(signedPayload).toHaveProperty('sub');
    expect(signedPayload).toHaveProperty('email');
    expect(signedPayload).toHaveProperty('roles');
    expect(Object.keys(signedPayload)).toEqual(
      expect.arrayContaining(['sub', 'email', 'roles']),
    );
  });

  it('should set sub to a valid UUID string', async () => {
    await service.login('jane@example.com', 'password');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    expect(typeof signedPayload.sub).toBe('string');
    expect(signedPayload.sub).toMatch(uuidRegex);
    expect(signedPayload.sub).toBe(mockUser.id);
  });

  it('should produce roles as a string array of role names', async () => {
    await service.login('jane@example.com', 'password');

    expect(Array.isArray(signedPayload.roles)).toBe(true);
    signedPayload.roles.forEach((role: any) => {
      expect(typeof role).toBe('string');
    });
    expect(signedPayload.roles).toEqual(['patient', 'admin']);
  });

  it('should default roles to an empty array when user has none', async () => {
    mockUsersService.validateCredentials.mockResolvedValue({
      ...mockUser, roles: undefined,
    });
    await service.login('jane@example.com', 'password');

    expect(signedPayload.roles).toEqual([]);
  });

  it('should return the full user object from validateToken for @CurrentUser', async () => {
    const expectedUser = {
      id: mockUser.id, name: mockUser.name,
      email: mockUser.email, roles: mockUser.roles,
    };
    mockUsersService.findOne.mockResolvedValue(expectedUser);

    const result = await service.validateToken({ sub: mockUser.id });

    expect(result).toEqual(expectedUser);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('roles');
    expect(mockUsersService.findOne).toHaveBeenCalledWith(mockUser.id);
  });

  it('should return access_token, refresh_token, and user from login', async () => {
    const result = await service.login('jane@example.com', 'password');

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result).toHaveProperty('user');
    expect(result.user).toEqual({
      id: mockUser.id, name: mockUser.name, email: mockUser.email,
    });
    expect(typeof result.access_token).toBe('string');
    expect(typeof result.refresh_token).toBe('string');
  });
});
