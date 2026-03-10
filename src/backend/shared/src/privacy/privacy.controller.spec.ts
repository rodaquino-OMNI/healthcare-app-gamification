import { Test, TestingModule } from '@nestjs/testing';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';

describe('PrivacyController', () => {
    let controller: PrivacyController;
    let service: PrivacyService;

    const mockPrivacyService = {
        getMyData: jest.fn(),
        exportAsFhirBundle: jest.fn(),
        deleteMyData: jest.fn(),
        rectifyMyData: jest.fn(),
    };

    const userId = 'user-123';

    const mockUserData = {
        user: {
            id: userId,
            name: 'Maria',
            email: 'maria@example.com',
            phone: '+5511999999999',
            cpf: '12345678900',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        appointments: [],
        medications: [],
        healthMetrics: [],
        healthGoals: [],
        claims: [],
        plans: [],
        deviceConnections: [],
        notifications: [],
        gameProfile: null,
        medicalEvents: [],
        treatmentPlans: [],
        telemedicineSessions: [],
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PrivacyController],
            providers: [
                {
                    provide: PrivacyService,
                    useValue: mockPrivacyService,
                },
            ],
        }).compile();

        controller = module.get<PrivacyController>(PrivacyController);
        service = module.get<PrivacyService>(PrivacyService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getMyData', () => {
        it('should return all personal data for the user', async () => {
            mockPrivacyService.getMyData.mockResolvedValue(mockUserData);

            const result = await controller.getMyData(userId);

            expect(result).toEqual(mockUserData);
            expect(service.getMyData).toHaveBeenCalledWith(userId);
        });

        it('should propagate not found errors', async () => {
            mockPrivacyService.getMyData.mockRejectedValue(new Error('User not found'));

            await expect(controller.getMyData('nonexistent')).rejects.toThrow('User not found');
        });
    });

    describe('exportData', () => {
        it('should return FHIR R4 Bundle for the user', async () => {
            const mockBundle = {
                resourceType: 'Bundle',
                type: 'collection',
                timestamp: new Date().toISOString(),
                total: 1,
                entry: [
                    {
                        fullUrl: `urn:uuid:${userId}`,
                        resource: {
                            resourceType: 'Patient',
                            id: userId,
                            name: [{ use: 'official', text: 'Maria' }],
                        },
                    },
                ],
            };
            mockPrivacyService.exportAsFhirBundle.mockResolvedValue(mockBundle);

            const result = await controller.exportData(userId);

            expect(result).toEqual(mockBundle);
            expect(service.exportAsFhirBundle).toHaveBeenCalledWith(userId);
        });

        it('should propagate errors when user not found', async () => {
            mockPrivacyService.exportAsFhirBundle.mockRejectedValue(new Error('User not found'));

            await expect(controller.exportData('nonexistent')).rejects.toThrow('User not found');
        });
    });

    describe('deleteMyData', () => {
        it('should delete all personal data and return counts', async () => {
            const mockResult = {
                deletedCounts: {
                    user: 1,
                    appointment: 3,
                    medication: 2,
                    healthMetric: 15,
                    notification: 8,
                },
            };
            mockPrivacyService.deleteMyData.mockResolvedValue(mockResult);

            const result = await controller.deleteMyData(userId);

            expect(result).toEqual(mockResult);
            expect(result.deletedCounts).toBeDefined();
            expect(service.deleteMyData).toHaveBeenCalledWith(userId);
        });

        it('should propagate not found errors', async () => {
            mockPrivacyService.deleteMyData.mockRejectedValue(new Error('User not found'));

            await expect(controller.deleteMyData('nonexistent')).rejects.toThrow('User not found');
        });
    });

    describe('rectifyMyData', () => {
        it('should update name and return updated user data', async () => {
            const dto = { name: 'Maria Santos' };
            const updatedUser = { ...mockUserData.user, name: 'Maria Santos' };
            mockPrivacyService.rectifyMyData.mockResolvedValue(updatedUser);

            const result = await controller.rectifyMyData(userId, dto as any);

            expect(result).toEqual(updatedUser);
            expect(service.rectifyMyData).toHaveBeenCalledWith(userId, dto);
        });

        it('should update email and return updated user data', async () => {
            const dto = { email: 'maria.new@example.com' };
            const updatedUser = { ...mockUserData.user, email: 'maria.new@example.com' };
            mockPrivacyService.rectifyMyData.mockResolvedValue(updatedUser);

            const result = await controller.rectifyMyData(userId, dto as any);

            expect(result).toEqual(updatedUser);
        });

        it('should update phone and return updated user data', async () => {
            const dto = { phone: '+5511888888888' };
            const updatedUser = { ...mockUserData.user, phone: '+5511888888888' };
            mockPrivacyService.rectifyMyData.mockResolvedValue(updatedUser);

            const result = await controller.rectifyMyData(userId, dto as any);

            expect(result).toEqual(updatedUser);
        });

        it('should propagate validation errors for duplicate email', async () => {
            const dto = { email: 'taken@example.com' };
            mockPrivacyService.rectifyMyData.mockRejectedValue(new Error('Email already in use by another account'));

            await expect(controller.rectifyMyData(userId, dto as any)).rejects.toThrow(
                'Email already in use by another account'
            );
        });

        it('should propagate validation errors when no fields provided', async () => {
            const dto = {};
            mockPrivacyService.rectifyMyData.mockRejectedValue(
                new Error('At least one field (name, email, phone) must be provided')
            );

            await expect(controller.rectifyMyData(userId, dto as any)).rejects.toThrow(
                'At least one field (name, email, phone) must be provided'
            );
        });
    });
});
