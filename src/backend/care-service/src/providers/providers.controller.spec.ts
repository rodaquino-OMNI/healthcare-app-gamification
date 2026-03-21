import { Test, TestingModule } from '@nestjs/testing';

import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

describe('ProvidersController', () => {
    let controller: ProvidersController;
    let service: ProvidersService;

    const mockProvidersService = {
        findAll: jest.fn(),
        findById: jest.fn(),
        getTelemedicineProviders: jest.fn(),
        searchBySpecialty: jest.fn(),
        searchByLocation: jest.fn(),
        checkAvailability: jest.fn(),
        getAvailableTimeSlots: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockProvider = {
        id: 'prov-123',
        name: 'Dr. Silva',
        specialty: 'Cardiology',
        location: 'Sao Paulo',
        email: 'dr.silva@example.com',
        phone: '+5511999999999',
        telemedicineAvailable: true,
    };

    const mockUser = { id: 'admin-123' };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProvidersController],
            providers: [
                {
                    provide: ProvidersService,
                    useValue: mockProvidersService,
                },
            ],
        }).compile();

        controller = module.get<ProvidersController>(ProvidersController);
        service = module.get<ProvidersService>(ProvidersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a list of providers', async () => {
            const mockResponse = { providers: [mockProvider], total: 1 };
            mockProvidersService.findAll.mockResolvedValue(mockResponse);

            const searchDto = { specialty: 'Cardiology' };
            const paginationDto = { page: 1, limit: 10 };

            const result = await controller.findAll(searchDto as any, paginationDto as any);

            expect(result).toEqual(mockResponse);
            expect(service.findAll).toHaveBeenCalledWith(searchDto, paginationDto);
        });

        it('should return empty list when no providers match', async () => {
            mockProvidersService.findAll.mockResolvedValue({ providers: [], total: 0 });

            const result = await controller.findAll({} as any, {} as any);

            expect(result).toEqual({ providers: [], total: 0 });
        });
    });

    describe('getTelemedicineProviders', () => {
        it('should return telemedicine providers', async () => {
            const mockResponse = { providers: [mockProvider], total: 1 };
            mockProvidersService.getTelemedicineProviders.mockResolvedValue(mockResponse);

            const paginationDto = { page: 1, limit: 10 };
            const result = await controller.getTelemedicineProviders(paginationDto as any);

            expect(result).toEqual(mockResponse);
            expect(service.getTelemedicineProviders).toHaveBeenCalledWith(paginationDto);
        });
    });

    describe('searchBySpecialty', () => {
        it('should return providers filtered by specialty', async () => {
            const mockResponse = { providers: [mockProvider], total: 1 };
            mockProvidersService.searchBySpecialty.mockResolvedValue(mockResponse);

            const paginationDto = { page: 1, limit: 10 };
            const result = await controller.searchBySpecialty('Cardiology', paginationDto as any);

            expect(result).toEqual(mockResponse);
            expect(service.searchBySpecialty).toHaveBeenCalledWith('Cardiology', paginationDto);
        });
    });

    describe('searchByLocation', () => {
        it('should return providers filtered by location', async () => {
            const mockResponse = { providers: [mockProvider], total: 1 };
            mockProvidersService.searchByLocation.mockResolvedValue(mockResponse);

            const paginationDto = { page: 1, limit: 10 };
            const result = await controller.searchByLocation('Sao Paulo', paginationDto as any);

            expect(result).toEqual(mockResponse);
            expect(service.searchByLocation).toHaveBeenCalledWith('Sao Paulo', paginationDto);
        });
    });

    describe('findById', () => {
        it('should return a single provider', async () => {
            mockProvidersService.findById.mockResolvedValue(mockProvider);

            const result = await controller.findById('prov-123');

            expect(result).toEqual(mockProvider);
            expect(service.findById).toHaveBeenCalledWith('prov-123');
        });

        it('should propagate not found errors', async () => {
            mockProvidersService.findById.mockRejectedValue(new Error('Provider not found'));

            await expect(controller.findById('nonexistent')).rejects.toThrow('Provider not found');
        });
    });

    describe('checkAvailability', () => {
        it('should return available when provider is free', async () => {
            mockProvidersService.checkAvailability.mockResolvedValue(true);

            const result = await controller.checkAvailability(
                'prov-123',
                '2025-06-15T10:00:00.000Z'
            );

            expect(result).toEqual({ available: true });
        });

        it('should return unavailable when provider is booked', async () => {
            mockProvidersService.checkAvailability.mockResolvedValue(false);

            const result = await controller.checkAvailability(
                'prov-123',
                '2025-06-15T10:00:00.000Z'
            );

            expect(result).toEqual({ available: false });
        });

        it('should throw on invalid date format', async () => {
            await expect(controller.checkAvailability('prov-123', 'not-a-date')).rejects.toThrow(
                'Invalid date format'
            );
        });
    });

    describe('getAvailableTimeSlots', () => {
        it('should return time slots for a provider on a given date', async () => {
            const mockSlots = [
                { time: '09:00', available: true },
                { time: '10:00', available: false },
                { time: '11:00', available: true },
            ];
            mockProvidersService.getAvailableTimeSlots.mockResolvedValue(mockSlots);

            const result = await controller.getAvailableTimeSlots(
                'prov-123',
                '2025-06-15T00:00:00.000Z'
            );

            expect(result).toEqual({ timeSlots: mockSlots });
        });

        it('should throw on invalid date format', async () => {
            await expect(controller.getAvailableTimeSlots('prov-123', 'invalid')).rejects.toThrow(
                'Invalid date format'
            );
        });
    });

    describe('create', () => {
        it('should create a new provider and return it', async () => {
            mockProvidersService.create.mockResolvedValue(mockProvider);

            const result = await controller.create(mockProvider as any, mockUser);

            expect(result).toEqual(mockProvider);
            expect(service.create).toHaveBeenCalledWith(mockProvider);
        });

        it('should propagate validation errors', async () => {
            mockProvidersService.create.mockRejectedValue(new Error('Provider name is required'));

            await expect(controller.create({} as any, mockUser)).rejects.toThrow(
                'Provider name is required'
            );
        });
    });

    describe('update', () => {
        it('should update a provider and return it', async () => {
            const updatedProvider = { ...mockProvider, name: 'Dr. Santos' };
            mockProvidersService.update.mockResolvedValue(updatedProvider);

            const result = await controller.update('prov-123', updatedProvider as any, mockUser);

            expect(result).toEqual(updatedProvider);
            expect(service.update).toHaveBeenCalledWith('prov-123', updatedProvider);
        });

        it('should propagate not found errors', async () => {
            mockProvidersService.update.mockRejectedValue(new Error('Provider not found'));

            await expect(
                controller.update('nonexistent', mockProvider as any, mockUser)
            ).rejects.toThrow('Provider not found');
        });
    });

    describe('delete', () => {
        it('should delete a provider and return success', async () => {
            mockProvidersService.delete.mockResolvedValue(true);

            const result = await controller.delete('prov-123', mockUser);

            expect(result).toEqual({ success: true });
            expect(service.delete).toHaveBeenCalledWith('prov-123');
        });

        it('should propagate errors when provider has active appointments', async () => {
            mockProvidersService.delete.mockRejectedValue(
                new Error('Cannot delete provider with active appointments')
            );

            await expect(controller.delete('prov-123', mockUser)).rejects.toThrow(
                'Cannot delete provider with active appointments'
            );
        });
    });
});
