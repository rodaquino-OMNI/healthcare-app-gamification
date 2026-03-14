/**
 * Care API Module
 *
 * This module provides functions for interacting with the Care service,
 * including methods for fetching providers, booking appointments, symptom
 * checking, telemedicine sessions, doctor management, visit management,
 * booking workflows, payments, and medical records.
 *
 * This is part of the Care Now Journey which provides immediate healthcare access
 * through appointment booking, telemedicine, and other care-related features.
 */

import { ApolloClient, InMemoryCache } from '@apollo/client'; // v3.7.0
import { apiConfig } from 'shared/config/apiConfig';
import { BOOK_APPOINTMENT, CANCEL_APPOINTMENT } from 'shared/graphql/mutations/care.mutations';
import { GET_APPOINTMENTS, GET_APPOINTMENT, GET_PROVIDERS } from 'shared/graphql/queries/care.queries';
import { Appointment } from 'shared/types/care.types';

import { restClient } from './client';

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

export interface ConditionMatch {
    id: string;
    name: string;
    probability: number;
    description: string;
    icdCode?: string;
}

export interface SymptomCheckResult {
    id: string;
    symptoms: string[];
    possibleConditions: ConditionMatch[];
    severity: 'low' | 'medium' | 'high' | 'emergency';
    recommendation: string;
    timestamp: string;
}

export interface ConditionDetail {
    id: string;
    name: string;
    description: string;
    symptoms: string[];
    treatments: string[];
    selfCareInstructions: string[];
    whenToSeekHelp: string;
    icdCode?: string;
}

export interface SymptomReport {
    id: string;
    userId: string;
    symptoms: string[];
    result: SymptomCheckResult;
    createdAt: string;
}

export interface EmergencyInfo {
    hotline: string;
    nearestER: { name: string; address: string; distance: string; phone: string };
    instructions: string[];
}

export interface TelemedicineSession {
    id: string;
    appointmentId: string;
    status: 'waiting' | 'active' | 'ended';
    roomUrl: string;
    token: string;
    startedAt?: string;
    endedAt?: string;
}

export interface TelemedicineMessage {
    id: string;
    sessionId: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'file';
    timestamp: string;
}

export interface WaitingRoomInfo {
    position: number;
    estimatedWaitMinutes: number;
    sessionId: string;
    providerName: string;
}

export interface TelemedicineControls {
    audioEnabled: boolean;
    videoEnabled: boolean;
    screenShareEnabled: boolean;
    chatEnabled: boolean;
}

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

export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
}

export interface DoctorAvailability {
    doctorId: string;
    date: string;
    slots: TimeSlot[];
}

export interface DoctorFilter {
    specialties: string[];
    insurances: string[];
    languages: string[];
    genders: string[];
    maxDistance?: number;
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

export interface PhotoUploadResult {
    url: string;
    thumbnailUrl: string;
    analysisId?: string;
}

export interface SymptomVitals {
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    oxygenSaturation?: number;
    weight?: number;
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
// 1. EXISTING GRAPHQL FUNCTIONS (5) - preserved
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
// 2. APPOINTMENT REST FUNCTIONS (4)
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
// 3. SYMPTOM CHECKER FUNCTIONS (10)
// ===========================================================================

/** Submits symptoms (and optional vitals) for AI analysis. */
export async function analyzeSymptoms(symptoms: string[], vitals?: SymptomVitals): Promise<SymptomCheckResult> {
    const response = await restClient.post<SymptomCheckResult>('/care/symptoms/analyze', { symptoms, vitals });
    return response.data;
}

/** Checks symptoms entered by the user and returns possible diagnoses. */
export async function checkSymptoms(input: {
    symptoms: string[];
    vitals?: SymptomVitals;
}): Promise<SymptomCheckResult> {
    const response = await restClient.post<SymptomCheckResult>('/care/symptoms/check', input);
    return response.data;
}

/** Retrieves condition matches for a given symptom check. */
export async function getConditions(symptomCheckId: string): Promise<ConditionMatch[]> {
    const response = await restClient.get<ConditionMatch[]>(`/care/symptoms/${symptomCheckId}/conditions`);
    return response.data;
}

/** Retrieves the full detail of a specific condition. */
export async function getConditionDetail(conditionId: string): Promise<ConditionDetail> {
    const response = await restClient.get<ConditionDetail>(`/care/conditions/${conditionId}`);
    return response.data;
}

/** Saves a symptom report for a user. */
export async function saveSymptomReport(report: Omit<SymptomReport, 'id' | 'createdAt'>): Promise<SymptomReport> {
    const response = await restClient.post<SymptomReport>('/care/symptoms/reports', report);
    return response.data;
}

/** Retrieves self-care instructions for a given condition. */
export async function getSelfCareInstructions(conditionId: string): Promise<string[]> {
    const response = await restClient.get<string[]>(`/care/conditions/${conditionId}/self-care`);
    return response.data;
}

/** Fetches emergency information including nearest ER. */
export async function getEmergencyInfo(latitude?: number, longitude?: number): Promise<EmergencyInfo> {
    const response = await restClient.get<EmergencyInfo>('/care/emergency', { params: { latitude, longitude } });
    return response.data;
}

/** Retrieves symptom history for a user. */
export async function getSymptomHistory(userId: string): Promise<SymptomReport[]> {
    const response = await restClient.get<SymptomReport[]>('/care/symptoms/history', { params: { userId } });
    return response.data;
}

/** Retrieves the latest vitals for a user. */
export async function getSymptomVitals(userId: string): Promise<SymptomVitals> {
    const response = await restClient.get<SymptomVitals>('/care/symptoms/vitals', { params: { userId } });
    return response.data;
}

/** Uploads a photo for symptom analysis. */
export async function uploadSymptomPhoto(file: FormData): Promise<PhotoUploadResult> {
    const response = await restClient.post<PhotoUploadResult>('/care/symptoms/photo', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

// ===========================================================================
// 4. TELEMEDICINE FUNCTIONS (7)
// ===========================================================================

/** Creates a new telemedicine session for an appointment. */
export async function createTelemedicineSession(appointmentId: string): Promise<TelemedicineSession> {
    const response = await restClient.post<TelemedicineSession>('/care/telemedicine/sessions', { appointmentId });
    return response.data;
}

/** Fetches an existing telemedicine session by ID. */
export async function getTelemedicineSession(sessionId: string): Promise<TelemedicineSession> {
    const response = await restClient.get<TelemedicineSession>(`/care/telemedicine/sessions/${sessionId}`);
    return response.data;
}

/** Joins an existing telemedicine session. */
export async function joinTelemedicineSession(sessionId: string): Promise<TelemedicineSession> {
    const response = await restClient.post<TelemedicineSession>(`/care/telemedicine/sessions/${sessionId}/join`);
    return response.data;
}

/** Ends an active telemedicine session. */
export async function endTelemedicineSession(sessionId: string): Promise<void> {
    await restClient.post(`/care/telemedicine/sessions/${sessionId}/end`);
}

/** Sends a message in a telemedicine session chat. */
export async function sendTelemedicineMessage(
    sessionId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text'
): Promise<TelemedicineMessage> {
    const response = await restClient.post<TelemedicineMessage>(`/care/telemedicine/sessions/${sessionId}/messages`, {
        content,
        type,
    });
    return response.data;
}

/** Retrieves waiting room information for a telemedicine session. */
export async function getWaitingRoom(sessionId: string): Promise<WaitingRoomInfo> {
    const response = await restClient.get<WaitingRoomInfo>(`/care/telemedicine/sessions/${sessionId}/waiting-room`);
    return response.data;
}

/** Retrieves media controls for a telemedicine session. */
export async function getTelemedicineControls(sessionId: string): Promise<TelemedicineControls> {
    const response = await restClient.get<TelemedicineControls>(`/care/telemedicine/sessions/${sessionId}/controls`);
    return response.data;
}

// ===========================================================================
// 5. DOCTOR FUNCTIONS (10)
// ===========================================================================

/** Searches for healthcare providers based on criteria. */
export async function searchProviders(params: {
    specialty?: string;
    name?: string;
    location?: string;
    insurance?: string;
    language?: string;
}): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/providers/search', { params });
    return response.data;
}

/** Retrieves a doctor's full profile. */
export async function getDoctorProfile(doctorId: string): Promise<DoctorProfile> {
    const response = await restClient.get<DoctorProfile>(`/care/doctors/${doctorId}`);
    return response.data;
}

/** Retrieves reviews for a doctor. */
export async function getDoctorReviews(doctorId: string, page?: number): Promise<DoctorReview[]> {
    const response = await restClient.get<DoctorReview[]>(`/care/doctors/${doctorId}/reviews`, {
        params: page !== undefined ? { page } : undefined,
    });
    return response.data;
}

/** Retrieves available time slots for a doctor on a given date. */
export async function getDoctorAvailability(doctorId: string, date: string): Promise<DoctorAvailability> {
    const response = await restClient.get<DoctorAvailability>(`/care/doctors/${doctorId}/availability`, {
        params: { date },
    });
    return response.data;
}

/** Retrieves available filter options for doctor search. */
export async function getDoctorFilters(): Promise<DoctorFilter> {
    const response = await restClient.get<DoctorFilter>('/care/doctors/filters');
    return response.data;
}

/** Saves a doctor as a favourite. */
export async function saveFavoriteDoctor(doctorId: string): Promise<void> {
    await restClient.post(`/care/doctors/${doctorId}/favorite`);
}

/** Removes a doctor from favourites. */
export async function removeFavoriteDoctor(doctorId: string): Promise<void> {
    await restClient.delete(`/care/doctors/${doctorId}/favorite`);
}

/** Retrieves saved/favourite doctors for a user. */
export async function getSavedDoctors(userId: string): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/doctors/saved', { params: { userId } });
    return response.data;
}

/** Searches doctors with optional filters. */
export async function getDoctorSearchList(query: string, filters?: Partial<DoctorFilter>): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/doctors/search', {
        params: { query, ...filters },
    });
    return response.data;
}

// ===========================================================================
// 6. VISIT MANAGEMENT FUNCTIONS (6)
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
// 7. BOOKING FUNCTIONS (5)
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
// 8. PAYMENT FUNCTIONS (2)
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
// 9. MEDICAL RECORDS FUNCTIONS (1)
// ===========================================================================

/** Retrieves medical records for a user, optionally filtered by type. */
export async function getMedicalRecords(userId: string, type?: string): Promise<MedicalRecord[]> {
    const response = await restClient.get<MedicalRecord[]>('/care/medical-records', {
        params: { userId, ...(type ? { type } : {}) },
    });
    return response.data;
}
