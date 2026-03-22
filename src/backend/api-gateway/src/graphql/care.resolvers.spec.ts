import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { CareResolvers } from './care.resolvers';

describe('CareResolvers', () => {
    let resolvers: CareResolvers;
    let httpService: jest.Mocked<HttpService>;

    const mockUser = { id: 'user-1', email: 'test@example.com' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CareResolvers,
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('http://care-service:3003'),
                    },
                },
            ],
        }).compile();

        resolvers = module.get<CareResolvers>(CareResolvers);
        httpService = module.get(HttpService);
    });

    it('should be defined', () => {
        expect(resolvers).toBeDefined();
    });

    describe('getAppointments', () => {
        it('should return appointments for a user', async () => {
            const mockData = [{ id: 'appt-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getAppointments(mockUser, 'user-1');

            expect(result).toEqual(mockData);
            expect(httpService.get).toHaveBeenCalledWith(
                'http://care-service:3003/appointments?userId=user-1'
            );
        });
    });

    describe('getAppointment', () => {
        it('should return a single appointment', async () => {
            const mockData = { id: 'appt-1' };
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getAppointment(mockUser, 'appt-1');

            expect(result).toEqual(mockData);
        });
    });

    describe('getProviders', () => {
        it('should return providers with filters', async () => {
            const mockData = [{ id: 'prov-1', specialty: 'cardiology' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getProviders('cardiology', 'SP');

            expect(result).toEqual(mockData);
        });

        it('should return providers without filters', async () => {
            const mockData = [{ id: 'prov-1' }];
            httpService.get.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.getProviders();

            expect(result).toEqual(mockData);
        });
    });

    describe('bookAppointment', () => {
        it('should book an appointment', async () => {
            const mockData = { id: 'appt-new' };
            httpService.post.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.bookAppointment(
                mockUser,
                'prov-1',
                '2024-01-01',
                'consultation',
                'checkup'
            );

            expect(result).toEqual(mockData);
            expect(httpService.post).toHaveBeenCalledWith(
                'http://care-service:3003/appointments',
                expect.objectContaining({
                    providerId: 'prov-1',
                    userId: 'user-1',
                })
            );
        });
    });

    describe('cancelAppointment', () => {
        it('should cancel an appointment', async () => {
            const mockData = { id: 'appt-1', status: 'cancelled' };
            httpService.delete.mockReturnValue(of({ data: mockData } as never));

            const result = await resolvers.cancelAppointment(mockUser, 'appt-1');

            expect(result).toEqual(mockData);
        });
    });

    // -------------------------------------------------------------------------
    // Error handling tests
    // -------------------------------------------------------------------------
    describe('getAppointments - error handling', () => {
        it('should propagate errors from care service', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Service Unavailable')));

            await expect(resolvers.getAppointments(mockUser, 'user-1')).rejects.toThrow(
                'Service Unavailable'
            );
        });
    });

    describe('getAppointment - error handling', () => {
        it('should propagate errors when appointment not found', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Not Found')));

            await expect(resolvers.getAppointment(mockUser, 'appt-999')).rejects.toThrow(
                'Not Found'
            );
        });
    });

    describe('getProviders - error handling', () => {
        it('should propagate errors from care service', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('Internal Server Error')));

            await expect(resolvers.getProviders('cardiology')).rejects.toThrow(
                'Internal Server Error'
            );
        });
    });

    describe('bookAppointment - error handling', () => {
        it('should propagate errors from care service', async () => {
            httpService.post.mockReturnValue(throwError(() => new Error('Conflict')));

            await expect(
                resolvers.bookAppointment(mockUser, 'prov-1', '2024-01-01', 'consultation')
            ).rejects.toThrow('Conflict');
        });

        it('should book without optional reason', async () => {
            httpService.post.mockReturnValue(of({ data: { id: 'appt-new' } } as never));

            const result = await resolvers.bookAppointment(
                mockUser,
                'prov-1',
                '2024-01-01',
                'consultation'
            );

            expect(httpService.post).toHaveBeenCalledWith(
                'http://care-service:3003/appointments',
                expect.objectContaining({ reason: undefined })
            );
            expect(result).toEqual({ id: 'appt-new' });
        });
    });

    describe('cancelAppointment - error handling', () => {
        it('should propagate errors from care service', async () => {
            httpService.delete.mockReturnValue(throwError(() => new Error('Already cancelled')));

            await expect(resolvers.cancelAppointment(mockUser, 'appt-1')).rejects.toThrow(
                'Already cancelled'
            );
        });
    });
});
