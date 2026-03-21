import { LoggerService } from '@app/shared/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { SmsService } from './sms.service';

// Mock the Twilio module — named export { Twilio }
jest.mock('twilio', () => {
    const mockCreate = jest.fn().mockResolvedValue({ sid: 'SM123' });
    const MockTwilio = jest.fn().mockImplementation(() => ({
        messages: { create: mockCreate },
    }));
    return { __esModule: true, default: MockTwilio, Twilio: MockTwilio };
});

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports -- Jest mocks require dynamic require to access mock state
const { Twilio: twilioFactory } = require('twilio') as { Twilio: jest.Mock };

describe('SmsService', () => {
    let service: SmsService;
    let configService: { get: jest.Mock };

    beforeEach(async () => {
        configService = {
            get: jest.fn().mockImplementation((key: string) => {
                const config: Record<string, string> = {
                    'notification.sms.accountSid': 'AC_TEST_SID',
                    'notification.sms.authToken': 'test-auth-token',
                    'notification.sms.defaultFrom': '+15551234567',
                };
                return config[key];
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SmsService,
                { provide: ConfigService, useValue: configService },
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

        service = module.get<SmsService>(SmsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendSms', () => {
        it('should send an SMS message successfully', async () => {
            await expect(service.sendSms('+15559876543', 'Test message')).resolves.toBeUndefined();
        });

        it('should throw error when Twilio API fails', async () => {
            // Access the mocked twilio client's create method
            const mockInstance = twilioFactory() as { messages: { create: jest.Mock } };
            mockInstance.messages.create.mockRejectedValueOnce(new Error('Twilio API error'));

            // Re-create service to use updated mock
            const module = await Test.createTestingModule({
                providers: [
                    SmsService,
                    { provide: ConfigService, useValue: configService },
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
            const smsService = module.get<SmsService>(SmsService);

            await expect(smsService.sendSms('+15559876543', 'Test message')).rejects.toThrow(
                'Failed to send SMS'
            );
        });

        it('should include error code in thrown error message', async () => {
            const mockInstance = twilioFactory() as { messages: { create: jest.Mock } };
            mockInstance.messages.create.mockRejectedValueOnce(new Error('Invalid phone'));

            const module = await Test.createTestingModule({
                providers: [
                    SmsService,
                    { provide: ConfigService, useValue: configService },
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
            const smsService = module.get<SmsService>(SmsService);

            await expect(smsService.sendSms('+15559876543', 'Test message')).rejects.toThrow(
                'SYS_001'
            );
        });
    });
});
