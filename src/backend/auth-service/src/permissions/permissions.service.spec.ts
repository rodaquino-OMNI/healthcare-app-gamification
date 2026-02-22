/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { AppException, ErrorType } from '@app/shared/exceptions/exceptions.types';

describe('PermissionsService', () => {
  let service: PermissionsService;

  const mockPrismaService = {
    permission: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------
  describe('create', () => {
    it('should create and return a new permission', async () => {
      const mockPermission = {
        id: 1,
        name: 'read:users',
        description: 'Permission for read:users',
      };
      mockPrismaService.permission.create.mockResolvedValue(mockPermission);

      const result = await service.create('read:users');

      expect(mockPrismaService.permission.create).toHaveBeenCalledWith({
        data: {
          name: 'read:users',
          description: 'Permission for read:users',
        },
      });
      expect(result).toEqual(mockPermission);
    });

    it('should throw AppException (TECHNICAL / PERM_001) when creation fails', async () => {
      mockPrismaService.permission.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create('read:users')).rejects.toThrow(AppException);

      try {
        await service.create('read:users');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.TECHNICAL);
        expect(error.code).toBe('PERM_001');
      }
    });

    it('should include a description derived from the permission name', async () => {
      const mockPermission = {
        id: 2,
        name: 'write:appointments',
        description: 'Permission for write:appointments',
      };
      mockPrismaService.permission.create.mockResolvedValue(mockPermission);

      await service.create('write:appointments');

      expect(mockPrismaService.permission.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: 'Permission for write:appointments',
          }),
        }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------
  describe('findAll', () => {
    it('should return all permissions ordered by name', async () => {
      const mockPermissions = [
        { id: 1, name: 'delete:users', description: 'Permission for delete:users' },
        { id: 2, name: 'read:users', description: 'Permission for read:users' },
      ];
      mockPrismaService.permission.findMany.mockResolvedValue(mockPermissions);

      const result = await service.findAll();

      expect(mockPrismaService.permission.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockPermissions);
    });

    it('should return an empty array when no permissions exist', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw AppException (TECHNICAL / PERM_002) when retrieval fails', async () => {
      mockPrismaService.permission.findMany.mockRejectedValue(
        new Error('Connection timeout'),
      );

      await expect(service.findAll()).rejects.toThrow(AppException);

      try {
        await service.findAll();
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.TECHNICAL);
        expect(error.code).toBe('PERM_002');
      }
    });
  });

  // -------------------------------------------------------------------------
  // findOne
  // -------------------------------------------------------------------------
  describe('findOne', () => {
    it('should return a permission by numeric ID', async () => {
      const mockPermission = {
        id: 1,
        name: 'read:users',
        description: 'Permission for read:users',
      };
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      const result = await service.findOne('1');

      expect(mockPrismaService.permission.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockPermission);
    });

    it('should return null when permission is not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });

    it('should throw AppException (TECHNICAL / PERM_003) when retrieval fails', async () => {
      mockPrismaService.permission.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findOne('1')).rejects.toThrow(AppException);

      try {
        await service.findOne('1');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.TECHNICAL);
        expect(error.code).toBe('PERM_003');
      }
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------
  describe('update', () => {
    it('should update and return the permission', async () => {
      const updatedPermission = {
        id: 1,
        name: 'read:all-users',
        description: 'Permission for read:all-users',
      };
      mockPrismaService.permission.update.mockResolvedValue(updatedPermission);

      const result = await service.update('1', 'read:all-users');

      expect(mockPrismaService.permission.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'read:all-users',
          description: 'Permission for read:all-users',
        },
      });
      expect(result).toEqual(updatedPermission);
    });

    it('should throw AppException (TECHNICAL / PERM_004) when update fails', async () => {
      mockPrismaService.permission.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.update('999', 'new-name')).rejects.toThrow(AppException);

      try {
        await service.update('999', 'new-name');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.TECHNICAL);
        expect(error.code).toBe('PERM_004');
      }
    });
  });

  // -------------------------------------------------------------------------
  // delete
  // -------------------------------------------------------------------------
  describe('delete', () => {
    it('should delete a permission without returning a value', async () => {
      mockPrismaService.permission.delete.mockResolvedValue({
        id: 1,
        name: 'read:users',
      });

      await expect(service.delete('1')).resolves.toBeUndefined();

      expect(mockPrismaService.permission.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw AppException (TECHNICAL / PERM_005) when deletion fails', async () => {
      mockPrismaService.permission.delete.mockRejectedValue(
        new Error('Foreign key constraint'),
      );

      await expect(service.delete('1')).rejects.toThrow(AppException);

      try {
        await service.delete('1');
      } catch (error: any) {
        expect(error).toBeInstanceOf(AppException);
        expect(error.type).toBe(ErrorType.TECHNICAL);
        expect(error.code).toBe('PERM_005');
      }
    });
  });
});
