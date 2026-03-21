/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */

// ---------------------------------------------------------------------------
// Mock firebase-admin before importing the service under test.
// ---------------------------------------------------------------------------
const mockSend = jest.fn();
const mockMessaging = jest.fn().mockReturnValue({ send: mockSend });
const mockCert = jest.fn().mockReturnValue('mock-credential');
const mockInitializeApp = jest.fn();

jest.mock('firebase-admin', () => ({
    apps: [],
    initializeApp: mockInitializeApp,
    credential: {
        cert: mockCert,
    },
    messaging: mockMessaging,
}));

// Also mock the config import used in push.service.ts
jest.mock('../../config/configuration', () => ({
    notification: {},
}));

import { LoggerService } from '@app/shared/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import admin from 'firebase-admin';

import { PushService } from './push.service';

describe('PushService', () => {
    let service: PushService;

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        setContext: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        // Reset apps array so initializeFirebaseAdmin can run
        (admin.apps as any).length = 0;

        // Default: no API key configured (safe default)
        mockConfigService.get.mockReturnValue(undefined);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PushService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        service = module.get<PushService>(PushService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should log a warning when push API key is not configured', () => {
        expect(mockLoggerService.warn).toHaveBeenCalledWith(
            'Push notification API key not configured',
            'PushService'
        );
    });

    // -------------------------------------------------------------------------
    // send — when firebase is not initialized
    // -------------------------------------------------------------------------
    describe('send (firebase not initialized)', () => {
        it('should return early without error when token is empty', async () => {
            await expect(
                service.send('', { title: 'Test', body: 'Body' })
            ).resolves.toBeUndefined();

            expect(mockSend).not.toHaveBeenCalled();
        });

        it('should log a warning when device token is empty or falsy', async () => {
            await service.send('', { title: 'Test', body: 'Body' });

            expect(mockLoggerService.warn).toHaveBeenCalledWith(
                expect.stringContaining('No device token'),
                'PushService'
            );
        });

        it('should throw an error when firebase is not initialized but a token is provided', async () => {
            await expect(
                service.send('mock-device-token', { title: 'Test', body: 'Body' })
            ).rejects.toThrow('Firebase Cloud Messaging not initialized');
        });
    });

    // -------------------------------------------------------------------------
    // send — when firebase IS initialized
    // -------------------------------------------------------------------------
    describe('send (firebase initialized)', () => {
        beforeEach(async () => {
            jest.clearAllMocks();

            // Provide a valid JSON API key so Firebase gets initialized
            const mockServiceAccount = JSON.stringify({
                type: 'service_account',
                project_id: 'mock-project',
                private_key_id: 'mock-key-id',
                private_key: 'mock-private-key',
                client_email: 'mock@mock.iam.gserviceaccount.com',
            });

            mockConfigService.get.mockReturnValue(mockServiceAccount);

            // Simulate apps being initialized
            (admin.apps as any).length = 0;
            mockInitializeApp.mockImplementation(() => {
                (admin.apps as any).length = 1;
            });

            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    PushService,
                    { provide: ConfigService, useValue: mockConfigService },
                    { provide: LoggerService, useValue: mockLoggerService },
                ],
            }).compile();

            service = module.get<PushService>(PushService);
        });

        it('should call admin.messaging().send with the correct message structure', async () => {
            mockSend.mockResolvedValue('projects/mock/messages/abc123');

            await service.send('mock-device-token', {
                title: 'Appointment Reminder',
                body: 'Your appointment is tomorrow',
                data: { journeyId: 'care' },
            });

            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: 'mock-device-token',
                    notification: {
                        title: 'Appointment Reminder',
                        body: 'Your appointment is tomorrow',
                    },
                    data: { journeyId: 'care' },
                })
            );
        });

        it('should include android config when provided in payload', async () => {
            mockSend.mockResolvedValue('mock-message-id');

            await service.send('mock-token', {
                title: 'Test',
                body: 'Body',
                android: { priority: 'high' },
            });

            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({ android: { priority: 'high' } })
            );
        });

        it('should throw and log when admin.messaging().send fails', async () => {
            mockSend.mockRejectedValue(new Error('FCM delivery failed'));

            await expect(
                service.send('mock-device-token', { title: 'Test', body: 'Body' })
            ).rejects.toThrow('FCM delivery failed');

            expect(mockLoggerService.error).toHaveBeenCalled();
        });

        it('should use an empty data object when payload.data is not provided', async () => {
            mockSend.mockResolvedValue('mock-id');

            await service.send('mock-token', { title: 'Test', body: 'Body' });

            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ data: {} }));
        });
    });
});
