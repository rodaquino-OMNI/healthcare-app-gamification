/**
 * Tests for src/web/web/src/api/care.ts
 *
 * The care module uses both Apollo Client (GraphQL) and restClient (REST).
 * We mock restClient to validate REST endpoints, methods, and payloads.
 * The 10 new REST functions added by A1-A4 workers are tested here.
 */

import {
    submitDoctorReview,
    getVisitHistory,
    getAppointmentReminders,
    updatePreVisitChecklist,
    getTelemedicineMessages,
    getProviderSpecialties,
    getProviderInsurances,
    getNearbyProviders,
    getUrgentCareLocations,
    getSecondOpinion,
} from '../care';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockRestClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../client', () => ({
    restClient: mockRestClient,
}));

jest.mock('@apollo/client', () => ({
    ApolloClient: jest.fn().mockImplementation(() => ({
        query: jest.fn(),
        mutate: jest.fn(),
    })),
    InMemoryCache: jest.fn(),
    gql: jest.fn(),
}));

jest.mock('shared/config/apiConfig', () => ({
    apiConfig: { journeys: { care: 'https://api.austa.com.br/care/graphql' } },
}));

jest.mock('shared/graphql/mutations/care.mutations', () => ({
    BOOK_APPOINTMENT: 'mutation BookAppointment { ... }',
    CANCEL_APPOINTMENT: 'mutation CancelAppointment { ... }',
}));

jest.mock('shared/graphql/queries/care.queries', () => ({
    GET_APPOINTMENTS: 'query GetAppointments { ... }',
    GET_APPOINTMENT: 'query GetAppointment { ... }',
    GET_PROVIDERS: 'query GetProviders { ... }',
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// submitDoctorReview
// ---------------------------------------------------------------------------

describe('submitDoctorReview', () => {
    it('should POST /care/doctors/:doctorId/reviews with review data', async () => {
        const review = {
            id: 'rev1',
            doctorId: 'doc1',
            patientId: 'u1',
            rating: 5,
            comment: 'Great doctor',
            createdAt: '2026-01-15',
        };
        mockRestClient.post.mockResolvedValue({ data: review });

        const result = await submitDoctorReview('doc1', { rating: 5, comment: 'Great doctor' });

        expect(mockRestClient.post).toHaveBeenCalledWith('/care/doctors/doc1/reviews', {
            rating: 5,
            comment: 'Great doctor',
        });
        expect(result).toEqual(review);
    });

    it('should throw on error', async () => {
        mockRestClient.post.mockRejectedValue(new Error('Server error'));

        await expect(submitDoctorReview('doc1', { rating: 5, comment: 'Great' })).rejects.toThrow('Server error');
    });
});

// ---------------------------------------------------------------------------
// getVisitHistory
// ---------------------------------------------------------------------------

describe('getVisitHistory', () => {
    it('should GET /care/visits/history with userId and optional page', async () => {
        const visits = [
            {
                id: 'v1',
                appointmentId: 'a1',
                doctorName: 'Dr. Smith',
                date: '2026-01-10',
                diagnosis: 'Flu',
                notes: 'Rest',
            },
        ];
        mockRestClient.get.mockResolvedValue({ data: visits });

        const result = await getVisitHistory('u1', 2);

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/visits/history', {
            params: { userId: 'u1', page: 2 },
        });
        expect(result).toEqual(visits);
    });

    it('should work without page parameter', async () => {
        const visits = [{ id: 'v1' }];
        mockRestClient.get.mockResolvedValue({ data: visits });

        const result = await getVisitHistory('u1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/visits/history', {
            params: { userId: 'u1' },
        });
        expect(result).toEqual(visits);
    });
});

// ---------------------------------------------------------------------------
// getAppointmentReminders
// ---------------------------------------------------------------------------

describe('getAppointmentReminders', () => {
    it('should GET /care/appointments/reminders with userId', async () => {
        const reminders = [
            { appointmentId: 'a1', reminderTime: '2026-01-15T08:00:00Z', message: 'Your appointment is tomorrow' },
        ];
        mockRestClient.get.mockResolvedValue({ data: reminders });

        const result = await getAppointmentReminders('u1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/appointments/reminders', { params: { userId: 'u1' } });
        expect(result).toEqual(reminders);
    });
});

// ---------------------------------------------------------------------------
// updatePreVisitChecklist
// ---------------------------------------------------------------------------

describe('updatePreVisitChecklist', () => {
    it('should PUT /care/appointments/:id/checklist/:itemId with completed status', async () => {
        const checklist = {
            appointmentId: 'a1',
            items: [{ id: 'item1', label: 'Bring ID', completed: true, required: true }],
        };
        mockRestClient.put.mockResolvedValue({ data: checklist });

        const result = await updatePreVisitChecklist('a1', 'item1', true);

        expect(mockRestClient.put).toHaveBeenCalledWith('/care/appointments/a1/checklist/item1', { completed: true });
        expect(result).toEqual(checklist);
    });
});

// ---------------------------------------------------------------------------
// getTelemedicineMessages
// ---------------------------------------------------------------------------

describe('getTelemedicineMessages', () => {
    it('should GET /care/telemedicine/sessions/:id/messages', async () => {
        const messages = [
            {
                id: 'm1',
                sessionId: 's1',
                senderId: 'u1',
                content: 'Hello',
                type: 'text',
                timestamp: '2026-01-15T10:00:00Z',
            },
        ];
        mockRestClient.get.mockResolvedValue({ data: messages });

        const result = await getTelemedicineMessages('s1');

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/telemedicine/sessions/s1/messages');
        expect(result).toEqual(messages);
    });
});

// ---------------------------------------------------------------------------
// getProviderSpecialties
// ---------------------------------------------------------------------------

describe('getProviderSpecialties', () => {
    it('should GET /care/providers/specialties and return list', async () => {
        const specialties = ['Cardiology', 'Dermatology', 'Pediatrics'];
        mockRestClient.get.mockResolvedValue({ data: specialties });

        const result = await getProviderSpecialties();

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/providers/specialties');
        expect(result).toEqual(specialties);
    });
});

// ---------------------------------------------------------------------------
// getProviderInsurances
// ---------------------------------------------------------------------------

describe('getProviderInsurances', () => {
    it('should GET /care/providers/insurances and return list', async () => {
        const insurances = ['Unimed', 'SulAmerica', 'Bradesco Saude'];
        mockRestClient.get.mockResolvedValue({ data: insurances });

        const result = await getProviderInsurances();

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/providers/insurances');
        expect(result).toEqual(insurances);
    });
});

// ---------------------------------------------------------------------------
// getNearbyProviders
// ---------------------------------------------------------------------------

describe('getNearbyProviders', () => {
    it('should GET /care/providers/nearby with coordinates and optional radius', async () => {
        const providers = [{ id: 'p1', name: 'Dr. Silva', specialty: 'General' }];
        mockRestClient.get.mockResolvedValue({ data: providers });

        const result = await getNearbyProviders(-23.55, -46.63, 10);

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/providers/nearby', {
            params: { latitude: -23.55, longitude: -46.63, radius: 10 },
        });
        expect(result).toEqual(providers);
    });

    it('should work without radius parameter', async () => {
        const providers = [{ id: 'p1', name: 'Dr. Silva' }];
        mockRestClient.get.mockResolvedValue({ data: providers });

        const result = await getNearbyProviders(-23.55, -46.63);

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/providers/nearby', {
            params: { latitude: -23.55, longitude: -46.63 },
        });
        expect(result).toEqual(providers);
    });
});

// ---------------------------------------------------------------------------
// getUrgentCareLocations
// ---------------------------------------------------------------------------

describe('getUrgentCareLocations', () => {
    it('should GET /care/urgent-care with coordinates', async () => {
        const locations = [
            { id: 'uc1', name: 'UrgentCare SP', address: 'Rua X', distance: '2km', phone: '1199999999', waitTime: 15 },
        ];
        mockRestClient.get.mockResolvedValue({ data: locations });

        const result = await getUrgentCareLocations(-23.55, -46.63);

        expect(mockRestClient.get).toHaveBeenCalledWith('/care/urgent-care', {
            params: { latitude: -23.55, longitude: -46.63 },
        });
        expect(result).toEqual(locations);
    });
});

// ---------------------------------------------------------------------------
// getSecondOpinion
// ---------------------------------------------------------------------------

describe('getSecondOpinion', () => {
    it('should POST /care/appointments/:id/second-opinion', async () => {
        const opinion = { id: 'so1', status: 'pending', requestedAt: '2026-01-15T10:00:00Z' };
        mockRestClient.post.mockResolvedValue({ data: opinion });

        const result = await getSecondOpinion('a1');

        expect(mockRestClient.post).toHaveBeenCalledWith('/care/appointments/a1/second-opinion');
        expect(result).toEqual(opinion);
    });

    it('should throw on error', async () => {
        mockRestClient.post.mockRejectedValue(new Error('Not found'));

        await expect(getSecondOpinion('a1')).rejects.toThrow('Not found');
    });
});
