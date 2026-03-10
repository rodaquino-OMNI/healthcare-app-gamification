import { Test, TestingModule } from '@nestjs/testing';
import { IntegrityController } from './integrity.controller';
import { IntegrityService } from './integrity.service';

describe('IntegrityController', () => {
    let controller: IntegrityController;
    let service: IntegrityService;

    const mockIntegrityService = {
        verify: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [IntegrityController],
            providers: [
                {
                    provide: IntegrityService,
                    useValue: mockIntegrityService,
                },
            ],
        }).compile();

        controller = module.get<IntegrityController>(IntegrityController);
        service = module.get<IntegrityService>(IntegrityService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('verify', () => {
        it('should verify an Android integrity token and return result', async () => {
            const dto = {
                token: 'android-attestation-token',
                platform: 'android',
                deviceId: 'device-123',
            };
            const mockVerdict = { verified: true, verdict: 'MEETS_DEVICE_INTEGRITY' };
            mockIntegrityService.verify.mockResolvedValue(mockVerdict);

            const result = await controller.verify(dto);

            expect(result).toEqual({
                verified: true,
                verdict: 'MEETS_DEVICE_INTEGRITY',
            });
            expect(service.verify).toHaveBeenCalledWith(dto.token, dto.platform);
        });

        it('should verify an iOS integrity token and return result', async () => {
            const dto = {
                token: 'ios-attestation-token',
                platform: 'ios',
            };
            const mockVerdict = { verified: true, verdict: 'ATTESTATION_VALID' };
            mockIntegrityService.verify.mockResolvedValue(mockVerdict);

            const result = await controller.verify(dto);

            expect(result).toEqual({
                verified: true,
                verdict: 'ATTESTATION_VALID',
            });
            expect(service.verify).toHaveBeenCalledWith(dto.token, dto.platform);
        });

        it('should return unverified for unsupported platform', async () => {
            const dto = {
                token: 'some-token',
                platform: 'unknown',
            };
            const mockVerdict = { verified: false, verdict: 'UNSUPPORTED_PLATFORM' };
            mockIntegrityService.verify.mockResolvedValue(mockVerdict);

            const result = await controller.verify(dto);

            expect(result).toEqual({
                verified: false,
                verdict: 'UNSUPPORTED_PLATFORM',
            });
        });

        it('should return unverified when API key is not configured', async () => {
            const dto = {
                token: 'android-token',
                platform: 'android',
            };
            const mockVerdict = { verified: false, verdict: 'API_KEY_NOT_CONFIGURED' };
            mockIntegrityService.verify.mockResolvedValue(mockVerdict);

            const result = await controller.verify(dto);

            expect(result).toEqual({
                verified: false,
                verdict: 'API_KEY_NOT_CONFIGURED',
            });
        });

        it('should propagate errors from the integrity service', async () => {
            const dto = {
                token: 'bad-token',
                platform: 'android',
            };
            mockIntegrityService.verify.mockRejectedValue(new Error('Verification failed'));

            await expect(controller.verify(dto)).rejects.toThrow('Verification failed');
        });
    });
});
