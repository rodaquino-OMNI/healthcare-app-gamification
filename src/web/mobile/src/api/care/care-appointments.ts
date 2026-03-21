/**
 * Care API - Appointments, Visits, Booking, Payments & Medical Records.
 * Also contains the shared getAuthSession helper and Session type used
 * across all care API modules (and by health.ts, wellness.ts, gamification.ts).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements

import { restClient } from '../client';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Appointment {
    id: string;
    providerId: string;
    patientId: string;
    dateTime: string;
    type: string;
    status: string;
    reason?: string;
    notes?: string;
}

export interface Session {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    userId?: string;
}

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

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------

/**
 * Retrieves the current authentication session from storage.
 * @returns The session object or null if unauthenticated.
 */
export const getAuthSession = async (): Promise<Session | null> => {
    try {
        const tokenFromStorage = await AsyncStorage.getItem('auth_session');
        if (tokenFromStorage) {
            return JSON.parse(tokenFromStorage);
        }
    } catch (error) {
        console.error('Failed to get auth session:', error);
    }
    return null;
};

// Internal helper to reduce repetition in every function
export async function requireSession(): Promise<Session> {
    const session = await getAuthSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return session;
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

/**
 * Books an appointment with a healthcare provider.
 * @param appointmentDetails - Appointment data (without id and status).
 * @returns The created appointment.
 */
export async function bookAppointment(appointmentDetails: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
    const session = await requireSession();
    const response: AxiosResponse<Appointment> = await restClient.post('/care/appointments', appointmentDetails, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Fetches all appointments for a given user.
 * @param userId - The user whose appointments to retrieve.
 */
export async function getAppointments(userId: string): Promise<Appointment[]> {
    const session = await requireSession();
    const response: AxiosResponse<Appointment[]> = await restClient.get('/care/appointments', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Fetches the full detail of a single appointment.
 * @param appointmentId - The appointment to retrieve.
 */
export async function getAppointmentDetail(appointmentId: string): Promise<AppointmentDetail> {
    const session = await requireSession();
    const response: AxiosResponse<AppointmentDetail> = await restClient.get(`/care/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Cancels an existing appointment.
 * @param appointmentId - The appointment to cancel.
 * @param reason - Optional cancellation reason.
 */
export async function cancelAppointment(appointmentId: string, reason?: string): Promise<void> {
    const session = await requireSession();
    await restClient.delete(`/care/appointments/${appointmentId}`, {
        params: reason ? { reason } : undefined,
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
}

/**
 * Reschedules an appointment to a new date/time.
 * @param appointmentId - The appointment to reschedule.
 * @param newDateTime - The new ISO date-time string.
 */
export async function rescheduleAppointment(appointmentId: string, newDateTime: string): Promise<Appointment> {
    const session = await requireSession();
    const response: AxiosResponse<Appointment> = await restClient.put(
        `/care/appointments/${appointmentId}/reschedule`,
        { newDateTime },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Marks an appointment as a no-show.
 * @param appointmentId - The appointment to mark.
 */
export async function markNoShow(appointmentId: string): Promise<void> {
    const session = await requireSession();
    await restClient.post(`/care/appointments/${appointmentId}/no-show`, undefined, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
}

// ---------------------------------------------------------------------------
// Visit Management
// ---------------------------------------------------------------------------

/**
 * Retrieves the summary for a past visit.
 * @param visitId - The visit to summarize.
 */
export async function getVisitSummary(visitId: string): Promise<VisitSummary> {
    const session = await requireSession();
    const response: AxiosResponse<VisitSummary> = await restClient.get(`/care/visits/${visitId}/summary`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves follow-up instructions for a visit.
 * @param visitId - The visit to check.
 */
export async function getFollowUp(visitId: string): Promise<{ date: string; instructions: string }> {
    const session = await requireSession();
    const response: AxiosResponse<{ date: string; instructions: string }> = await restClient.get(
        `/care/visits/${visitId}/follow-up`,
        {
            headers: { Authorization: `Bearer ${session.accessToken}` },
        }
    );
    return response.data;
}

/**
 * Retrieves prescriptions issued during a visit.
 * @param visitId - The visit to check.
 */
export async function getVisitPrescriptions(visitId: string): Promise<Prescription[]> {
    const session = await requireSession();
    const response: AxiosResponse<Prescription[]> = await restClient.get(`/care/visits/${visitId}/prescriptions`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves lab orders associated with a visit.
 * @param visitId - The visit to check.
 */
export async function getLabOrders(visitId: string): Promise<LabOrder[]> {
    const session = await requireSession();
    const response: AxiosResponse<LabOrder[]> = await restClient.get(`/care/visits/${visitId}/lab-orders`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves a referral associated with a visit.
 * @param visitId - The visit to check.
 */
export async function getReferral(visitId: string): Promise<Referral> {
    const session = await requireSession();
    const response: AxiosResponse<Referral> = await restClient.get(`/care/visits/${visitId}/referral`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves the pre-visit checklist for an appointment.
 * @param appointmentId - The appointment to check.
 */
export async function getPreVisitChecklist(appointmentId: string): Promise<PreVisitChecklist> {
    const session = await requireSession();
    const response: AxiosResponse<PreVisitChecklist> = await restClient.get(
        `/care/appointments/${appointmentId}/checklist`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}
