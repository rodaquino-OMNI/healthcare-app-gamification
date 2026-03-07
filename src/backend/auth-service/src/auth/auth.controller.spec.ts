/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { LockoutGuard } from './guards/lockout.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoggerService } from '@app/shared/logging/logger.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateToken: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    setContext: jest.fn(),
  };

  const mockCanActivate = jest.fn().mockReturnValue(true);

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCanActivate.mockReturnValue(true);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    })
      .overrideGuard(LockoutGuard)
      .useValue({ canActivate: mockCanActivate })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // register
  // -------------------------------------------------------------------------
  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'mock-password',
    };

    const createdUser = {
      id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    it('should delegate to AuthService.register and return the created user', async () => {
      mockAuthService.register.mockResolvedValue(createdUser);

      const result = await controller.register(createUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should propagate AppException from AuthService when email already exists', async () => {
      const exception = new AppException(
        'User with this email already exists',
        ErrorType.VALIDATION,
        'AUTH_002',
      );
      mockAuthService.register.mockRejectedValue(exception);

      await expect(controller.register(createUserDto)).rejects.toThrow(AppException);
    });

    it('should propagate unexpected errors from AuthService', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Database failure'));

      await expect(controller.register(createUserDto)).rejects.toThrow('Database failure');
    });
  });

  // -------------------------------------------------------------------------
  // login
  // -------------------------------------------------------------------------
  describe('login', () => {
    const mockRequest = {
      body: { email: 'jane@example.com', password: 'mock-password' },
      user: { id: 'user-1', email: 'jane@example.com' },
    };

    const tokenResponse = {
      access_token: 'mock-token',
      user: { id: 'user-1', name: 'Jane Doe', email: 'jane@example.com' },
    };

    it('should call AuthService.login with email and password from request body', async () => {
      mockAuthService.login.mockResolvedValue(tokenResponse);

      const result = await controller.login(mockRequest as any);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.password,
      );
      expect(result).toEqual(tokenResponse);
    });

    it('should return the access token and user on successful login', async () => {
      mockAuthService.login.mockResolvedValue(tokenResponse);

      const result = await controller.login(mockRequest as any);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should propagate AppException when credentials are invalid', async () => {
      const exception = new AppException(
        'Invalid login credentials',
        ErrorType.VALIDATION,
        'AUTH_004',
      );
      mockAuthService.login.mockRejectedValue(exception);

      await expect(controller.login(mockRequest as any)).rejects.toThrow(AppException);
    });
  });

  // -------------------------------------------------------------------------
  // getProfile
  // -------------------------------------------------------------------------
  describe('getProfile', () => {
    it('should return the currently authenticated user directly', () => {
      const authenticatedUser = {
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        roles: ['user'],
      };

      const result = controller.getProfile(authenticatedUser);

      expect(result).toEqual(authenticatedUser);
    });

    it('should return the user as-is without additional transformation', () => {
      const user = { id: 'user-2', email: 'admin@example.com', roles: ['admin'] };

      const result = controller.getProfile(user);

      expect(result).toBe(user);
    });

    it('should return undefined when no user is present in context', () => {
      const result = controller.getProfile(undefined);

      expect(result).toBeUndefined();
    });
  });
});
