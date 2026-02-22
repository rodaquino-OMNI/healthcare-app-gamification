/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppException } from '../../../shared/src/exceptions/exceptions.types';
import { ProvidersService } from './providers.service';

/**
 * Unit tests for ProvidersService.
 *
 * Uses direct instantiation to avoid NestJS DI token resolution issues.
 */
describe('ProvidersService', () => {
  let service: ProvidersService;

  const mockProvider = {
    id: 'provider-test-123',
    name: 'Dr. Maria Silva',
    specialty: 'Cardiology',
    location: 'São Paulo, SP',
    email: 'maria.silva@hospital.com',
    phone: '+5511999990000',
    telemedicineAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrisma = {
    provider: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    appointment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProvidersService(mockPrisma as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ----------------------------------------------------------------
  // findAll
  // ----------------------------------------------------------------
  describe('findAll', () => {
    const searchDto = { specialty: 'Cardiology' };
    const paginationDto = { page: 1, limit: 10 };

    it('should return a list of providers and total count', async () => {
      const providers = [mockProvider];
      mockPrisma.provider.findMany.mockResolvedValue(providers);
      mockPrisma.provider.count.mockResolvedValue(1);

      const result = await service.findAll(searchDto as any, paginationDto);

      expect(result).toEqual({ providers, total: 1 });
    });

    it('should filter by specialty using case-insensitive contains', async () => {
      mockPrisma.provider.findMany.mockResolvedValue([mockProvider]);
      mockPrisma.provider.count.mockResolvedValue(1);

      await service.findAll({ specialty: 'cardiology' } as any, paginationDto);

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            specialty: { contains: 'cardiology', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by location when provided', async () => {
      mockPrisma.provider.findMany.mockResolvedValue([]);
      mockPrisma.provider.count.mockResolvedValue(0);

      await service.findAll({ location: 'São Paulo' } as any, paginationDto);

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            location: { contains: 'São Paulo', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should apply correct pagination skip/take', async () => {
      mockPrisma.provider.findMany.mockResolvedValue([]);
      mockPrisma.provider.count.mockResolvedValue(0);

      await service.findAll({} as any, { page: 3, limit: 5 });

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 5 }),
      );
    });

    it('should throw AppException when query fails', async () => {
      mockPrisma.provider.findMany.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll({} as any, paginationDto)).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // findById
  // ----------------------------------------------------------------
  describe('findById', () => {
    it('should return provider when found', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);

      const result = await service.findById('provider-test-123');

      expect(mockPrisma.provider.findUnique).toHaveBeenCalledWith({
        where: { id: 'provider-test-123' },
      });
      expect(result).toEqual(mockProvider);
    });

    it('should throw AppException when provider is not found', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id')).rejects.toThrow(AppException);
    });

    it('should throw AppException when database query fails', async () => {
      mockPrisma.provider.findUnique.mockRejectedValue(new Error('Connection error'));

      await expect(service.findById('provider-test-123')).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // create
  // ----------------------------------------------------------------
  describe('create', () => {
    const providerData = {
      name: 'Dr. João Santos',
      specialty: 'Neurology',
      location: 'Rio de Janeiro, RJ',
      email: 'joao.santos@clinic.com',
      phone: '+5521999990000',
      telemedicineAvailable: false,
    };

    it('should create and return a new provider', async () => {
      const createdProvider = { id: 'provider-new-123', ...providerData };
      mockPrisma.provider.create.mockResolvedValue(createdProvider);

      const result = await service.create(providerData as any);

      expect(mockPrisma.provider.create).toHaveBeenCalledWith({ data: providerData });
      expect(result).toEqual(createdProvider);
    });

    it('should throw AppException when name is missing', async () => {
      const invalidData = { ...providerData, name: undefined };

      await expect(service.create(invalidData as any)).rejects.toThrow(AppException);
      expect(mockPrisma.provider.create).not.toHaveBeenCalled();
    });

    it('should throw AppException when specialty is missing', async () => {
      const invalidData = { ...providerData, specialty: undefined };

      await expect(service.create(invalidData as any)).rejects.toThrow(AppException);
    });

    it('should throw AppException when email format is invalid', async () => {
      const invalidData = { ...providerData, email: 'not-an-email' };

      await expect(service.create(invalidData as any)).rejects.toThrow(AppException);
    });

    it('should throw AppException when database creation fails', async () => {
      mockPrisma.provider.create.mockRejectedValue(new Error('Unique constraint violation'));

      await expect(service.create(providerData as any)).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // update
  // ----------------------------------------------------------------
  describe('update', () => {
    it('should update and return the modified provider', async () => {
      const updatedProvider = { ...mockProvider, specialty: 'Cardiology + Electrophysiology' };
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.provider.update.mockResolvedValue(updatedProvider);

      const result = await service.update('provider-test-123', {
        specialty: 'Cardiology + Electrophysiology',
      });

      expect(mockPrisma.provider.update).toHaveBeenCalledWith({
        where: { id: 'provider-test-123' },
        data: { specialty: 'Cardiology + Electrophysiology' },
      });
      expect(result.specialty).toBe('Cardiology + Electrophysiology');
    });

    it('should throw AppException when provider does not exist', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', { name: 'New Name' }),
      ).rejects.toThrow(AppException);
    });

    it('should throw AppException when update query fails', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.provider.update.mockRejectedValue(new Error('Update failed'));

      await expect(
        service.update('provider-test-123', { name: 'New Name' }),
      ).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // delete
  // ----------------------------------------------------------------
  describe('delete', () => {
    it('should delete provider and return true when no active appointments', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.appointment.count.mockResolvedValue(0);
      mockPrisma.provider.delete.mockResolvedValue(mockProvider);

      const result = await service.delete('provider-test-123');

      expect(result).toBe(true);
      expect(mockPrisma.provider.delete).toHaveBeenCalledWith({
        where: { id: 'provider-test-123' },
      });
    });

    it('should throw AppException when provider has active appointments', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.appointment.count.mockResolvedValue(3);

      await expect(service.delete('provider-test-123')).rejects.toThrow(AppException);
      expect(mockPrisma.provider.delete).not.toHaveBeenCalled();
    });

    it('should throw AppException when provider does not exist', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.delete('nonexistent-id')).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // checkAvailability
  // ----------------------------------------------------------------
  describe('checkAvailability', () => {
    const providerId = 'provider-test-123';
    const dateTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    it('should return true when no conflicting appointments exist', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.appointment.findFirst.mockResolvedValue(null);

      const result = await service.checkAvailability(providerId, dateTime);

      expect(result).toBe(true);
    });

    it('should return false when a conflicting appointment exists', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.appointment.findFirst.mockResolvedValue({
        id: 'existing-appt',
        providerId,
        dateTime,
        status: 'SCHEDULED',
      });

      const result = await service.checkAvailability(providerId, dateTime);

      expect(result).toBe(false);
    });

    it('should throw AppException when provider does not exist', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(service.checkAvailability('nonexistent', dateTime)).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // getAvailableTimeSlots
  // ----------------------------------------------------------------
  describe('getAvailableTimeSlots', () => {
    const providerId = 'provider-test-123';
    const date = new Date('2024-06-15');

    it('should return time slots from 9AM to 5PM', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.appointment.findMany.mockResolvedValue([]);

      const result = await service.getAvailableTimeSlots(providerId, date);

      expect(result).toHaveLength(8); // 9AM to 5PM = 8 slots
      expect(result[0]).toHaveProperty('time');
      expect(result[0]).toHaveProperty('available');
    });

    it('should mark slot as unavailable when appointment exists at that time', async () => {
      const slotDate = new Date('2024-06-15');
      slotDate.setHours(10, 0, 0, 0);

      mockPrisma.provider.findUnique.mockResolvedValue(mockProvider);
      mockPrisma.appointment.findMany.mockResolvedValue([
        { id: 'booked-appt', dateTime: slotDate, status: 'SCHEDULED' },
      ]);

      const result = await service.getAvailableTimeSlots(providerId, new Date('2024-06-15'));

      const slot10am = result.find((_slot, index) => index === 1); // index 1 = 10AM slot
      expect(slot10am?.available).toBe(false);
    });

    it('should throw AppException when provider does not exist', async () => {
      mockPrisma.provider.findUnique.mockResolvedValue(null);

      await expect(
        service.getAvailableTimeSlots('nonexistent', date),
      ).rejects.toThrow(AppException);
    });
  });

  // ----------------------------------------------------------------
  // getTelemedicineProviders
  // ----------------------------------------------------------------
  describe('getTelemedicineProviders', () => {
    it('should return only providers with telemedicineAvailable true', async () => {
      const teleProviders = [mockProvider];
      mockPrisma.provider.findMany.mockResolvedValue(teleProviders);
      mockPrisma.provider.count.mockResolvedValue(1);

      const result = await service.getTelemedicineProviders({ page: 1, limit: 10 });

      expect(mockPrisma.provider.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { telemedicineAvailable: true },
        }),
      );
      expect(result).toEqual({ providers: teleProviders, total: 1 });
    });

    it('should throw AppException when query fails', async () => {
      mockPrisma.provider.findMany.mockRejectedValue(new Error('DB error'));

      await expect(
        service.getTelemedicineProviders({ page: 1, limit: 10 }),
      ).rejects.toThrow(AppException);
    });
  });
});
