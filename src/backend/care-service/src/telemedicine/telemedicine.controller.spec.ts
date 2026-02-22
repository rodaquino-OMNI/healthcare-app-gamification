/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { TelemedicineController } from './telemedicine.controller';
import { TelemedicineService } from './telemedicine.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';

describe('TelemedicineController', () => {
  let controller: TelemedicineController;

  const mockTelemedicineService = {
    startTelemedicineSession: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    setContext: jest.fn(),
  };

  const mockSession = {
    id: 'session-test-123',
    appointmentId: 'appt-test-123',
    patientId: 'user-test-123',
    providerId: 'provider-test-123',
    startTime: new Date(),
    status: 'STARTED',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemedicineController],
      providers: [
        {
          provide: TelemedicineService,
          useValue: mockTelemedicineService,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<TelemedicineController>(TelemedicineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('startTelemedicineSession', () => {
    const createSessionDto = {
      userId: 'user-test-123',
      appointmentId: 'appt-test-123',
      providerId: 'provider-test-123',
    };

    it('should call telemedicineService.startTelemedicineSession and return session', async () => {
      mockTelemedicineService.startTelemedicineSession.mockResolvedValue(mockSession);

      const result = await controller.startTelemedicineSession(createSessionDto as any);

      expect(mockTelemedicineService.startTelemedicineSession).toHaveBeenCalledWith(
        createSessionDto,
      );
      expect(result).toEqual(mockSession);
    });

    it('should log session id after successful creation', async () => {
      mockTelemedicineService.startTelemedicineSession.mockResolvedValue(mockSession);

      await controller.startTelemedicineSession(createSessionDto as any);

      expect(mockLogger.log).toHaveBeenCalledWith(
        expect.stringContaining(mockSession.id),
        'TelemedicineController',
      );
    });

    it('should re-throw AppException from service', async () => {
      const appException = new AppException(
        'Telemedicine disabled',
        'BUSINESS' as any,
        'CARE_TELEMEDICINE_DISABLED',
        {},
      );
      mockTelemedicineService.startTelemedicineSession.mockRejectedValue(appException);

      await expect(
        controller.startTelemedicineSession(createSessionDto as any),
      ).rejects.toThrow(AppException);
    });

    it('should wrap non-AppException errors in AppException', async () => {
      mockTelemedicineService.startTelemedicineSession.mockRejectedValue(
        new Error('Unexpected system error'),
      );

      await expect(
        controller.startTelemedicineSession(createSessionDto as any),
      ).rejects.toThrow(AppException);
    });

    it('should log error when session creation fails', async () => {
      mockTelemedicineService.startTelemedicineSession.mockRejectedValue(
        new Error('Connection failed'),
      );

      await expect(
        controller.startTelemedicineSession(createSessionDto as any),
      ).rejects.toThrow();

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
