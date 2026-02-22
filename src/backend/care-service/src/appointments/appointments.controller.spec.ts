/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  const mockAppointmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockAppointment = {
    id: 'appt-test-123',
    userId: 'user-test-123',
    providerId: 'provider-test-123',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    type: 'IN_PERSON',
    status: 'SCHEDULED',
    reason: 'Annual checkup',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      userId: 'user-test-123',
      providerId: 'provider-test-123',
      dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      type: 'IN_PERSON',
      reason: 'Annual checkup',
    };

    it('should call appointmentsService.create and return result', async () => {
      mockAppointmentsService.create.mockResolvedValue(mockAppointment);

      const result = await controller.create(createDto as any);

      expect(mockAppointmentsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockAppointment);
    });

    it('should propagate errors from appointmentsService.create', async () => {
      mockAppointmentsService.create.mockRejectedValue(new Error('Provider not available'));

      await expect(controller.create(createDto as any)).rejects.toThrow('Provider not available');
    });
  });

  describe('findAll', () => {
    it('should call appointmentsService.findAll and return results', async () => {
      const mockResponse = {
        data: [mockAppointment],
        meta: { currentPage: 1, totalItems: 1, totalPages: 1 },
      };
      mockAppointmentsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll({});

      expect(mockAppointmentsService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResponse);
    });

    it('should forward query parameters to the service', async () => {
      mockAppointmentsService.findAll.mockResolvedValue({ data: [], meta: {} });
      const query = { page: 2, limit: 5, status: 'SCHEDULED' };

      await controller.findAll(query);

      expect(mockAppointmentsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call appointmentsService.findOne with id', async () => {
      mockAppointmentsService.findOne.mockResolvedValue(mockAppointment);

      const result = await controller.findOne('appt-test-123');

      expect(mockAppointmentsService.findOne).toHaveBeenCalledWith('appt-test-123');
      expect(result).toEqual(mockAppointment);
    });

    it('should propagate not found errors', async () => {
      mockAppointmentsService.findOne.mockRejectedValue(new Error('Appointment not found'));

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow('Appointment not found');
    });
  });

  describe('update', () => {
    const updateDto = { notes: 'Updated notes', status: 'CONFIRMED' };

    it('should call appointmentsService.update with id and dto', async () => {
      const updatedAppointment = { ...mockAppointment, ...updateDto };
      mockAppointmentsService.update.mockResolvedValue(updatedAppointment);

      const result = await controller.update('appt-test-123', updateDto as any);

      expect(mockAppointmentsService.update).toHaveBeenCalledWith('appt-test-123', updateDto);
      expect(result).toEqual(updatedAppointment);
    });

    it('should propagate errors from update', async () => {
      mockAppointmentsService.update.mockRejectedValue(
        new Error('Cannot update completed appointment'),
      );

      await expect(
        controller.update('appt-test-123', updateDto as any),
      ).rejects.toThrow('Cannot update completed appointment');
    });
  });

  describe('remove', () => {
    it('should call appointmentsService.remove with id', async () => {
      mockAppointmentsService.remove.mockResolvedValue(undefined);

      await controller.remove('appt-test-123');

      expect(mockAppointmentsService.remove).toHaveBeenCalledWith('appt-test-123');
    });

    it('should propagate errors from remove', async () => {
      mockAppointmentsService.remove.mockRejectedValue(new Error('Appointment not found'));

      await expect(controller.remove('nonexistent-id')).rejects.toThrow('Appointment not found');
    });
  });
});
