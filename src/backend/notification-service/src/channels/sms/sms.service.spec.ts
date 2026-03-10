import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SmsService } from './sms.service';
import { LoggerService } from '@app/shared/logging/logger.service';

// Mock the Twilio module
jest.mock('twilio', () => {
    const mockCreate = jest.fn().mockResolvedValue({ sid: 'SM123' });
    return jest.fn().mockImplementation(() => ({
        messages: { create: mockCreate },
    }));
});

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
                    useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
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
            const twilioModule = require('twilio');
            const mockInstance = twilioModule();
            mockInstance.messages.create.mockRejectedValueOnce(new Error('Twilio API error'));

            // Re-create service to use updated mock
            const module = await Test.createTestingModule({
                providers: [
                    SmsService,
                    { provide: ConfigService, useValue: configService },
                    {
                        provide: LoggerService,
                        useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
                    },
                ],
            }).compile();
            const smsService = module.get<SmsService>(SmsService);

            await expect(smsService.sendSms('+15559876543', 'Test message')).rejects.toThrow('Failed to send SMS');
        });

        it('should include error code in thrown error message', async () => {
            const twilioModule = require('twilio');
            const mockInstance = twilioModule();
            mockInstance.messages.create.mockRejectedValueOnce(new Error('Invalid phone'));

            const module = await Test.createTestingModule({
                providers: [
                    SmsService,
                    { provide: ConfigService, useValue: configService },
                    {
                        provide: LoggerService,
                        useValue: { log: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
                    },
                ],
            }).compile();
            const smsService = module.get<SmsService>(SmsService);

            await expect(smsService.sendSms('+15559876543', 'Test message')).rejects.toThrow('SYS_001');
        });
    });
});
