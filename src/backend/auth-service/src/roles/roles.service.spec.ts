/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';

describe('RolesService', () => {
  let service: RolesService;

  const mockPrismaService = {
    role: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  const mockRole = {
    id: 1,
    name: 'admin',
    description: 'Administrator role',
    permissions: [{ id: 1, name: 'read:users' }],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------
  describe('create', () => {
    it('should create and return a new role', async () => {
      mockPrismaService.role.create.mockResolvedValue(mockRole);

      const createDto = { name: 'admin', description: 'Administrator role' };
      const result = await service.create(createDto);

      expect(mockPrismaService.role.create).toHaveBeenCalledWith({
        data: createDto,
        include: { permissions: true },
      });
      expect(result).toEqual(mockRole);
    });

    it('should include permissions in the created role response', async () => {
      const roleWithPermissions = {
        ...mockRole,
        permissions: [{ id: 1, name: 'read:users' }, { id: 2, name: 'write:users' }],
      };
      mockPrismaService.role.create.mockResolvedValue(roleWithPermissions);

      const result = await service.create({ name: 'editor' });

      expect(result.permissions).toHaveLength(2);
    });

    it('should propagate errors from prisma on creation', async () => {
      mockPrismaService.role.create.mockRejectedValue(new Error('Unique constraint violation'));

      await expect(service.create({ name: 'admin' })).rejects.toThrow('Unique constraint violation');
    });
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------
  describe('findAll', () => {
    it('should return all roles with default include of permissions', async () => {
      const mockRoles = [mockRole];
      mockPrismaService.role.findMany.mockResolvedValue(mockRoles);

      const result = await service.findAll({}, {});

      expect(mockPrismaService.role.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { permissions: true },
        }),
      );
      expect(result).toEqual(mockRoles);
    });

    it('should apply pagination skip and take from paginationDto', async () => {
      mockPrismaService.role.findMany.mockResolvedValue([mockRole]);

      await service.findAll({ skip: 10, limit: 5 } as any, {});

      expect(mockPrismaService.role.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
    });

    it('should apply filter where clause from filterDto', async () => {
      mockPrismaService.role.findMany.mockResolvedValue([]);
      const filterDto = { where: { name: 'admin' } } as any;

      await service.findAll({}, filterDto);

      expect(mockPrismaService.role.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name: 'admin' } }),
      );
    });

    it('should return an empty array when no roles exist', async () => {
      mockPrismaService.role.findMany.mockResolvedValue([]);

      const result = await service.findAll({}, {});

      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // findOne
  // -------------------------------------------------------------------------
  describe('findOne', () => {
    it('should return a role when found by ID', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);

      const result = await service.findOne('1');

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { permissions: true },
      });
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role is not found', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('should parse string ID to integer for the query', async () => {
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);

      await service.findOne('42');

      expect(mockPrismaService.role.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 42 } }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------
  describe('update', () => {
    it('should update and return the modified role', async () => {
      const updatedRole = { ...mockRole, name: 'super-admin' };
      mockPrismaService.role.update.mockResolvedValue(updatedRole);

      const result = await service.update('1', { name: 'super-admin' });

      expect(mockPrismaService.role.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'super-admin' },
        include: { permissions: true },
      });
      expect(result.name).toBe('super-admin');
    });

    it('should propagate errors from prisma on update', async () => {
      mockPrismaService.role.update.mockRejectedValue(new Error('Record not found'));

      await expect(service.update('999', { name: 'x' })).rejects.toThrow('Record not found');
    });
  });

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------
  describe('remove', () => {
    it('should delete a role without returning a value', async () => {
      mockPrismaService.role.delete.mockResolvedValue(mockRole);

      await expect(service.remove('1')).resolves.toBeUndefined();

      expect(mockPrismaService.role.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should parse string ID to integer for the delete query', async () => {
      mockPrismaService.role.delete.mockResolvedValue(mockRole);

      await service.remove('5');

      expect(mockPrismaService.role.delete).toHaveBeenCalledWith({
        where: { id: 5 },
      });
    });

    it('should propagate errors from prisma on deletion', async () => {
      mockPrismaService.role.delete.mockRejectedValue(
        new Error('Foreign key constraint violation'),
      );

      await expect(service.remove('1')).rejects.toThrow('Foreign key constraint violation');
    });
  });
});
