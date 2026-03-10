/**
 * Tests for src/web/mobile/src/api/care.ts
 *
 * The mobile care module uses restClient (axios) with auth session from AsyncStorage.
 * We mock both restClient and AsyncStorage to validate endpoints, methods, and auth.
 */

import { restClient } from '../client';
import {
    bookAppointment,
    getAppointments,
    getAppointmentDetail,
    cancelAppointment,
    rescheduleAppointment,
    analyzeSymptoms,
    checkSymptoms,
    getConditions,
    getConditionDetail,
    getEmergencyInfo,
    createTelemedicineSession,
    getTelemedicineSession,
    joinTelemedicineSession,
    endTelemedicineSession,
    sendTelemedicineMessage,
    getWaitingRoom,
    searchProviders,
    getDoctorProfile,
    getDoctorReviews,
    getDoctorAvailability,
    getDoctorFilters,
    saveFavoriteDoctor,
    removeFavoriteDoctor,
    getVisitSummary,
    getPaymentSummary,
    getMedicalRecords,
    confirmBooking,
    getBookingTypes,
    getAuthSession,
} from '../care';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    restClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncStorage = require('@react-native-async-storage/async-storage');

const MOCK_SESSION = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    expiresAt: Date.now() + 3600000,
    userId: 'user-123',
};

function setupAuth() {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(MOCK_SESSION));
}

function setupNoAuth() {
    AsyncStorage.getItem.mockResolvedValue(null);
}

beforeEach(() => {
    jest.clearAllMocks();
    setupAuth();
});

// ---------------------------------------------------------------------------
// getAuthSession
// ---------------------------------------------------------------------------

describe('getAuthSession', () => {
    it('should return parsed session from AsyncStorage', async () => {
        const session = await getAuthSession();
        expect(session).toEqual(MOCK_SESSION);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth_session');
    });

    it('should return null when no session stored', async () => {
        setupNoAuth();
        const session = await getAuthSession();
        expect(session).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

describe('bookAppointment', () => {
    it('should POST /care/appointments with auth header', async () => {
        const appointment = {
            id: 'a1',
            providerId: 'p1',
            patientId: 'u1',
            dateTime: '2025-01-01',
            type: 'video',
            status: 'confirmed',
        };
        (restClient.post as jest.Mock).mockResolvedValue({ data: appointment });

        const details = { providerId: 'p1', patientId: 'u1', dateTime: '2025-01-01', type: 'video' };
        const result = await bookAppointment(details);

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/appointments',
            details,
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: `Bearer ${MOCK_SESSION.accessToken}` }),
            })
        );
        expect(result).toEqual(appointment);
    });

    it('should throw if not authenticated', async () => {
        setupNoAuth();
        await expect(
            bookAppointment({ providerId: 'p1', patientId: 'u1', dateTime: '2025-01-01', type: 'video' })
        ).rejects.toThrow('Authentication required');
    });
});

describe('getAppointments', () => {
    it('should GET /care/appointments with userId param', async () => {
        const appointments = [{ id: 'a1' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: appointments });

        const result = await getAppointments('user-123');

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/appointments',
            expect.objectContaining({
                params: { userId: 'user-123' },
                headers: expect.objectContaining({ Authorization: `Bearer ${MOCK_SESSION.accessToken}` }),
            })
        );
        expect(result).toEqual(appointments);
    });
});

describe('getAppointmentDetail', () => {
    it('should GET /care/appointments/:id', async () => {
        const detail = { id: 'a1', provider: { name: 'Dr. Smith' } };
        (restClient.get as jest.Mock).mockResolvedValue({ data: detail });

        const result = await getAppointmentDetail('a1');

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/appointments/a1',
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: `Bearer ${MOCK_SESSION.accessToken}` }),
            })
        );
        expect(result).toEqual(detail);
    });
});

describe('cancelAppointment', () => {
    it('should DELETE /care/appointments/:id', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await cancelAppointment('a1', 'Changed plans');

        expect(restClient.delete).toHaveBeenCalledWith(
            '/care/appointments/a1',
            expect.objectContaining({
                params: { reason: 'Changed plans' },
            })
        );
    });

    it('should handle cancellation without reason', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await cancelAppointment('a1');

        expect(restClient.delete).toHaveBeenCalledWith(
            '/care/appointments/a1',
            expect.objectContaining({
                params: undefined,
            })
        );
    });
});

describe('rescheduleAppointment', () => {
    it('should PUT /care/appointments/:id/reschedule', async () => {
        const updated = { id: 'a1', dateTime: '2025-02-01' };
        (restClient.put as jest.Mock).mockResolvedValue({ data: updated });

        const result = await rescheduleAppointment('a1', '2025-02-01');

        expect(restClient.put).toHaveBeenCalledWith(
            '/care/appointments/a1/reschedule',
            { newDateTime: '2025-02-01' },
            expect.any(Object)
        );
        expect(result).toEqual(updated);
    });
});

// ---------------------------------------------------------------------------
// Symptom Checker
// ---------------------------------------------------------------------------

describe('analyzeSymptoms', () => {
    it('should POST /care/symptoms/analyze with symptoms and vitals', async () => {
        const mockResult = { id: 'sc1', severity: 'low' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: mockResult });

        const result = await analyzeSymptoms(['headache', 'fever'], { temperature: 38.5 });

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/symptoms/analyze',
            { symptoms: ['headache', 'fever'], vitals: { temperature: 38.5 } },
            expect.any(Object)
        );
        expect(result).toEqual(mockResult);
    });
});

describe('checkSymptoms', () => {
    it('should POST /care/symptoms/check', async () => {
        const mockResult = { id: 'sc2', severity: 'medium' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: mockResult });

        const result = await checkSymptoms({ symptoms: ['cough'] });

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/symptoms/check',
            { symptoms: ['cough'] },
            expect.any(Object)
        );
        expect(result).toEqual(mockResult);
    });
});

describe('getConditions', () => {
    it('should GET /care/symptoms/:id/conditions', async () => {
        const conditions = [{ id: 'c1', name: 'Cold', probability: 0.8 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: conditions });

        const result = await getConditions('sc1');

        expect(restClient.get).toHaveBeenCalledWith('/care/symptoms/sc1/conditions', expect.any(Object));
        expect(result).toEqual(conditions);
    });
});

describe('getConditionDetail', () => {
    it('should GET /care/conditions/:id', async () => {
        const detail = { id: 'c1', name: 'Cold', treatments: ['Rest'] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: detail });

        const result = await getConditionDetail('c1');

        expect(restClient.get).toHaveBeenCalledWith('/care/conditions/c1', expect.any(Object));
        expect(result).toEqual(detail);
    });
});

describe('getEmergencyInfo', () => {
    it('should GET /care/emergency with optional coords', async () => {
        const info = { hotline: '192', nearestER: { name: 'Hospital' } };
        (restClient.get as jest.Mock).mockResolvedValue({ data: info });

        const result = await getEmergencyInfo(-23.55, -46.63);

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/emergency',
            expect.objectContaining({
                params: { latitude: -23.55, longitude: -46.63 },
            })
        );
        expect(result).toEqual(info);
    });
});

// ---------------------------------------------------------------------------
// Telemedicine
// ---------------------------------------------------------------------------

describe('createTelemedicineSession', () => {
    it('should POST /care/telemedicine/sessions', async () => {
        const session = { id: 'ts1', appointmentId: 'a1', status: 'waiting' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: session });

        const result = await createTelemedicineSession('a1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/telemedicine/sessions',
            { appointmentId: 'a1' },
            expect.any(Object)
        );
        expect(result).toEqual(session);
    });
});

describe('getTelemedicineSession', () => {
    it('should GET /care/telemedicine/sessions/:id', async () => {
        const session = { id: 'ts1', status: 'active' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: session });

        const result = await getTelemedicineSession('ts1');

        expect(restClient.get).toHaveBeenCalledWith('/care/telemedicine/sessions/ts1', expect.any(Object));
        expect(result).toEqual(session);
    });
});

describe('joinTelemedicineSession', () => {
    it('should POST /care/telemedicine/sessions/:id/join', async () => {
        const session = { id: 'ts1', status: 'active' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: session });

        const result = await joinTelemedicineSession('ts1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/telemedicine/sessions/ts1/join',
            undefined,
            expect.any(Object)
        );
        expect(result).toEqual(session);
    });
});

describe('endTelemedicineSession', () => {
    it('should POST /care/telemedicine/sessions/:id/end', async () => {
        (restClient.post as jest.Mock).mockResolvedValue({});

        await endTelemedicineSession('ts1');

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/telemedicine/sessions/ts1/end',
            undefined,
            expect.any(Object)
        );
    });
});

describe('sendTelemedicineMessage', () => {
    it('should POST /care/telemedicine/sessions/:id/messages', async () => {
        const message = { id: 'm1', content: 'Hello', type: 'text' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: message });

        const result = await sendTelemedicineMessage('ts1', 'Hello', 'text');

        expect(restClient.post).toHaveBeenCalledWith(
            '/care/telemedicine/sessions/ts1/messages',
            { content: 'Hello', type: 'text' },
            expect.any(Object)
        );
        expect(result).toEqual(message);
    });
});

describe('getWaitingRoom', () => {
    it('should GET /care/telemedicine/sessions/:id/waiting-room', async () => {
        const info = { position: 2, estimatedWaitMinutes: 10 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: info });

        const result = await getWaitingRoom('ts1');

        expect(restClient.get).toHaveBeenCalledWith('/care/telemedicine/sessions/ts1/waiting-room', expect.any(Object));
        expect(result).toEqual(info);
    });
});

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

describe('searchProviders', () => {
    it('should GET /care/providers/search with params', async () => {
        const providers = [{ id: 'd1', name: 'Dr. Ana' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: providers });

        const result = await searchProviders({ specialty: 'cardiology' });

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/providers/search',
            expect.objectContaining({
                params: { specialty: 'cardiology' },
            })
        );
        expect(result).toEqual(providers);
    });
});

describe('getDoctorProfile', () => {
    it('should GET /care/doctors/:id', async () => {
        const profile = { id: 'd1', name: 'Dr. Ana', specialty: 'cardiology' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: profile });

        const result = await getDoctorProfile('d1');

        expect(restClient.get).toHaveBeenCalledWith('/care/doctors/d1', expect.any(Object));
        expect(result).toEqual(profile);
    });
});

describe('getDoctorReviews', () => {
    it('should GET /care/doctors/:id/reviews with optional page', async () => {
        const reviews = [{ id: 'rv1', rating: 5 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: reviews });

        const result = await getDoctorReviews('d1', 2);

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/doctors/d1/reviews',
            expect.objectContaining({ params: { page: 2 } })
        );
        expect(result).toEqual(reviews);
    });
});

describe('getDoctorAvailability', () => {
    it('should GET /care/doctors/:id/availability with date', async () => {
        const availability = { doctorId: 'd1', date: '2025-01-15', slots: [] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: availability });

        const result = await getDoctorAvailability('d1', '2025-01-15');

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/doctors/d1/availability',
            expect.objectContaining({ params: { date: '2025-01-15' } })
        );
        expect(result).toEqual(availability);
    });
});

describe('getDoctorFilters', () => {
    it('should GET /care/doctors/filters', async () => {
        const filters = { specialties: ['cardiology'], insurances: ['SUS'] };
        (restClient.get as jest.Mock).mockResolvedValue({ data: filters });

        const result = await getDoctorFilters();

        expect(restClient.get).toHaveBeenCalledWith('/care/doctors/filters', expect.any(Object));
        expect(result).toEqual(filters);
    });
});

describe('saveFavoriteDoctor', () => {
    it('should POST /care/doctors/:id/favorite', async () => {
        (restClient.post as jest.Mock).mockResolvedValue({});

        await saveFavoriteDoctor('d1');

        expect(restClient.post).toHaveBeenCalledWith('/care/doctors/d1/favorite', undefined, expect.any(Object));
    });
});

describe('removeFavoriteDoctor', () => {
    it('should DELETE /care/doctors/:id/favorite', async () => {
        (restClient.delete as jest.Mock).mockResolvedValue({});

        await removeFavoriteDoctor('d1');

        expect(restClient.delete).toHaveBeenCalledWith('/care/doctors/d1/favorite', expect.any(Object));
    });
});

// ---------------------------------------------------------------------------
// Visit Management
// ---------------------------------------------------------------------------

describe('getVisitSummary', () => {
    it('should GET /care/visits/:id/summary', async () => {
        const summary = { id: 'v1', diagnosis: 'Common cold' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: summary });

        const result = await getVisitSummary('v1');

        expect(restClient.get).toHaveBeenCalledWith('/care/visits/v1/summary', expect.any(Object));
        expect(result).toEqual(summary);
    });
});

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

describe('getBookingTypes', () => {
    it('should GET /care/doctors/:id/booking-types', async () => {
        const types = [{ id: 'bt1', name: 'Consultation', duration: 30 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: types });

        const result = await getBookingTypes('d1');

        expect(restClient.get).toHaveBeenCalledWith('/care/doctors/d1/booking-types', expect.any(Object));
        expect(result).toEqual(types);
    });
});

describe('confirmBooking', () => {
    it('should POST /care/booking/:id/confirm', async () => {
        const confirmation = { appointmentId: 'a1', confirmationCode: 'XYZ' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: confirmation });

        const result = await confirmBooking('a1');

        expect(restClient.post).toHaveBeenCalledWith('/care/booking/a1/confirm', undefined, expect.any(Object));
        expect(result).toEqual(confirmation);
    });
});

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

describe('getPaymentSummary', () => {
    it('should GET /care/payments/:id/summary', async () => {
        const summary = { appointmentId: 'a1', amount: 150, currency: 'BRL' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: summary });

        const result = await getPaymentSummary('a1');

        expect(restClient.get).toHaveBeenCalledWith('/care/payments/a1/summary', expect.any(Object));
        expect(result).toEqual(summary);
    });
});

// ---------------------------------------------------------------------------
// Medical Records
// ---------------------------------------------------------------------------

describe('getMedicalRecords', () => {
    it('should GET /care/medical-records with userId and optional type', async () => {
        const records = [{ id: 'mr1', type: 'lab', title: 'Blood Test' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: records });

        const result = await getMedicalRecords('user-123', 'lab');

        expect(restClient.get).toHaveBeenCalledWith(
            '/care/medical-records',
            expect.objectContaining({
                params: expect.objectContaining({ userId: 'user-123', type: 'lab' }),
            })
        );
        expect(result).toEqual(records);
    });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe('error handling', () => {
    it('should propagate network errors', async () => {
        (restClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(getAppointments('user-123')).rejects.toThrow('Network error');
    });
});
