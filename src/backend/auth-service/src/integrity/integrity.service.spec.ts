import { LoggerService } from '@app/shared/logging/logger.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { IntegrityService } from './integrity.service';

describe('IntegrityService', () => {
    let service: IntegrityService;
    let httpService: jest.Mocked<HttpService>;
    let configService: { get: jest.Mock };

    beforeEach(async () => {
        httpService = {
            post: jest.fn(),
        } as unknown as jest.Mocked<HttpService>;

        configService = {
            get: jest.fn().mockImplementation((key: string, defaultValue?: unknown) => {
                const config: Record<string, unknown> = {
                    GOOGLE_PLAY_INTEGRITY_API_KEY: '',
                    APPLE_TEAM_ID: '',
                    APPLE_APP_ATTEST_KEY_ID: '',
                    NODE_ENV: 'development',
                };
                return config[key] ?? defaultValue;
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IntegrityService,
                { provide: ConfigService, useValue: configService },
                { provide: HttpService, useValue: httpService },
                {
                    provide: LoggerService,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                        warn: jest.fn(),
                        debug: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<IntegrityService>(IntegrityService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('verify', () => {
        it('should return unsupported platform for unknown platform', async () => {
            const result = await service.verify('token', 'windows');

            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('UNSUPPORTED_PLATFORM');
        });

        it('should route to android verification for android platform', async () => {
            const result = await service.verify('token', 'android');

            // API key not configured, should return early
            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('API_KEY_NOT_CONFIGURED');
        });

        it('should route to ios verification for ios platform', async () => {
            const result = await service.verify('token', 'ios');

            // Credentials not configured, should return early
            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('CREDENTIALS_NOT_CONFIGURED');
        });
    });

    describe('verifyAndroidIntegrity', () => {
        it('should return API_KEY_NOT_CONFIGURED when no API key is set', async () => {
            const result = await service.verifyAndroidIntegrity('test-token');

            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('API_KEY_NOT_CONFIGURED');
        });

        it('should verify successfully with MEETS_DEVICE_INTEGRITY', async () => {
            configService.get.mockImplementation((key: string, defaultValue?: unknown) => {
                if (key === 'GOOGLE_PLAY_INTEGRITY_API_KEY') {
                    return 'test-api-key';
                }
                return defaultValue;
            });

            httpService.post.mockReturnValueOnce(
                of({
                    data: {
                        tokenPayloadExternal: {
                            deviceIntegrity: {
                                deviceRecognitionVerdict: ['MEETS_DEVICE_INTEGRITY'],
                            },
                        },
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {} as any,
                })
            );

            const result = await service.verifyAndroidIntegrity('test-token');

            expect(result.verified).toBe(true);
            expect(result.verdict).toBe('MEETS_DEVICE_INTEGRITY');
        });

        it('should return VERIFICATION_ERROR on API failure', async () => {
            configService.get.mockImplementation((key: string, defaultValue?: unknown) => {
                if (key === 'GOOGLE_PLAY_INTEGRITY_API_KEY') {
                    return 'test-api-key';
                }
                return defaultValue;
            });

            httpService.post.mockReturnValueOnce(throwError(() => new Error('Network error')));

            const result = await service.verifyAndroidIntegrity('test-token');

            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('VERIFICATION_ERROR');
        });

        it('should return INVALID_PAYLOAD when payload is missing', async () => {
            configService.get.mockImplementation((key: string, defaultValue?: unknown) => {
                if (key === 'GOOGLE_PLAY_INTEGRITY_API_KEY') {
                    return 'test-api-key';
                }
                return defaultValue;
            });

            httpService.post.mockReturnValueOnce(
                of({
                    data: {},
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {} as any,
                })
            );

            const result = await service.verifyAndroidIntegrity('test-token');

            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('INVALID_PAYLOAD');
        });
    });

    describe('verifyIosIntegrity', () => {
        it('should return CREDENTIALS_NOT_CONFIGURED when no credentials are set', async () => {
            const result = await service.verifyIosIntegrity('test-token');

            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('CREDENTIALS_NOT_CONFIGURED');
        });

        it('should verify successfully when Apple returns 200', async () => {
            configService.get.mockImplementation((key: string, defaultValue?: unknown) => {
                if (key === 'APPLE_TEAM_ID') {
                    return 'TEAM123';
                }
                if (key === 'APPLE_APP_ATTEST_KEY_ID') {
                    return 'KEY456';
                }
                if (key === 'NODE_ENV') {
                    return 'development';
                }
                return defaultValue;
            });

            httpService.post.mockReturnValueOnce(
                of({
                    data: {},
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {} as any,
                })
            );

            const result = await service.verifyIosIntegrity('test-token');

            expect(result.verified).toBe(true);
            expect(result.verdict).toBe('ATTESTATION_VALID');
        });

        it('should return VERIFICATION_ERROR on API failure', async () => {
            configService.get.mockImplementation((key: string, defaultValue?: unknown) => {
                if (key === 'APPLE_TEAM_ID') {
                    return 'TEAM123';
                }
                if (key === 'APPLE_APP_ATTEST_KEY_ID') {
                    return 'KEY456';
                }
                if (key === 'NODE_ENV') {
                    return 'development';
                }
                return defaultValue;
            });

            httpService.post.mockReturnValueOnce(throwError(() => new Error('Network error')));

            const result = await service.verifyIosIntegrity('test-token');

            expect(result.verified).toBe(false);
            expect(result.verdict).toBe('VERIFICATION_ERROR');
        });
    });
});
