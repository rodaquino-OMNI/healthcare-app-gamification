/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { Test, TestingModule } from '@nestjs/testing';

import { DevicesService } from './devices.service';
import { AppException } from '../../../shared/src/exceptions/exceptions.types';
import { LoggerService } from '../../../shared/src/logging/logger.service';
import { WearablesService } from '../integrations/wearables/wearables.service';

describe('DevicesService', () => {
    let service: DevicesService;

    const mockLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        createLogger: jest.fn().mockReturnThis(),
    };

    const mockWearablesService = {
        connect: jest.fn(),
        connectDevice: jest.fn(),
        getHealthMetrics: jest.fn(),
        disconnectDevice: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DevicesService,
                {
                    provide: LoggerService,
                    useValue: mockLogger,
                },
                {
                    provide: WearablesService,
                    useValue: mockWearablesService,
                },
            ],
        }).compile();

        service = module.get<DevicesService>(DevicesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('connectDevice', () => {
        const recordId = 'record-test-123';
        const connectDeviceDto = {
            deviceType: 'GOOGLE_FIT',
            authToken: 'mock-token',
        };

        const mockDeviceConnection = {
            id: 'conn-test-123',
            recordId,
            deviceType: 'GOOGLE_FIT',
            status: 'CONNECTED',
            lastSync: new Date(),
        };

        it('should connect a device and return a DeviceConnection', async () => {
            (mockWearablesService as any).connect = jest
                .fn()
                .mockResolvedValue(mockDeviceConnection);

            const result = await service.connectDevice(recordId, connectDeviceDto as any);

            expect(result).toEqual(mockDeviceConnection);
        });

        it('should call wearablesService.connect with correct arguments', async () => {
            (mockWearablesService as any).connect = jest
                .fn()
                .mockResolvedValue(mockDeviceConnection);

            await service.connectDevice(recordId, connectDeviceDto as any);

            expect((mockWearablesService as any).connect).toHaveBeenCalledWith(
                recordId,
                expect.any(String)
            );
        });

        it('should convert deviceType to lowercase before connecting', async () => {
            (mockWearablesService as any).connect = jest
                .fn()
                .mockResolvedValue(mockDeviceConnection);

            await service.connectDevice(recordId, { deviceType: 'GOOGLE_FIT' } as any);

            expect((mockWearablesService as any).connect).toHaveBeenCalledWith(
                recordId,
                'google_fit'
            );
        });

        it('should throw AppException when wearablesService.connect fails', async () => {
            (mockWearablesService as any).connect = jest
                .fn()
                .mockRejectedValue(new Error('Connection failed'));

            await expect(service.connectDevice(recordId, connectDeviceDto as any)).rejects.toThrow(
                AppException
            );
        });

        it('should log error when connection fails', async () => {
            (mockWearablesService as any).connect = jest
                .fn()
                .mockRejectedValue(new Error('Network timeout'));

            await expect(
                service.connectDevice(recordId, connectDeviceDto as any)
            ).rejects.toThrow();

            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getDevices', () => {
        const recordId = 'record-test-123';

        it('should return an empty array when no devices are connected', async () => {
            const result = await service.getDevices(recordId);

            expect(result).toEqual([]);
        });

        it('should return devices for the given recordId', async () => {
            const result = await service.getDevices(recordId, {});

            expect(Array.isArray(result)).toBe(true);
        });

        it('should apply filterDto when provided', async () => {
            const filterDto = { where: { status: 'CONNECTED' } } as any;

            const result = await service.getDevices(recordId, filterDto);

            expect(result).toBeDefined();
        });

        it('should log retrieval attempt', async () => {
            await service.getDevices(recordId);

            expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining(recordId));
        });
    });
});
