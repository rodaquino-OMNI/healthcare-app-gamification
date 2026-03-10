import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BiometricService } from './biometric.service';
import { PrismaService } from '@app/shared/database/prisma.service';
import { LoggerService } from '@app/shared/logging/logger.service';
import { RedisService } from '@app/shared/redis/redis.service';
import { AppException } from '@app/shared/exceptions/exceptions.types';

describe('BiometricService', () => {
    let service: BiometricService;
    let redisService: jest.Mocked<RedisService>;
    let jwtService: jest.Mocked<JwtService>;
    let prisma: { user: { findUnique: jest.Mock } };
    let configService: { get: jest.Mock };

    beforeEach(async () => {
        redisService = {
            set: jest.fn().mockResolvedValue('OK'),
            get: jest.fn().mockResolvedValue(null),
            del: jest.fn().mockResolvedValue(1),
        } as unknown as jest.Mocked<RedisService>;

        jwtService = {
            sign: jest.fn().mockReturnValue('mock-access-token'),
        } as unknown as jest.Mocked<JwtService>;

        prisma = {
            user: {
                findUnique: jest.fn(),
            },
        };

        configService = {
            get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
                const config: Record<string, unknown> = {
                    'authService.biometric.deviceKeyExpirationDays': 90,
                    'authService.jwt.secret': 'test-secret',
                    'authService.jwt.accessTokenExpiration': '1h',
                    'authService.jwt.refreshTokenExpiration': '7d',
                };
                return config[key] ?? defaultValue;
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BiometricService,
                { provide: JwtService, useValue: jwtService },
                { provide: ConfigService, useValue: configService },
                {
                    provide: LoggerService,
                    useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
                },
                { provide: PrismaService, useValue: prisma },
                { provide: RedisService, useValue: redisService },
            ],
        }).compile();

        service = module.get<BiometricService>(BiometricService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerDevice', () => {
        it('should register a device and return success with deviceKeyId', async () => {
            const result = await service.registerDevice('user-1', 'publicKey', 'device-1', 'ios');

            expect(result.success).toBe(true);
            expect(result.deviceKeyId).toBeDefined();
            expect(typeof result.deviceKeyId).toBe('string');
            expect(redisService.set).toHaveBeenCalledTimes(1);
        });

        it('should throw AppException when required fields are missing', async () => {
            await expect(service.registerDevice('', 'publicKey', 'device-1', 'ios')).rejects.toThrow(AppException);
        });

        it('should throw AppException when redis fails', async () => {
            redisService.set.mockRejectedValueOnce(new Error('Redis connection error'));

            await expect(service.registerDevice('user-1', 'publicKey', 'device-1', 'ios')).rejects.toThrow(
                AppException
            );
        });
    });

    describe('generateChallenge', () => {
        it('should generate a challenge and store it in redis', async () => {
            const result = await service.generateChallenge('user-1');

            expect(result.challenge).toBeDefined();
            expect(typeof result.challenge).toBe('string');
            expect(result.expiresIn).toBe(300);
            expect(redisService.set).toHaveBeenCalledWith('biometric:challenge:user-1', expect.any(String), 300);
        });

        it('should throw AppException when userId is empty', async () => {
            await expect(service.generateChallenge('')).rejects.toThrow(AppException);
        });

        it('should throw AppException when redis fails', async () => {
            redisService.set.mockRejectedValueOnce(new Error('Redis down'));

            await expect(service.generateChallenge('user-1')).rejects.toThrow(AppException);
        });
    });

    describe('verifySignature', () => {
        it('should throw when challenge is expired or not found', async () => {
            redisService.get.mockResolvedValueOnce(null);

            await expect(service.verifySignature('user-1', 'sig', 'challenge', 'device-key-1')).rejects.toThrow(
                AppException
            );
        });

        it('should throw when challenge does not match', async () => {
            redisService.get.mockResolvedValueOnce('different-challenge');

            await expect(service.verifySignature('user-1', 'sig', 'my-challenge', 'device-key-1')).rejects.toThrow(
                AppException
            );
        });

        it('should throw when device key is not found', async () => {
            redisService.get
                .mockResolvedValueOnce('my-challenge') // stored challenge
                .mockResolvedValueOnce(null); // device key not found

            await expect(service.verifySignature('user-1', 'sig', 'my-challenge', 'device-key-1')).rejects.toThrow(
                AppException
            );
        });

        it('should throw when device key does not belong to user', async () => {
            const deviceKey = {
                userId: 'different-user',
                publicKey: 'key',
                deviceId: 'dev-1',
                platform: 'ios',
                createdAt: new Date().toISOString(),
                expiresAt: new Date().toISOString(),
            };

            redisService.get.mockResolvedValueOnce('my-challenge').mockResolvedValueOnce(JSON.stringify(deviceKey));

            await expect(service.verifySignature('user-1', 'sig', 'my-challenge', 'device-key-1')).rejects.toThrow(
                AppException
            );
        });
    });
});
