/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

describe('DevicesController', () => {
  let controller: DevicesController;

  const mockDevicesService = {
    connectDevice: jest.fn(),
    getDevices: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [
        {
          provide: DevicesService,
          useValue: mockDevicesService,
        },
      ],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('connectDevice', () => {
    const recordId = 'record-test-123';
    const connectDeviceDto = { deviceType: 'GOOGLE_FIT', authToken: 'mock-token' } as any;

    const mockConnection = {
      id: 'conn-test-123',
      recordId,
      deviceType: 'GOOGLE_FIT',
      status: 'CONNECTED',
    };

    it('should call devicesService.connectDevice and return result', async () => {
      mockDevicesService.connectDevice.mockResolvedValue(mockConnection);

      const result = await controller.connectDevice(recordId, connectDeviceDto);

      expect(mockDevicesService.connectDevice).toHaveBeenCalledWith(recordId, connectDeviceDto);
      expect(result).toEqual(mockConnection);
    });

    it('should propagate errors from devicesService.connectDevice', async () => {
      mockDevicesService.connectDevice.mockRejectedValue(new Error('Connection failed'));

      await expect(
        controller.connectDevice(recordId, connectDeviceDto),
      ).rejects.toThrow('Connection failed');
    });
  });

  describe('getDevices', () => {
    const recordId = 'record-test-123';

    const mockDevices = [
      { id: 'conn-1', deviceType: 'GOOGLE_FIT', status: 'CONNECTED' },
      { id: 'conn-2', deviceType: 'HEALTH_KIT', status: 'CONNECTED' },
    ];

    it('should call devicesService.getDevices and return result', async () => {
      mockDevicesService.getDevices.mockResolvedValue(mockDevices);

      const result = await controller.getDevices(recordId, {});

      expect(mockDevicesService.getDevices).toHaveBeenCalledWith(recordId, {});
      expect(result).toEqual(mockDevices);
    });

    it('should return empty array when no devices exist', async () => {
      mockDevicesService.getDevices.mockResolvedValue([]);

      const result = await controller.getDevices(recordId, {});

      expect(result).toEqual([]);
    });

    it('should forward filter query parameters to the service', async () => {
      const filterDto = { where: { status: 'CONNECTED' } } as any;
      mockDevicesService.getDevices.mockResolvedValue(mockDevices);

      await controller.getDevices(recordId, filterDto);

      expect(mockDevicesService.getDevices).toHaveBeenCalledWith(recordId, filterDto);
    });
  });
});
