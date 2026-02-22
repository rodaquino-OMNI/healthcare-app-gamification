/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { WearablesService } from './wearables.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';

describe('WearablesService', () => {
  let service: WearablesService;

  const mockPrismaService = {
    deviceConnection: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    setContext: jest.fn(),
    createLogger: jest.fn().mockReturnThis(),
  };

  const mockGoogleFitAdapter = {
    connect: jest.fn(),
    getHealthMetrics: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockHealthKitAdapter = {
    connect: jest.fn(),
    getHealthMetrics: jest.fn(),
    disconnect: jest.fn(),
  };

  const mockConfigService = {
    wearables: {
      googleFit: { enabled: true },
      healthKit: { enabled: true },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WearablesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: 'GoogleFitAdapter',
          useValue: mockGoogleFitAdapter,
        },
        {
          provide: 'HealthKitAdapter',
          useValue: mockHealthKitAdapter,
        },
        {
          provide: 'Configuration',
          useValue: mockConfigService,
        },
      ],
    })
      .overrideProvider('GoogleFitAdapter')
      .useValue(mockGoogleFitAdapter)
      .overrideProvider('HealthKitAdapter')
      .useValue(mockHealthKitAdapter)
      .overrideProvider('Configuration')
      .useValue(mockConfigService)
      .compile();

    service = module.get<WearablesService>(WearablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connectDevice', () => {
    const userId = 'user-test-123';
    const recordId = 'record-test-123';
    const authToken = 'mock-token';
    const refreshToken = 'mock-refresh-token';

    const mockPersistedConnection = {
      id: 'conn-test-123',
      recordId,
      userId,
      deviceType: 'GOOGLE_FIT',
      status: 'CONNECTED',
      lastSyncedAt: new Date(),
    };

    it('should connect a GOOGLE_FIT device and persist to database', async () => {
      const mockAdapterResult = {
        status: 'CONNECTED',
        connectionData: { token: 'mock-access-token' },
        lastSync: new Date(),
      };
      mockGoogleFitAdapter.connect.mockResolvedValue(mockAdapterResult);
      (mockPrismaService as any).deviceConnection.create.mockResolvedValue(mockPersistedConnection);

      const result = await service.connectDevice(userId, recordId, 'GOOGLE_FIT', authToken, refreshToken);

      expect(result).toEqual(mockPersistedConnection);
    });

    it('should connect a HEALTH_KIT device and persist to database', async () => {
      const mockAdapterResult = {
        status: 'CONNECTED',
        connectionData: { token: 'mock-apple-token' },
        lastSync: new Date(),
      };
      const mockConnection = { ...mockPersistedConnection, deviceType: 'HEALTH_KIT' };
      mockHealthKitAdapter.connect.mockResolvedValue(mockAdapterResult);
      (mockPrismaService as any).deviceConnection.create.mockResolvedValue(mockConnection);

      const result = await service.connectDevice(userId, recordId, 'HEALTH_KIT', authToken);

      expect(result).toEqual(mockConnection);
    });

    it('should throw error when unsupported deviceType is provided', async () => {
      await expect(
        service.connectDevice(userId, recordId, 'UNSUPPORTED_DEVICE', authToken),
      ).rejects.toThrow();
    });

    it('should persist connection with correct data structure', async () => {
      const mockAdapterResult = { status: 'CONNECTED', connectionData: {}, lastSync: new Date() };
      mockGoogleFitAdapter.connect.mockResolvedValue(mockAdapterResult);
      (mockPrismaService as any).deviceConnection.create.mockResolvedValue(mockPersistedConnection);

      await service.connectDevice(userId, recordId, 'GOOGLE_FIT', authToken);

      expect((mockPrismaService as any).deviceConnection.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          recordId,
          userId,
          deviceType: 'GOOGLE_FIT',
        }),
      });
    });
  });

  describe('getHealthMetrics', () => {
    const userId = 'user-test-123';
    const recordId = 'record-test-123';
    const startTime = new Date('2024-01-01');
    const endTime = new Date('2024-01-31');

    const mockConnection = {
      id: 'conn-test-123',
      recordId,
      userId,
      deviceType: 'GOOGLE_FIT',
      status: 'CONNECTED',
    };

    it('should return health metrics when device is connected', async () => {
      const mockMetrics = [
        { type: 'HEART_RATE', value: 72, unit: 'bpm', timestamp: new Date() },
      ];
      (mockPrismaService as any).deviceConnection.findFirst.mockResolvedValue(mockConnection);
      mockGoogleFitAdapter.getHealthMetrics.mockResolvedValue(mockMetrics);
      (mockPrismaService as any).deviceConnection.update.mockResolvedValue(mockConnection);

      const result = await service.getHealthMetrics(
        userId, recordId, 'GOOGLE_FIT', startTime, endTime,
      );

      expect(result).toEqual(mockMetrics);
    });

    it('should throw error when no active connection found', async () => {
      (mockPrismaService as any).deviceConnection.findFirst.mockResolvedValue(null);

      await expect(
        service.getHealthMetrics(userId, recordId, 'GOOGLE_FIT', startTime, endTime),
      ).rejects.toThrow();
    });

    it('should update lastSyncedAt after successful sync', async () => {
      const mockMetrics = [];
      (mockPrismaService as any).deviceConnection.findFirst.mockResolvedValue(mockConnection);
      mockGoogleFitAdapter.getHealthMetrics.mockResolvedValue(mockMetrics);
      (mockPrismaService as any).deviceConnection.update.mockResolvedValue(mockConnection);

      await service.getHealthMetrics(userId, recordId, 'GOOGLE_FIT', startTime, endTime);

      expect((mockPrismaService as any).deviceConnection.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockConnection.id },
          data: { lastSyncedAt: expect.any(Date) },
        }),
      );
    });

    it('should throw error for unsupported deviceType', async () => {
      await expect(
        service.getHealthMetrics(userId, recordId, 'UNSUPPORTED', startTime, endTime),
      ).rejects.toThrow();
    });
  });

  describe('disconnectDevice', () => {
    const userId = 'user-test-123';
    const recordId = 'record-test-123';

    const mockConnection = {
      id: 'conn-test-123',
      recordId,
      userId,
      deviceType: 'GOOGLE_FIT',
      status: 'CONNECTED',
    };

    it('should disconnect device and update status to DISCONNECTED', async () => {
      (mockPrismaService as any).deviceConnection.findFirst.mockResolvedValue(mockConnection);
      mockGoogleFitAdapter.disconnect.mockResolvedValue(true);
      (mockPrismaService as any).deviceConnection.update.mockResolvedValue({
        ...mockConnection, status: 'DISCONNECTED',
      });

      const result = await service.disconnectDevice(userId, recordId, 'GOOGLE_FIT');

      expect(result).toBe(true);
      expect((mockPrismaService as any).deviceConnection.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockConnection.id },
          data: { status: 'DISCONNECTED' },
        }),
      );
    });

    it('should return false when no active connection found', async () => {
      (mockPrismaService as any).deviceConnection.findFirst.mockResolvedValue(null);

      const result = await service.disconnectDevice(userId, recordId, 'GOOGLE_FIT');

      expect(result).toBe(false);
    });

    it('should throw error for unsupported deviceType', async () => {
      await expect(
        service.disconnectDevice(userId, recordId, 'UNSUPPORTED_DEVICE'),
      ).rejects.toThrow();
    });
  });
});
