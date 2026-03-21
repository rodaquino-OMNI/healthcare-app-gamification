import { Test, TestingModule } from '@nestjs/testing';

import { BiometricController } from './biometric.controller';
import { BiometricService } from './biometric.service';

describe('BiometricController', () => {
    let controller: BiometricController;
    let service: BiometricService;

    const mockBiometricService = {
        registerDevice: jest.fn(),
        generateChallenge: jest.fn(),
        verifySignature: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [BiometricController],
            providers: [
                {
                    provide: BiometricService,
                    useValue: mockBiometricService,
                },
            ],
        }).compile();

        controller = module.get<BiometricController>(BiometricController);
        service = module.get<BiometricService>(BiometricService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        const registerDto = {
            userId: 'user-123',
            publicKey: 'mock-public-key-pem',
            deviceId: 'device-abc',
            platform: 'ios',
        };

        it('should register a biometric device and return deviceKeyId', async () => {
            const mockResult = { success: true, deviceKeyId: 'dk-456' };
            mockBiometricService.registerDevice.mockResolvedValue(mockResult);

            const result = await controller.register(registerDto);

            expect(result).toEqual(mockResult);
            expect(service.registerDevice).toHaveBeenCalledWith(
                registerDto.userId,
                registerDto.publicKey,
                registerDto.deviceId,
                registerDto.platform
            );
        });

        it('should propagate errors from registerDevice', async () => {
            mockBiometricService.registerDevice.mockRejectedValue(
                new Error('Missing required fields')
            );

            await expect(controller.register(registerDto)).rejects.toThrow(
                'Missing required fields'
            );
        });
    });

    describe('challenge', () => {
        it('should generate a biometric challenge for a user', async () => {
            const mockResult = { challenge: 'random-hex-challenge', expiresIn: 300 };
            mockBiometricService.generateChallenge.mockResolvedValue(mockResult);

            const result = await controller.challenge('user-123');

            expect(result).toEqual(mockResult);
            expect(service.generateChallenge).toHaveBeenCalledWith('user-123');
        });

        it('should propagate errors from generateChallenge', async () => {
            mockBiometricService.generateChallenge.mockRejectedValue(
                new Error('User ID is required')
            );

            await expect(controller.challenge('')).rejects.toThrow('User ID is required');
        });
    });

    describe('verify', () => {
        const verifyDto = {
            userId: 'user-123',
            signature: 'base64-encoded-signature',
            challenge: 'random-hex-challenge',
            deviceKeyId: 'dk-456',
        };

        it('should verify biometric signature and return JWT tokens', async () => {
            const mockResult = {
                access_token: 'jwt-access-token',
                refresh_token: 'jwt-refresh-token',
            };
            mockBiometricService.verifySignature.mockResolvedValue(mockResult);

            const result = await controller.verify(verifyDto);

            expect(result).toEqual(mockResult);
            expect(service.verifySignature).toHaveBeenCalledWith(
                verifyDto.userId,
                verifyDto.signature,
                verifyDto.challenge,
                verifyDto.deviceKeyId
            );
        });

        it('should propagate errors from verifySignature', async () => {
            mockBiometricService.verifySignature.mockRejectedValue(
                new Error('Invalid biometric signature')
            );

            await expect(controller.verify(verifyDto)).rejects.toThrow(
                'Invalid biometric signature'
            );
        });
    });
});
