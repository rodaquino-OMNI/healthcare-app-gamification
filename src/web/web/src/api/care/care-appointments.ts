/**
 * Care Appointments API Module
 *
 * Handles appointment CRUD (GraphQL + REST), visit management, booking workflows,
 * payments, and medical records for the Care Now Journey.
 */

import { ApolloClient, InMemoryCache } from '@apollo/client'; // v3.7.0
import { apiConfig } from 'shared/config/apiConfig';
import { BOOK_APPOINTMENT, CANCEL_APPOINTMENT } from 'shared/graphql/mutations/care.mutations';
import { GET_APPOINTMENTS, GET_APPOINTMENT, GET_PROVIDERS } from 'shared/graphql/queries/care.queries';
import { Appointment } from 'shared/types/care.types';

import { restClient } from '../client';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ProviderSummary {
    id: string;
    name: string;
    specialty: string;
    avatarUrl?: string;
    rating?: number;
}

export interface AppointmentDetail extends Appointment {
    provider: ProviderSummary;
    location: string;
    instructions?: string;
    checklist?: string[];
}

export interface VisitSummary {
    id: string;
    appointmentId: string;
    doctorName: string;
    date: string;
    diagnosis: string;
    notes: string;
    followUpDate?: string;
}

export interface Prescription {
    id: string;
    visitId: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    refillsRemaining: number;
}

export interface LabOrder {
    id: string;
    visitId: string;
    testName: string;
    status: 'ordered' | 'collected' | 'processing' | 'completed';
    results?: string;
    orderedAt: string;
    completedAt?: string;
}

export interface Referral {
    id: string;
    visitId: string;
    referredTo: ProviderSummary;
    reason: string;
    status: 'pending' | 'accepted' | 'completed';
    notes?: string;
}

export interface ChecklistItem {
    id: string;
    label: string;
    completed: boolean;
    required: boolean;
}

export interface PreVisitChecklist {
    appointmentId: string;
    items: ChecklistItem[];
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
}

export interface BookingType {
    id: string;
    name: string;
    description: string;
    duration: number;
    price?: number;
}

export interface BookingConfirmation {
    appointmentId: string;
    confirmationCode: string;
    dateTime: string;
    provider: ProviderSummary;
    type: string;
    instructions: string;
}

export interface InsuranceSubmission {
    planId: string;
    memberId: string;
    groupNumber?: string;
    frontImageUrl?: string;
    backImageUrl?: string;
}

export interface PaymentSummary {
    appointmentId: string;
    amount: number;
    currency: string;
    copay: number;
    insuranceCovered: number;
    status: 'pending' | 'paid' | 'refunded';
}

export interface PaymentReceipt {
    id: string;
    appointmentId: string;
    amount: number;
    paidAt: string;
    method: string;
    receiptUrl: string;
}

export interface MedicalRecord {
    id: string;
    userId: string;
    type: string;
    title: string;
    date: string;
    provider: string;
    fileUrl?: string;
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------

/** Typed response shapes for Apollo queries */
interface GetAppointmentsData {
    getAppointments: Appointment[];
}

interface GetAppointmentData {
    getAppointment: Appointment;
}

interface GetProvidersData {
    getProviders: unknown[];
}

interface BookAppointmentData {
    bookAppointment: Appointment;
}

interface CancelAppointmentData {
    cancelAppointment: Appointment;
}

// Apollo client instance for making GraphQL requests
const client = new ApolloClient({
    uri: apiConfig.journeys.care,
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

// ===========================================================================
// 1. GRAPHQL FUNCTIONS (5)
// ===========================================================================

/**
 * Fetches a list of appointments for a given user ID.
 */
export async function getAppointments(userId: string): Promise<Appointment[]> {
    try {
        const { data } = await client.query<GetAppointmentsData>({
            query: GET_APPOINTMENTS,
            variables: { userId },
        });
        return data.getAppointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

/**
 * Fetches a single appointment by its ID.
 */
export async function getAppointment(id: string): Promise<Appointment> {
    try {
        const { data } = await client.query<GetAppointmentData>({
            query: GET_APPOINTMENT,
            variables: { id },
        });
        return data.getAppointment;
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw error;
    }
}

/**
 * Fetches a list of providers based on specialty and location.
 */
export async function getProviders(specialty: string, location: string): Promise<unknown[]> {
    try {
        const { data } = await client.query<GetProvidersData>({
            query: GET_PROVIDERS,
            variables: { specialty, location },
        });
        return data.getProviders;
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
}

/**
 * Books a new appointment with the given provider, date, type and reason.
 */
export async function bookAppointment(
    providerId: string,
    dateTime: string,
    type: string,
    reason: string
): Promise<Appointment> {
    try {
        const { data } = await client.mutate<BookAppointmentData>({
            mutation: BOOK_APPOINTMENT,
            variables: { providerId, dateTime, type, reason },
        });
        return data!.bookAppointment;
    } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
    }
}

/**
 * Cancels an existing appointment with the given ID.
 */
export async function cancelAppointment(id: string): Promise<Appointment> {
    try {
        const { data } = await client.mutate<CancelAppointmentData>({
            mutation: CANCEL_APPOINTMENT,
            variables: { id },
        });
        return data!.cancelAppointment;
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        throw error;
    }
}

// ===========================================================================
// 2. APPOINTMENT REST FUNCTIONS (3)
// ===========================================================================

/** Fetches the full detail of a single appointment. */
export async function getAppointmentDetail(appointmentId: string): Promise<AppointmentDetail> {
    const response = await restClient.get<AppointmentDetail>(`/care/appointments/${appointmentId}`);
    return response.data;
}

/** Reschedules an appointment to a new date/time. */
export async function rescheduleAppointment(appointmentId: string, newDateTime: string): Promise<Appointment> {
    const response = await restClient.put<Appointment>(`/care/appointments/${appointmentId}/reschedule`, {
        newDateTime,
    });
    return response.data;
}

/** Marks an appointment as a no-show. */
export async function markNoShow(appointmentId: string): Promise<void> {
    await restClient.post(`/care/appointments/${appointmentId}/no-show`);
}

// ===========================================================================
// 3. VISIT MANAGEMENT FUNCTIONS (6)
// ===========================================================================

/** Retrieves the summary for a past visit. */
export async function getVisitSummary(visitId: string): Promise<VisitSummary> {
    const response = await restClient.get<VisitSummary>(`/care/visits/${visitId}/summary`);
    return response.data;
}

/** Retrieves follow-up instructions for a visit. */
export async function getFollowUp(visitId: string): Promise<{ date: string; instructions: string }> {
    const response = await restClient.get<{ date: string; instructions: string }>(`/care/visits/${visitId}/follow-up`);
    return response.data;
}

/** Retrieves prescriptions issued during a visit. */
export async function getVisitPrescriptions(visitId: string): Promise<Prescription[]> {
    const response = await restClient.get<Prescription[]>(`/care/visits/${visitId}/prescriptions`);
    return response.data;
}

/** Retrieves lab orders associated with a visit. */
export async function getLabOrders(visitId: string): Promise<LabOrder[]> {
    const response = await restClient.get<LabOrder[]>(`/care/visits/${visitId}/lab-orders`);
    return response.data;
}

/** Retrieves a referral associated with a visit. */
export async function getReferral(visitId: string): Promise<Referral> {
    const response = await restClient.get<Referral>(`/care/visits/${visitId}/referral`);
    return response.data;
}

/** Retrieves the pre-visit checklist for an appointment. */
export async function getPreVisitChecklist(appointmentId: string): Promise<PreVisitChecklist> {
    const response = await restClient.get<PreVisitChecklist>(`/care/appointments/${appointmentId}/checklist`);
    return response.data;
}

// ===========================================================================
// 4. BOOKING FUNCTIONS (5)
// ===========================================================================

/** Retrieves available booking types for a doctor. */
export async function getBookingTypes(doctorId: string): Promise<BookingType[]> {
    const response = await restClient.get<BookingType[]>(`/care/doctors/${doctorId}/booking-types`);
    return response.data;
}

/** Retrieves available time slots for a specific booking type and date. */
export async function getBookingSchedule(doctorId: string, typeId: string, date: string): Promise<TimeSlot[]> {
    const response = await restClient.get<TimeSlot[]>('/care/booking/schedule', {
        params: { doctorId, typeId, date },
    });
    return response.data;
}

/** Confirms a booking and returns the confirmation details. */
export async function confirmBooking(appointmentId: string): Promise<BookingConfirmation> {
    const response = await restClient.post<BookingConfirmation>(`/care/booking/${appointmentId}/confirm`);
    return response.data;
}

/** Submits insurance information for a booking. */
export async function submitInsurance(appointmentId: string, insurance: InsuranceSubmission): Promise<void> {
    await restClient.post(`/care/booking/${appointmentId}/insurance`, insurance);
}

/** Uploads documents for a booking (e.g. ID, referral letter). */
export async function uploadBookingDocuments(appointmentId: string, documents: FormData): Promise<string[]> {
    const response = await restClient.post<string[]>(`/care/booking/${appointmentId}/documents`, documents, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

// ===========================================================================
// 5. PAYMENT FUNCTIONS (2)
// ===========================================================================

/** Retrieves the payment summary for an appointment. */
export async function getPaymentSummary(appointmentId: string): Promise<PaymentSummary> {
    const response = await restClient.get<PaymentSummary>(`/care/payments/${appointmentId}/summary`);
    return response.data;
}

/** Retrieves a payment receipt. */
export async function getPaymentReceipt(paymentId: string): Promise<PaymentReceipt> {
    const response = await restClient.get<PaymentReceipt>(`/care/payments/${paymentId}/receipt`);
    return response.data;
}

// ===========================================================================
// 6. MEDICAL RECORDS FUNCTIONS (1)
// ===========================================================================

/** Retrieves medical records for a user, optionally filtered by type. */
export async function getMedicalRecords(userId: string, type?: string): Promise<MedicalRecord[]> {
    const response = await restClient.get<MedicalRecord[]>('/care/medical-records', {
        params: { userId, ...(type ? { type } : {}) },
    });
    return response.data;
}

// ===========================================================================
// 7. ADDITIONAL APPOINTMENT FUNCTIONS (4)
// ===========================================================================

/** Retrieves paginated visit history for a user. */
export async function getVisitHistory(userId: string, page?: number): Promise<VisitSummary[]> {
    const response = await restClient.get<VisitSummary[]>('/care/visits/history', {
        params: { userId, ...(page !== undefined ? { page } : {}) },
    });
    return response.data;
}

/** Retrieves upcoming appointment reminders for a user. */
export async function getAppointmentReminders(
    userId: string
): Promise<Array<{ appointmentId: string; reminderTime: string; message: string }>> {
    const response = await restClient.get<Array<{ appointmentId: string; reminderTime: string; message: string }>>(
        '/care/appointments/reminders',
        { params: { userId } }
    );
    return response.data;
}

/** Updates a single item in the pre-visit checklist for an appointment. */
export async function updatePreVisitChecklist(
    appointmentId: string,
    itemId: string,
    completed: boolean
): Promise<PreVisitChecklist> {
    const response = await restClient.put<PreVisitChecklist>(
        `/care/appointments/${appointmentId}/checklist/${itemId}`,
        { completed }
    );
    return response.data;
}

/** Requests a second opinion for an existing appointment. */
export async function getSecondOpinion(
    appointmentId: string
): Promise<{ id: string; status: string; assignedDoctor?: ProviderSummary; requestedAt: string }> {
    const response = await restClient.post<{
        id: string;
        status: string;
        assignedDoctor?: ProviderSummary;
        requestedAt: string;
    }>(`/care/appointments/${appointmentId}/second-opinion`);
    return response.data;
}
