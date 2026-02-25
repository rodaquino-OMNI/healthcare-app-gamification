/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { RedisService } from '@app/shared/redis/redis.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;

  // ---------------------------------------------------------------------------
  // Mock factories — recreated fresh before each test via jest.clearAllMocks()
  // ---------------------------------------------------------------------------
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findFirst: jest.fn(),
    },
    userRole: {
      create: jest.fn(),
    },
  };

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    validateCredentials: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    setContext: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    expire: jest.fn(),
  };

  // ---------------------------------------------------------------------------
  // Module bootstrap
  // ---------------------------------------------------------------------------
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // register
  // ---------------------------------------------------------------------------
  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret123',
    };

    const createdUser = {
      id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    it('should register a new user and return the created user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await service.register(createUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should throw AppException (VALIDATION / AUTH_002) when email is already registered', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: createUserDto.email,
      });

      await expect(service.register(createUserDto)).rejects.toThrow(AppException);

      // Verify the exact shape of the error on a second invocation
      try {
        await service.register(createUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.code).toBe('AUTH_002');
        expect(error.message).toContain('already exists');
      }
    });

    it('should wrap an unexpected error from usersService.create in AppException (TECHNICAL / AUTH_003)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(new Error('Database connection failed'));

      await expect(service.register(createUserDto)).rejects.toThrow(AppException);

      try {
        await service.register(createUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.TECHNICAL);
        expect(error.code).toBe('AUTH_003');
      }
    });

    it('should rethrow an AppException from usersService.create without additional wrapping', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const innerException = new AppException(
        'User with this email already exists',
        ErrorType.VALIDATION,
        'USER_001',
      );
      mockUsersService.create.mockRejectedValue(innerException);

      await expect(service.register(createUserDto)).rejects.toThrow(innerException);

      try {
        await service.register(createUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe('USER_001');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // login
  // ---------------------------------------------------------------------------
  describe('login', () => {
    const email = 'jane@example.com';
    const password = 'secret123';

    const validatedUser = {
      id: 'user-1',
      name: 'Jane Doe',
      email,
      roles: [{ name: 'user' }],
    };

    it('should return access_token, refresh_token, and user data on successful login', async () => {
      mockRedisService.get.mockResolvedValue(null); // no lockout
      mockRedisService.del.mockResolvedValue(1); // clear lockout counter
      mockRedisService.set.mockResolvedValue('OK'); // store refresh token
      mockUsersService.validateCredentials.mockResolvedValue(validatedUser);
      mockConfigService.get
        .mockReturnValueOnce(5) // lockoutThreshold
        .mockReturnValueOnce('test-jwt-secret')
        .mockReturnValueOnce('1h')
        .mockReturnValueOnce('7d'); // refreshTokenExpiration
      mockJwtService.sign.mockReturnValue('signed-jwt-token');

      const result = await service.login(email, password);

      expect(mockUsersService.validateCredentials).toHaveBeenCalledWith(email, password);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          sub: validatedUser.id,
          email: validatedUser.email,
          roles: ['user'],
        },
        {
          secret: 'test-jwt-secret',
          expiresIn: '1h',
        },
      );
      expect(result.access_token).toBe('signed-jwt-token');
      expect(result.refresh_token).toBeDefined();
      expect(typeof result.refresh_token).toBe('string');
      expect(result.user).toEqual({
        id: validatedUser.id,
        name: validatedUser.name,
        email: validatedUser.email,
      });
    });

    it('should use an empty roles array when the user has no roles attached', async () => {
      const userWithNoRoles = { id: 'user-1', name: 'Jane Doe', email, roles: undefined };
      mockRedisService.get.mockResolvedValue(null); // no lockout
      mockRedisService.del.mockResolvedValue(1);
      mockRedisService.set.mockResolvedValue('OK');
      mockUsersService.validateCredentials.mockResolvedValue(userWithNoRoles);
      mockConfigService.get.mockReturnValue('some-value');
      mockJwtService.sign.mockReturnValue('token');

      await service.login(email, password);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ roles: [] }),
        expect.any(Object),
      );
    });

    it('should throw AppException (VALIDATION / AUTH_004) when validateCredentials fails', async () => {
      mockRedisService.get
        .mockResolvedValueOnce(null) // lockout check: no attempts
        .mockResolvedValueOnce('0'); // counter read for increment
      mockRedisService.set.mockResolvedValue('OK');
      mockConfigService.get
        .mockReturnValueOnce(5) // lockoutThreshold
        .mockReturnValueOnce(1800); // lockoutDuration
      const credentialsError = new AppException(
        'Invalid email or password',
        ErrorType.VALIDATION,
        'USER_007',
      );
      mockUsersService.validateCredentials.mockRejectedValue(credentialsError);

      await expect(service.login(email, password)).rejects.toThrow(AppException);

      // Reset mocks for second invocation
      mockRedisService.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('1');
      mockRedisService.set.mockResolvedValue('OK');
      mockConfigService.get
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(1800);
      mockUsersService.validateCredentials.mockRejectedValue(credentialsError);

      try {
        await service.login(email, password);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.message).toBe('Invalid login credentials');
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.code).toBe('AUTH_004');
      }
    });

    it('should throw AppException (VALIDATION / AUTH_004) when an unexpected error occurs during login', async () => {
      mockRedisService.get
        .mockResolvedValueOnce(null) // lockout check: no attempts
        .mockResolvedValueOnce('0'); // counter read for increment
      mockRedisService.set.mockResolvedValue('OK');
      mockConfigService.get
        .mockReturnValueOnce(5) // lockoutThreshold
        .mockReturnValueOnce(1800); // lockoutDuration
      mockUsersService.validateCredentials.mockRejectedValue(new Error('Unexpected DB failure'));

      await expect(service.login(email, password)).rejects.toThrow(AppException);

      // Reset mocks for second invocation
      mockRedisService.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('1');
      mockRedisService.set.mockResolvedValue('OK');
      mockConfigService.get
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(1800);
      mockUsersService.validateCredentials.mockRejectedValue(new Error('Unexpected DB failure'));

      try {
        await service.login(email, password);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.message).toBe('Invalid login credentials');
        expect(error.type).toBe(ErrorType.VALIDATION);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // login - lockout
  // ---------------------------------------------------------------------------
  describe('login - lockout', () => {
    const email = 'jane@example.com';
    const password = 'secret123';

    it('should throw AUTH_007 when account is locked (threshold reached)', async () => {
      mockRedisService.get.mockResolvedValue('5'); // 5 attempts = threshold
      mockConfigService.get.mockReturnValueOnce(5); // lockoutThreshold

      await expect(service.login(email, password)).rejects.toThrow(AppException);

      // Reset mocks for assertion invocation
      mockRedisService.get.mockResolvedValue('5');
      mockConfigService.get.mockReturnValueOnce(5);

      try {
        await service.login(email, password);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe('AUTH_007');
      }
      expect(mockUsersService.validateCredentials).not.toHaveBeenCalled();
    });

    it('should increment lockout counter on failed login', async () => {
      mockRedisService.get
        .mockResolvedValueOnce(null) // lockout check: 0 attempts (null = no key)
        .mockResolvedValueOnce('2'); // counter read for increment (already 2 attempts)
      mockRedisService.set.mockResolvedValue('OK');
      mockConfigService.get
        .mockReturnValueOnce(5) // lockoutThreshold
        .mockReturnValueOnce(1800); // lockoutDuration
      mockUsersService.validateCredentials.mockRejectedValue(
        new AppException('Invalid credentials', ErrorType.AUTHENTICATION, 'AUTH_004', 401),
      );

      await expect(service.login(email, password)).rejects.toThrow(AppException);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        `lockout:${email}`,
        '3',
        1800,
      );
    });

    it('should reset lockout counter on successful login', async () => {
      const mockUser = { id: 'user-1', email, name: 'Jane Doe', roles: [{ name: 'user' }] };
      mockRedisService.get.mockResolvedValue(null); // no lockout
      mockRedisService.del.mockResolvedValue(1);
      mockRedisService.set.mockResolvedValue('OK');
      mockUsersService.validateCredentials.mockResolvedValue(mockUser);
      mockConfigService.get
        .mockReturnValueOnce(5) // lockoutThreshold
        .mockReturnValueOnce('test-jwt-secret')
        .mockReturnValueOnce('1h')
        .mockReturnValueOnce('7d'); // refreshTokenExpiration
      mockJwtService.sign.mockReturnValue('access-token');

      const result = await service.login(email, password);

      expect(mockRedisService.del).toHaveBeenCalledWith(`lockout:${email}`);
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // generateRefreshToken
  // ---------------------------------------------------------------------------
  describe('generateRefreshToken', () => {
    it('should generate a token and store in Redis with TTL', async () => {
      mockRedisService.set.mockResolvedValue('OK');
      mockConfigService.get.mockReturnValue('7d'); // refreshTokenExpiration

      const token = await service.generateRefreshToken('user-123');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(128); // 64 bytes hex = 128 chars
      expect(mockRedisService.set).toHaveBeenCalledWith(
        expect.stringMatching(/^refresh:/),
        'user-123',
        expect.any(Number),
      );
    });
  });

  // ---------------------------------------------------------------------------
  // refreshTokens
  // ---------------------------------------------------------------------------
  describe('refreshTokens', () => {
    it('should rotate tokens - invalidate old and return new', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', name: 'Test', roles: [{ name: 'user' }] };
      mockRedisService.get.mockResolvedValue('user-123');
      mockRedisService.del.mockResolvedValue(1);
      mockRedisService.set.mockResolvedValue('OK');
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockConfigService.get
        .mockReturnValueOnce('test-jwt-secret') // JWT secret
        .mockReturnValueOnce('1h') // access token expiration
        .mockReturnValueOnce('7d'); // refresh token expiration
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshTokens('old-refresh-token');

      expect(result.access_token).toBe('new-access-token');
      expect(result.refresh_token).toBeDefined();
      expect(typeof result.refresh_token).toBe('string');
      expect(mockRedisService.del).toHaveBeenCalledWith('refresh:old-refresh-token');
      expect(mockRedisService.set).toHaveBeenCalledWith(
        expect.stringMatching(/^refresh:/),
        'user-123',
        expect.any(Number),
      );
    });

    it('should throw AUTH_008 for invalid refresh token', async () => {
      mockRedisService.get.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(AppException);

      mockRedisService.get.mockResolvedValue(null);

      try {
        await service.refreshTokens('invalid-token');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe('AUTH_008');
      }
    });

    it('should throw AUTH_008 when user not found after token lookup', async () => {
      mockRedisService.get.mockResolvedValue('user-123');
      mockRedisService.del.mockResolvedValue(1);
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.refreshTokens('valid-token')).rejects.toThrow(AppException);

      // Reset for assertion
      mockRedisService.get.mockResolvedValue('user-123');
      mockRedisService.del.mockResolvedValue(1);
      mockUsersService.findOne.mockResolvedValue(null);

      try {
        await service.refreshTokens('valid-token');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.code).toBe('AUTH_008');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // revokeRefreshToken
  // ---------------------------------------------------------------------------
  describe('revokeRefreshToken', () => {
    it('should delete refresh token from Redis', async () => {
      mockRedisService.del.mockResolvedValue(1);

      await service.revokeRefreshToken('some-token');

      expect(mockRedisService.del).toHaveBeenCalledWith('refresh:some-token');
    });
  });

  // ---------------------------------------------------------------------------
  // validateToken
  // ---------------------------------------------------------------------------
  describe('validateToken', () => {
    const payload = { sub: 'user-1', email: 'jane@example.com' };

    const foundUser = {
      id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      roles: [{ name: 'user' }],
    };

    it('should return the user when the token payload maps to a valid user', async () => {
      mockUsersService.findOne.mockResolvedValue(foundUser);

      const result = await service.validateToken(payload);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(foundUser);
    });

    it('should return null and log an error when the user is not found', async () => {
      const notFoundError = new AppException(
        'User not found',
        ErrorType.NOT_FOUND,
        'USER_002',
        { id: payload.sub },
      );
      mockUsersService.findOne.mockRejectedValue(notFoundError);

      const result = await service.validateToken(payload);

      expect(result).toBeNull();
      expect(mockLoggerService.error).toHaveBeenCalled();
    });

    it('should return null when findOne throws any unexpected error', async () => {
      mockUsersService.findOne.mockRejectedValue(new Error('Unexpected DB error'));

      const result = await service.validateToken(payload);

      expect(result).toBeNull();
    });
  });
});
