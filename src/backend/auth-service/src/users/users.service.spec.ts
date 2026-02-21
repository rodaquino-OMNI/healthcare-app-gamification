/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock bcrypt before any imports so the module factory is hoisted by Jest
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  // ---------------------------------------------------------------------------
  // Shared mock instances
  // ---------------------------------------------------------------------------
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    role: {
      findFirst: jest.fn(),
    },
    userRole: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    setContext: jest.fn(),
  };

  // ---------------------------------------------------------------------------
  // Module bootstrap
  // ---------------------------------------------------------------------------
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();

    // Restore default bcrypt mock return values after clearAllMocks resets them
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------
  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '11999999999',
    };

    const rawUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
      phone: '11999999999',
      cpf: undefined,
    };

    it('should create a user, assign a default role, and return a sanitized user without a password field', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(rawUser);
      mockPrismaService.role.findFirst.mockResolvedValue({ id: 1, name: 'user' });
      mockPrismaService.userRole.create.mockResolvedValue({});

      const result = await service.create(createUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: 'hashed_password',
          phone: createUserDto.phone,
          cpf: createUserDto.cpf,
        },
      });
      expect(mockPrismaService.role.findFirst).toHaveBeenCalledWith({
        where: { name: 'user' },
      });
      expect(mockPrismaService.userRole.create).toHaveBeenCalledWith({
        data: { userId: rawUser.id, roleId: 1 },
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject({
        id: rawUser.id,
        name: rawUser.name,
        email: rawUser.email,
      });
    });

    it('should still return a sanitized user when role assignment fails (non-fatal error)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(rawUser);
      mockPrismaService.role.findFirst.mockRejectedValue(new Error('Role DB unavailable'));

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(rawUser.id);
    });

    it('should throw AppException (VALIDATION / USER_001) when the email is already taken', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: createUserDto.email,
      });

      await expect(service.create(createUserDto)).rejects.toThrow(AppException);

      try {
        await service.create(createUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.code).toBe('USER_001');
        expect(error.message).toContain('already exists');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // findOne
  // ---------------------------------------------------------------------------
  describe('findOne', () => {
    const userId = 'user-1';

    const rawUserWithRoles = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
      roles: [{ id: 1, name: 'user' }],
    };

    it('should return a sanitized user when found by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(rawUserWithRoles);

      const result = await service.findOne(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { roles: true },
      });
      expect(result).not.toHaveProperty('password');
      expect(result).toMatchObject({
        id: userId,
        name: rawUserWithRoles.name,
        email: rawUserWithRoles.email,
      });
    });

    it('should throw AppException (NOT_FOUND / USER_002) when the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(AppException);

      try {
        await service.findOne(userId);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('USER_002');
        expect(error.message).toContain('not found');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // update
  // ---------------------------------------------------------------------------
  describe('update', () => {
    const userId = 'user-1';

    const existingUser = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    };

    const updateUserDto: UpdateUserDto = {
      name: 'John Updated',
      email: 'john.updated@example.com',
    };

    const updatedRawUser = {
      id: userId,
      name: 'John Updated',
      email: 'john.updated@example.com',
      password: 'hashed_password',
      roles: [{ id: 1, name: 'user' }],
    };

    it('should update the user and return a sanitized user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedRawUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: userId } }),
      );
      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe('John Updated');
    });

    it('should hash the new password when one is supplied in the update DTO', async () => {
      const dtoWithPassword: UpdateUserDto = { ...updateUserDto, password: 'newpassword1' };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedRawUser);

      await service.update(userId, dtoWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword1', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ password: 'hashed_password' }),
        }),
      );
    });

    it('should not hash a password when none is supplied in the update DTO', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedRawUser);

      await service.update(userId, updateUserDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it('should throw AppException (NOT_FOUND / USER_003) when the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(AppException);

      try {
        await service.update(userId, updateUserDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('USER_003');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // remove
  // ---------------------------------------------------------------------------
  describe('remove', () => {
    const userId = 'user-1';

    const existingUser = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    };

    it('should delete the user when found and resolve without a value', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.delete.mockResolvedValue(existingUser);

      await expect(service.remove(userId)).resolves.toBeUndefined();

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw AppException (NOT_FOUND / USER_004) when the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(AppException);

      try {
        await service.remove(userId);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.code).toBe('USER_004');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // validateCredentials
  // ---------------------------------------------------------------------------
  describe('validateCredentials', () => {
    const email = 'john@example.com';
    const password = 'secret123';

    const rawUserWithRoles = {
      id: 'user-1',
      name: 'John Doe',
      email,
      password: 'hashed_password',
      roles: [{ id: 1, name: 'user' }],
    };

    it('should return a sanitized user when the email and password are both valid', async () => {
      mockPrismaService.user.update.mockResolvedValue(rawUserWithRoles);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateCredentials(email, password);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email } }),
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(password, rawUserWithRoles.password);
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(email);
    });

    it('should throw AppException (VALIDATION / USER_007) when the password does not match', async () => {
      mockPrismaService.user.update.mockResolvedValue(rawUserWithRoles);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateCredentials(email, password)).rejects.toThrow(AppException);

      try {
        await service.validateCredentials(email, password);
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.code).toBe('USER_007');
        expect(error.message).toContain('Invalid email or password');
      }
    });

    it('should propagate an error when prisma.user.update throws (user email not found)', async () => {
      // Prisma throws a P2025 error when the record targeted for update does not exist
      mockPrismaService.user.update.mockRejectedValue(
        new Error('Record to update not found.'),
      );

      await expect(service.validateCredentials(email, password)).rejects.toThrow();

      // bcrypt.compare must not be called when the user lookup itself fails
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // sanitizeUser — tested indirectly through public methods
  // ---------------------------------------------------------------------------
  describe('sanitizeUser (verified indirectly via findOne)', () => {
    it('should strip the password field from every returned user object', async () => {
      const rawUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'super_secret_hash',
        roles: [],
      };
      mockPrismaService.user.findUnique.mockResolvedValue(rawUser);

      const result = await service.findOne('user-1');

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('john@example.com');
      expect(result.roles).toEqual([]);
    });
  });
});
