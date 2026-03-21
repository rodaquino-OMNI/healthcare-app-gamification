/**
 * Care API - Doctor / Provider search, favourites, Booking, Payments & Medical Records.
 */

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements

import { restClient } from '../client';
import { requireSession, ProviderSummary } from './care-appointments';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface DoctorProfile {
    id: string;
    name: string;
    specialty: string;
    bio: string;
    avatarUrl?: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    education: string[];
    experience: string;
    acceptingNewPatients: boolean;
    insurancesAccepted: string[];
    location: { address: string; city: string; state: string };
}

export interface DoctorReview {
    id: string;
    doctorId: string;
    patientId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface DoctorAvailability {
    doctorId: string;
    date: string;
    slots: { startTime: string; endTime: string; available: boolean }[];
}

export interface DoctorFilter {
    specialties: string[];
    insurances: string[];
    languages: string[];
    genders: string[];
    maxDistance?: number;
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

/**
 * Searches for healthcare providers based on criteria.
 * @param params - Search parameters.
 * @returns Matching provider profiles.
 */
export async function searchProviders(params: {
    specialty?: string;
    name?: string;
    location?: string;
    insurance?: string;
    language?: string;
}): Promise<DoctorProfile[]> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorProfile[]> = await restClient.get('/care/providers/search', {
        params,
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves a doctor's full profile.
 * @param doctorId - The doctor to retrieve.
 */
export async function getDoctorProfile(doctorId: string): Promise<DoctorProfile> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorProfile> = await restClient.get(`/care/doctors/${doctorId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves reviews for a doctor.
 * @param doctorId - The doctor whose reviews to fetch.
 * @param page - Optional page number for pagination.
 */
export async function getDoctorReviews(doctorId: string, page?: number): Promise<DoctorReview[]> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorReview[]> = await restClient.get(`/care/doctors/${doctorId}/reviews`, {
        params: page !== undefined ? { page } : undefined,
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves available time slots for a doctor on a given date.
 * @param doctorId - The doctor to check.
 * @param date - The date in ISO format (YYYY-MM-DD).
 */
export async function getDoctorAvailability(doctorId: string, date: string): Promise<DoctorAvailability> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorAvailability> = await restClient.get(`/care/doctors/${doctorId}/availability`, {
        params: { date },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves available filter options for doctor search.
 */
export async function getDoctorFilters(): Promise<DoctorFilter> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorFilter> = await restClient.get('/care/doctors/filters', {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Saves a doctor as a favourite.
 * @param doctorId - The doctor to save.
 */
export async function saveFavoriteDoctor(doctorId: string): Promise<void> {
    const session = await requireSession();
    await restClient.post(`/care/doctors/${doctorId}/favorite`, undefined, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
}

/**
 * Removes a doctor from favourites.
 * @param doctorId - The doctor to remove.
 */
export async function removeFavoriteDoctor(doctorId: string): Promise<void> {
    const session = await requireSession();
    await restClient.delete(`/care/doctors/${doctorId}/favorite`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
}

/**
 * Retrieves saved/favourite doctors for a user.
 * @param userId - The user whose saved doctors to retrieve.
 */
export async function getSavedDoctors(userId: string): Promise<DoctorProfile[]> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorProfile[]> = await restClient.get('/care/doctors/saved', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Searches doctors with optional filters.
 * @param query - The search query string.
 * @param filters - Optional filter criteria.
 */
export async function getDoctorSearchList(query: string, filters?: Partial<DoctorFilter>): Promise<DoctorProfile[]> {
    const session = await requireSession();
    const response: AxiosResponse<DoctorProfile[]> = await restClient.get('/care/doctors/search', {
        params: { query, ...filters },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

// ---------------------------------------------------------------------------
// Booking Interfaces
// ---------------------------------------------------------------------------

export interface BookingType {
    id: string;
    name: string;
    description: string;
    duration: number;
    price?: number;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
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
// Booking
// ---------------------------------------------------------------------------

/**
 * Retrieves available booking types for a doctor.
 * @param doctorId - The doctor whose booking types to fetch.
 */
export async function getBookingTypes(doctorId: string): Promise<BookingType[]> {
    const session = await requireSession();
    const response: AxiosResponse<BookingType[]> = await restClient.get(`/care/doctors/${doctorId}/booking-types`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves available time slots for a specific booking type and date.
 * @param doctorId - The doctor to check.
 * @param typeId - The booking type ID.
 * @param date - The date in ISO format (YYYY-MM-DD).
 */
export async function getBookingSchedule(doctorId: string, typeId: string, date: string): Promise<TimeSlot[]> {
    const session = await requireSession();
    const response: AxiosResponse<TimeSlot[]> = await restClient.get('/care/booking/schedule', {
        params: { doctorId, typeId, date },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Confirms a booking and returns the confirmation details.
 * @param appointmentId - The appointment to confirm.
 */
export async function confirmBooking(appointmentId: string): Promise<BookingConfirmation> {
    const session = await requireSession();
    const response: AxiosResponse<BookingConfirmation> = await restClient.post(
        `/care/booking/${appointmentId}/confirm`,
        undefined,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Submits insurance information for a booking.
 * @param appointmentId - The appointment to attach insurance to.
 * @param insurance - The insurance submission data.
 */
export async function submitInsurance(appointmentId: string, insurance: InsuranceSubmission): Promise<void> {
    const session = await requireSession();
    await restClient.post(`/care/booking/${appointmentId}/insurance`, insurance, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
}

/**
 * Uploads documents for a booking (e.g. ID, referral letter).
 * @param appointmentId - The appointment to attach documents to.
 * @param documents - FormData containing the document files.
 * @returns Array of uploaded document URLs.
 */
export async function uploadBookingDocuments(appointmentId: string, documents: FormData): Promise<string[]> {
    const session = await requireSession();
    const response: AxiosResponse<string[]> = await restClient.post(
        `/care/booking/${appointmentId}/documents`,
        documents,
        {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

/**
 * Retrieves the payment summary for an appointment.
 * @param appointmentId - The appointment to check.
 */
export async function getPaymentSummary(appointmentId: string): Promise<PaymentSummary> {
    const session = await requireSession();
    const response: AxiosResponse<PaymentSummary> = await restClient.get(`/care/payments/${appointmentId}/summary`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves a payment receipt.
 * @param paymentId - The payment whose receipt to fetch.
 */
export async function getPaymentReceipt(paymentId: string): Promise<PaymentReceipt> {
    const session = await requireSession();
    const response: AxiosResponse<PaymentReceipt> = await restClient.get(`/care/payments/${paymentId}/receipt`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

// ---------------------------------------------------------------------------
// Medical Records
// ---------------------------------------------------------------------------

/**
 * Retrieves medical records for a user, optionally filtered by type.
 * @param userId - The user whose records to retrieve.
 * @param type - Optional record type filter.
 */
export async function getMedicalRecords(userId: string, type?: string): Promise<MedicalRecord[]> {
    const session = await requireSession();
    const response: AxiosResponse<MedicalRecord[]> = await restClient.get('/care/medical-records', {
        params: { userId, ...(type ? { type } : {}) },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}
