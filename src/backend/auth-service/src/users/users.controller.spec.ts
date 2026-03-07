/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LoggerService } from '@app/shared/logging/logger.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    roles: [{ name: 'user' }],
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    setContext: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------
  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'mock-password',
    };

    it('should delegate to UsersService.create and return the new user', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should propagate AppException when user already exists', async () => {
      mockUsersService.create.mockRejectedValue(
        new AppException('Email already taken', ErrorType.VALIDATION, 'USER_001'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(AppException);
    });
  });

  // -------------------------------------------------------------------------
  // getMe
  // -------------------------------------------------------------------------
  describe('getMe', () => {
    it('should return the authenticated user as a resolved promise', async () => {
      const result = await controller.getMe(mockUser as any);

      expect(result).toEqual(mockUser);
    });

    it('should return undefined when no current user is set', async () => {
      const result = await controller.getMe(undefined as any);

      expect(result).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------
  describe('findAll', () => {
    it('should return paginated list of users', async () => {
      const paginatedResponse = {
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
      };
      mockUsersService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll(
        { page: 1, limit: 10 } as any,
        {} as any,
      );

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(paginatedResponse);
    });

    it('should pass pagination and filter params to UsersService.findAll', async () => {
      mockUsersService.findAll.mockResolvedValue({ data: [], total: 0 });

      await controller.findAll(
        { page: 2, limit: 5 } as any,
        { email: 'test@example.com' } as any,
      );

      expect(mockUsersService.findAll).toHaveBeenCalledWith(
        { page: 2, limit: 5 },
        { email: 'test@example.com' },
      );
    });

    it('should return empty data when no users match the filter', async () => {
      mockUsersService.findAll.mockResolvedValue({ data: [], total: 0 });

      const result = await controller.findAll({} as any, {} as any);

      expect(result.data).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // findOne
  // -------------------------------------------------------------------------
  describe('findOne', () => {
    it('should return the user with the given ID', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('user-1');

      expect(mockUsersService.findOne).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });

    it('should throw AppException (NOT_FOUND) when user does not exist', async () => {
      mockUsersService.findOne.mockRejectedValue(
        new AppException('User not found', ErrorType.NOT_FOUND, 'USER_002'),
      );

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(AppException);
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------
  describe('update', () => {
    const updateDto: UpdateUserDto = { name: 'Jane Updated' };

    it('should update and return the modified user', async () => {
      const updatedUser = { ...mockUser, name: 'Jane Updated' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('user-1', updateDto);

      expect(mockUsersService.update).toHaveBeenCalledWith('user-1', updateDto);
      expect(result.name).toBe('Jane Updated');
    });

    it('should propagate errors from UsersService.update', async () => {
      mockUsersService.update.mockRejectedValue(
        new AppException('User not found', ErrorType.NOT_FOUND, 'USER_002'),
      );

      await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrow(AppException);
    });
  });

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------
  describe('remove', () => {
    it('should call UsersService.remove with the given ID', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('user-1');

      expect(mockUsersService.remove).toHaveBeenCalledWith('user-1');
    });

    it('should throw AppException when user to delete is not found', async () => {
      mockUsersService.remove.mockRejectedValue(
        new AppException('User not found', ErrorType.NOT_FOUND, 'USER_002'),
      );

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(AppException);
    });
  });
});
