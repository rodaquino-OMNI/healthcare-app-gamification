/* eslint-disable @typescript-eslint/no-explicit-any -- Test mocks require flexible typing */
import { LoggerService } from '@app/shared/logging/logger.service';
import { Test, TestingModule } from '@nestjs/testing';

import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

describe('PreferencesController', () => {
    let controller: PreferencesController;

    const mockPreferencesService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };

    const mockLoggerService = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    };

    const mockPreference = {
        id: 1,
        userId: 'user-1',
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        inAppEnabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PreferencesController],
            providers: [
                { provide: PreferencesService, useValue: mockPreferencesService },
                { provide: LoggerService, useValue: mockLoggerService },
            ],
        }).compile();

        controller = module.get<PreferencesController>(PreferencesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // -------------------------------------------------------------------------
    // getPreferences
    // -------------------------------------------------------------------------
    describe('getPreferences', () => {
        it('should return preferences filtered by the authenticated user ID', async () => {
            mockPreferencesService.findAll.mockResolvedValue([mockPreference]);

            const result = await controller.getPreferences({} as any, {} as any, 'user-1');

            expect(mockPreferencesService.findAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ userId: 'user-1' }),
                }),
                {}
            );
            expect(result).toEqual([mockPreference]);
        });

        it('should initialize filter.where when filter is empty', async () => {
            mockPreferencesService.findAll.mockResolvedValue([]);

            await controller.getPreferences({} as any, {} as any, 'user-2');

            const callArg = mockPreferencesService.findAll.mock.calls[0][0];
            expect(callArg.where).toBeDefined();
            expect(callArg.where.userId).toBe('user-2');
        });

        it('should return an empty array when the user has no preferences', async () => {
            mockPreferencesService.findAll.mockResolvedValue([]);

            const result = await controller.getPreferences(
                {} as any,
                {} as any,
                'user-with-no-prefs'
            );

            expect(result).toEqual([]);
        });

        it('should pass pagination parameters to the service', async () => {
            mockPreferencesService.findAll.mockResolvedValue([mockPreference]);
            const pagination = { page: 1, limit: 10 } as any;

            await controller.getPreferences({} as any, pagination, 'user-1');

            expect(mockPreferencesService.findAll).toHaveBeenCalledWith(
                expect.any(Object),
                pagination
            );
        });
    });

    // -------------------------------------------------------------------------
    // createPreference
    // -------------------------------------------------------------------------
    describe('createPreference', () => {
        it('should create a preference for the authenticated user', async () => {
            mockPreferencesService.create.mockResolvedValue(mockPreference);

            const result = await controller.createPreference('user-1');

            expect(mockPreferencesService.create).toHaveBeenCalledWith('user-1');
            expect(result).toEqual(mockPreference);
        });

        it('should use the current user ID as the owner of the preference', async () => {
            mockPreferencesService.create.mockResolvedValue({
                ...mockPreference,
                userId: 'user-99',
            });

            await controller.createPreference('user-99');

            expect(mockPreferencesService.create).toHaveBeenCalledWith('user-99');
        });

        it('should propagate errors from PreferencesService.create', async () => {
            mockPreferencesService.create.mockRejectedValue(new Error('Constraint violation'));

            await expect(controller.createPreference('user-1')).rejects.toThrow(
                'Constraint violation'
            );
        });
    });

    // -------------------------------------------------------------------------
    // updatePreference
    // -------------------------------------------------------------------------
    describe('updatePreference', () => {
        it('should update and return the modified preference', async () => {
            const updated = { ...mockPreference, pushEnabled: false };
            mockPreferencesService.update.mockResolvedValue(updated);

            const result = await controller.updatePreference('1', { pushEnabled: false } as any);

            expect(mockPreferencesService.update).toHaveBeenCalledWith('1', { pushEnabled: false });
            expect(result.pushEnabled).toBe(false);
        });

        it('should pass the raw preference ID string to the service', async () => {
            mockPreferencesService.update.mockResolvedValue(mockPreference);

            await controller.updatePreference('42', { emailEnabled: false } as any);

            expect(mockPreferencesService.update).toHaveBeenCalledWith('42', {
                emailEnabled: false,
            });
        });

        it('should propagate errors from PreferencesService.update', async () => {
            mockPreferencesService.update.mockRejectedValue(new Error('Record not found'));

            await expect(
                controller.updatePreference('999', { smsEnabled: true } as any)
            ).rejects.toThrow('Record not found');
        });
    });
});
