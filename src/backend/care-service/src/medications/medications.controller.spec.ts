import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { LoggerService } from '@app/shared/logging/logger.service';

describe('MedicationsController', () => {
    let controller: MedicationsController;
    let service: MedicationsService;

    const mockMedicationsService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockLogger = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockMedication = {
        id: 'med-123',
        userId: 'user-123',
        name: 'Aspirin',
        dosage: '100mg',
        frequency: 'daily',
        startDate: new Date('2025-01-01'),
        endDate: null,
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MedicationsController],
            providers: [
                {
                    provide: MedicationsService,
                    useValue: mockMedicationsService,
                },
                {
                    provide: LoggerService,
                    useValue: mockLogger,
                },
            ],
        }).compile();

        controller = module.get<MedicationsController>(MedicationsController);
        service = module.get<MedicationsService>(MedicationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        const createDto = {
            name: 'Aspirin',
            dosage: '100mg',
            frequency: 'daily',
            startDate: '2025-01-01',
        };
        const userId = 'user-123';

        it('should create a medication and return it', async () => {
            mockMedicationsService.create.mockResolvedValue(mockMedication);

            const result = await controller.create(createDto as any, userId);

            expect(result).toEqual(mockMedication);
            expect(service.create).toHaveBeenCalledWith(createDto, userId);
        });

        it('should propagate errors from create', async () => {
            mockMedicationsService.create.mockRejectedValue(new Error('Failed to create medication record'));

            await expect(controller.create(createDto as any, userId)).rejects.toThrow(
                'Failed to create medication record'
            );
        });
    });

    describe('findAll', () => {
        const userId = 'user-123';

        it('should return all medications for the user', async () => {
            const medications = [mockMedication];
            mockMedicationsService.findAll.mockResolvedValue(medications);

            const result = await controller.findAll(userId);

            expect(result).toEqual(medications);
            expect(service.findAll).toHaveBeenCalledWith({ where: { userId } }, { limit: 100 });
        });

        it('should return empty array when user has no medications', async () => {
            mockMedicationsService.findAll.mockResolvedValue([]);

            const result = await controller.findAll(userId);

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        const userId = 'user-123';

        it('should return a medication by id', async () => {
            mockMedicationsService.findOne.mockResolvedValue(mockMedication);

            const result = await controller.findOne('med-123', userId);

            expect(result).toEqual(mockMedication);
            expect(service.findOne).toHaveBeenCalledWith('med-123');
        });

        it('should throw when medication belongs to another user', async () => {
            const otherUserMed = { ...mockMedication, userId: 'other-user' };
            mockMedicationsService.findOne.mockResolvedValue(otherUserMed);

            await expect(controller.findOne('med-123', userId)).rejects.toThrow(
                'You do not have permission to access this medication'
            );
        });

        it('should propagate not found errors', async () => {
            mockMedicationsService.findOne.mockRejectedValue(new Error('Medication not found'));

            await expect(controller.findOne('nonexistent', userId)).rejects.toThrow('Medication not found');
        });
    });

    describe('update', () => {
        const userId = 'user-123';
        const updateData = { dosage: '200mg' };

        it('should update a medication and return it', async () => {
            mockMedicationsService.findOne.mockResolvedValue(mockMedication);
            const updatedMed = { ...mockMedication, dosage: '200mg' };
            mockMedicationsService.update.mockResolvedValue(updatedMed);

            const result = await controller.update('med-123', updateData, userId);

            expect(result).toEqual(updatedMed);
            expect(service.update).toHaveBeenCalledWith('med-123', updateData);
        });

        it('should throw when medication belongs to another user', async () => {
            const otherUserMed = { ...mockMedication, userId: 'other-user' };
            mockMedicationsService.findOne.mockResolvedValue(otherUserMed);

            await expect(controller.update('med-123', updateData, userId)).rejects.toThrow(
                'You do not have permission to update this medication'
            );
        });
    });

    describe('remove', () => {
        const userId = 'user-123';

        it('should remove a medication', async () => {
            mockMedicationsService.findOne.mockResolvedValue(mockMedication);
            mockMedicationsService.remove.mockResolvedValue(undefined);

            await controller.remove('med-123', userId);

            expect(service.remove).toHaveBeenCalledWith('med-123');
        });

        it('should throw when medication belongs to another user', async () => {
            const otherUserMed = { ...mockMedication, userId: 'other-user' };
            mockMedicationsService.findOne.mockResolvedValue(otherUserMed);

            await expect(controller.remove('med-123', userId)).rejects.toThrow(
                'You do not have permission to delete this medication'
            );
        });

        it('should propagate not found errors', async () => {
            mockMedicationsService.findOne.mockRejectedValue(new Error('Medication not found'));

            await expect(controller.remove('nonexistent', userId)).rejects.toThrow('Medication not found');
        });
    });
});
