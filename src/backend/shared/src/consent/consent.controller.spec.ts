import { Test, TestingModule } from '@nestjs/testing';
import { ConsentController } from './consent.controller';
import { ConsentService } from './consent.service';
import { ConsentType } from './dto/create-consent.dto';

describe('ConsentController', () => {
    let controller: ConsentController;
    let service: ConsentService;

    const mockConsentService = {
        getUserConsents: jest.fn(),
        createConsent: jest.fn(),
        revokeConsent: jest.fn(),
        hasActiveConsent: jest.fn(),
    };

    const mockConsent = {
        id: 'consent-123',
        userId: 'user-123',
        consentType: ConsentType.HEALTH_DATA_SHARING,
        purpose: 'Share health metrics with treating physician',
        dataCategories: ['health_metrics', 'medical_history'],
        status: 'ACTIVE',
        grantedAt: new Date(),
        expiresAt: null,
        revokedAt: null,
        ipAddress: '127.0.0.1',
        userAgent: 'Test/1.0',
    };

    const mockRequest = {
        user: { id: 'user-123', sub: 'user-123' },
        ip: '127.0.0.1',
        headers: {
            'user-agent': 'Test/1.0',
            'x-forwarded-for': '10.0.0.1',
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConsentController],
            providers: [
                {
                    provide: ConsentService,
                    useValue: mockConsentService,
                },
            ],
        }).compile();

        controller = module.get<ConsentController>(ConsentController);
        service = module.get<ConsentService>(ConsentService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getUserConsents', () => {
        it('should return all consents for the authenticated user', async () => {
            const consents = [mockConsent];
            mockConsentService.getUserConsents.mockResolvedValue(consents);

            const result = await controller.getUserConsents(mockRequest);

            expect(result).toEqual(consents);
            expect(service.getUserConsents).toHaveBeenCalledWith('user-123');
        });

        it('should fall back to sub when id is not present', async () => {
            const req = { user: { sub: 'user-456' } };
            mockConsentService.getUserConsents.mockResolvedValue([]);

            await controller.getUserConsents(req);

            expect(service.getUserConsents).toHaveBeenCalledWith('user-456');
        });

        it('should use empty string when no user info is present', async () => {
            mockConsentService.getUserConsents.mockResolvedValue([]);

            await controller.getUserConsents({});

            expect(service.getUserConsents).toHaveBeenCalledWith('');
        });
    });

    describe('createConsent', () => {
        const createDto = {
            consentType: ConsentType.HEALTH_DATA_SHARING,
            purpose: 'Share health metrics with treating physician',
            dataCategories: ['health_metrics', 'medical_history'],
        };

        it('should create a consent record and return it', async () => {
            mockConsentService.createConsent.mockResolvedValue(mockConsent);

            const result = await controller.createConsent(mockRequest, createDto as any);

            expect(result).toEqual(mockConsent);
            expect(service.createConsent).toHaveBeenCalledWith('user-123', createDto, '127.0.0.1', 'Test/1.0');
        });

        it('should pass x-forwarded-for when ip is not available', async () => {
            const req = {
                user: { id: 'user-123' },
                headers: { 'x-forwarded-for': '10.0.0.1', 'user-agent': 'Browser/2.0' },
            };
            mockConsentService.createConsent.mockResolvedValue(mockConsent);

            await controller.createConsent(req, createDto as any);

            expect(service.createConsent).toHaveBeenCalledWith('user-123', createDto, '10.0.0.1', 'Browser/2.0');
        });

        it('should propagate validation errors', async () => {
            mockConsentService.createConsent.mockRejectedValue(new Error('Invalid consent data'));

            await expect(controller.createConsent(mockRequest, {} as any)).rejects.toThrow('Invalid consent data');
        });
    });

    describe('revokeConsent', () => {
        it('should revoke a consent record', async () => {
            const revokedConsent = { ...mockConsent, status: 'REVOKED', revokedAt: new Date() };
            mockConsentService.revokeConsent.mockResolvedValue(revokedConsent);

            const result = await controller.revokeConsent(mockRequest, 'consent-123');

            expect(result).toEqual(revokedConsent);
            expect(service.revokeConsent).toHaveBeenCalledWith('user-123', 'consent-123');
        });

        it('should propagate not found errors', async () => {
            mockConsentService.revokeConsent.mockRejectedValue(new Error('Consent record not found'));

            await expect(controller.revokeConsent(mockRequest, 'nonexistent')).rejects.toThrow(
                'Consent record not found'
            );
        });

        it('should propagate forbidden errors when revoking another users consent', async () => {
            mockConsentService.revokeConsent.mockRejectedValue(
                new Error('Cannot revoke consent belonging to another user')
            );

            await expect(controller.revokeConsent(mockRequest, 'consent-other')).rejects.toThrow(
                'Cannot revoke consent belonging to another user'
            );
        });
    });

    describe('hasActiveConsent', () => {
        it('should return true when user has active consent', async () => {
            mockConsentService.hasActiveConsent.mockResolvedValue(true);

            const result = await controller.hasActiveConsent(mockRequest, ConsentType.HEALTH_DATA_SHARING);

            expect(result).toEqual({
                consentType: ConsentType.HEALTH_DATA_SHARING,
                hasConsent: true,
            });
            expect(service.hasActiveConsent).toHaveBeenCalledWith('user-123', ConsentType.HEALTH_DATA_SHARING);
        });

        it('should return false when user has no active consent', async () => {
            mockConsentService.hasActiveConsent.mockResolvedValue(false);

            const result = await controller.hasActiveConsent(mockRequest, ConsentType.MARKETING);

            expect(result).toEqual({
                consentType: ConsentType.MARKETING,
                hasConsent: false,
            });
        });
    });
});
