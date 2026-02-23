/**
 * API module for interacting with the Care Service backend.
 * Provides functions for booking appointments, checking symptoms,
 * and accessing telemedicine features for the Care Now Journey (F-102).
 */

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restClient } from './client';

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
async function requireSession(): Promise<Session> {
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
export async function bookAppointment(
  appointmentDetails: Omit<Appointment, 'id' | 'status'>,
): Promise<Appointment> {
  const session = await requireSession();
  const response: AxiosResponse<Appointment> = await restClient.post(
    '/care/appointments',
    appointmentDetails,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Fetches all appointments for a given user.
 * @param userId - The user whose appointments to retrieve.
 */
export async function getAppointments(userId: string): Promise<Appointment[]> {
  const session = await requireSession();
  const response: AxiosResponse<Appointment[]> = await restClient.get(
    '/care/appointments',
    {
      params: { userId },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Fetches the full detail of a single appointment.
 * @param appointmentId - The appointment to retrieve.
 */
export async function getAppointmentDetail(
  appointmentId: string,
): Promise<AppointmentDetail> {
  const session = await requireSession();
  const response: AxiosResponse<AppointmentDetail> = await restClient.get(
    `/care/appointments/${appointmentId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Cancels an existing appointment.
 * @param appointmentId - The appointment to cancel.
 * @param reason - Optional cancellation reason.
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string,
): Promise<void> {
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
export async function rescheduleAppointment(
  appointmentId: string,
  newDateTime: string,
): Promise<Appointment> {
  const session = await requireSession();
  const response: AxiosResponse<Appointment> = await restClient.put(
    `/care/appointments/${appointmentId}/reschedule`,
    { newDateTime },
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Marks an appointment as a no-show.
 * @param appointmentId - The appointment to mark.
 */
export async function markNoShow(appointmentId: string): Promise<void> {
  const session = await requireSession();
  await restClient.post(
    `/care/appointments/${appointmentId}/no-show`,
    undefined,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
}

// ---------------------------------------------------------------------------
// Symptom Checker
// ---------------------------------------------------------------------------

/**
 * Submits symptoms (and optional vitals) for AI analysis.
 * @param symptoms - Array of symptom descriptions.
 * @param vitals - Optional vital signs.
 */
export async function analyzeSymptoms(
  symptoms: string[],
  vitals?: SymptomVitals,
): Promise<SymptomCheckResult> {
  const session = await requireSession();
  const response: AxiosResponse<SymptomCheckResult> = await restClient.post(
    '/care/symptoms/analyze',
    { symptoms, vitals },
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Checks symptoms entered by the user and returns possible diagnoses.
 * @param input - Object containing symptom list and optional vitals.
 * @returns Symptom check results with possible conditions.
 */
export async function checkSymptoms(input: {
  symptoms: string[];
  vitals?: SymptomVitals;
}): Promise<SymptomCheckResult> {
  const session = await requireSession();
  const response: AxiosResponse<SymptomCheckResult> = await restClient.post(
    '/care/symptoms/check',
    input,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves condition matches for a given symptom check.
 * @param symptomCheckId - The symptom check ID.
 */
export async function getConditions(
  symptomCheckId: string,
): Promise<ConditionMatch[]> {
  const session = await requireSession();
  const response: AxiosResponse<ConditionMatch[]> = await restClient.get(
    `/care/symptoms/${symptomCheckId}/conditions`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves the full detail of a specific condition.
 * @param conditionId - The condition to retrieve.
 */
export async function getConditionDetail(
  conditionId: string,
): Promise<ConditionDetail> {
  const session = await requireSession();
  const response: AxiosResponse<ConditionDetail> = await restClient.get(
    `/care/conditions/${conditionId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Saves a symptom report for a user.
 * @param report - Report data without server-generated fields.
 */
export async function saveSymptomReport(
  report: Omit<SymptomReport, 'id' | 'createdAt'>,
): Promise<SymptomReport> {
  const session = await requireSession();
  const response: AxiosResponse<SymptomReport> = await restClient.post(
    '/care/symptoms/reports',
    report,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves self-care instructions for a given condition.
 * @param conditionId - The condition ID.
 */
export async function getSelfCareInstructions(
  conditionId: string,
): Promise<string[]> {
  const session = await requireSession();
  const response: AxiosResponse<string[]> = await restClient.get(
    `/care/conditions/${conditionId}/self-care`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Fetches emergency information including nearest ER.
 * @param latitude - Optional latitude for location-based results.
 * @param longitude - Optional longitude for location-based results.
 */
export async function getEmergencyInfo(
  latitude?: number,
  longitude?: number,
): Promise<EmergencyInfo> {
  const session = await requireSession();
  const response: AxiosResponse<EmergencyInfo> = await restClient.get(
    '/care/emergency',
    {
      params: { latitude, longitude },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Retrieves symptom history for a user.
 * @param userId - The user whose history to retrieve.
 */
export async function getSymptomHistory(
  userId: string,
): Promise<SymptomReport[]> {
  const session = await requireSession();
  const response: AxiosResponse<SymptomReport[]> = await restClient.get(
    '/care/symptoms/history',
    {
      params: { userId },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Retrieves the latest vitals for a user.
 * @param userId - The user whose vitals to retrieve.
 */
export async function getSymptomVitals(
  userId: string,
): Promise<SymptomVitals> {
  const session = await requireSession();
  const response: AxiosResponse<SymptomVitals> = await restClient.get(
    '/care/symptoms/vitals',
    {
      params: { userId },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Uploads a photo for symptom analysis.
 * @param file - FormData containing the image file.
 */
export async function uploadSymptomPhoto(
  file: FormData,
): Promise<PhotoUploadResult> {
  const session = await requireSession();
  const response: AxiosResponse<PhotoUploadResult> = await restClient.post(
    '/care/symptoms/photo',
    file,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Telemedicine
// ---------------------------------------------------------------------------

/**
 * Creates a new telemedicine session for an appointment.
 * @param appointmentId - The appointment ID to create a session for.
 */
export async function createTelemedicineSession(
  appointmentId: string,
): Promise<TelemedicineSession> {
  const session = await requireSession();
  const response: AxiosResponse<TelemedicineSession> = await restClient.post(
    '/care/telemedicine/sessions',
    { appointmentId },
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Fetches an existing telemedicine session by ID.
 * @param sessionId - The session ID to fetch.
 */
export async function getTelemedicineSession(
  sessionId: string,
): Promise<TelemedicineSession> {
  const session = await requireSession();
  const response: AxiosResponse<TelemedicineSession> = await restClient.get(
    `/care/telemedicine/sessions/${sessionId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Joins an existing telemedicine session.
 * @param sessionId - The session to join.
 */
export async function joinTelemedicineSession(
  sessionId: string,
): Promise<TelemedicineSession> {
  const session = await requireSession();
  const response: AxiosResponse<TelemedicineSession> = await restClient.post(
    `/care/telemedicine/sessions/${sessionId}/join`,
    undefined,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Ends an active telemedicine session.
 * @param sessionId - The session to end.
 */
export async function endTelemedicineSession(
  sessionId: string,
): Promise<void> {
  const session = await requireSession();
  await restClient.post(
    `/care/telemedicine/sessions/${sessionId}/end`,
    undefined,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
}

/**
 * Sends a message in a telemedicine session chat.
 * @param sessionId - The session to send the message in.
 * @param content - The message content.
 * @param type - The message type (text, image, or file).
 */
export async function sendTelemedicineMessage(
  sessionId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
): Promise<TelemedicineMessage> {
  const session = await requireSession();
  const response: AxiosResponse<TelemedicineMessage> = await restClient.post(
    `/care/telemedicine/sessions/${sessionId}/messages`,
    { content, type },
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves waiting room information for a telemedicine session.
 * @param sessionId - The session to check.
 */
export async function getWaitingRoom(
  sessionId: string,
): Promise<WaitingRoomInfo> {
  const session = await requireSession();
  const response: AxiosResponse<WaitingRoomInfo> = await restClient.get(
    `/care/telemedicine/sessions/${sessionId}/waiting-room`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves media controls for a telemedicine session.
 * @param sessionId - The session to check.
 */
export async function getTelemedicineControls(
  sessionId: string,
): Promise<TelemedicineControls> {
  const session = await requireSession();
  const response: AxiosResponse<TelemedicineControls> = await restClient.get(
    `/care/telemedicine/sessions/${sessionId}/controls`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
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
  const response: AxiosResponse<DoctorProfile[]> = await restClient.get(
    '/care/providers/search',
    {
      params,
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Retrieves a doctor's full profile.
 * @param doctorId - The doctor to retrieve.
 */
export async function getDoctorProfile(
  doctorId: string,
): Promise<DoctorProfile> {
  const session = await requireSession();
  const response: AxiosResponse<DoctorProfile> = await restClient.get(
    `/care/doctors/${doctorId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves reviews for a doctor.
 * @param doctorId - The doctor whose reviews to fetch.
 * @param page - Optional page number for pagination.
 */
export async function getDoctorReviews(
  doctorId: string,
  page?: number,
): Promise<DoctorReview[]> {
  const session = await requireSession();
  const response: AxiosResponse<DoctorReview[]> = await restClient.get(
    `/care/doctors/${doctorId}/reviews`,
    {
      params: page !== undefined ? { page } : undefined,
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Retrieves available time slots for a doctor on a given date.
 * @param doctorId - The doctor to check.
 * @param date - The date in ISO format (YYYY-MM-DD).
 */
export async function getDoctorAvailability(
  doctorId: string,
  date: string,
): Promise<DoctorAvailability> {
  const session = await requireSession();
  const response: AxiosResponse<DoctorAvailability> = await restClient.get(
    `/care/doctors/${doctorId}/availability`,
    {
      params: { date },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Retrieves available filter options for doctor search.
 */
export async function getDoctorFilters(): Promise<DoctorFilter> {
  const session = await requireSession();
  const response: AxiosResponse<DoctorFilter> = await restClient.get(
    '/care/doctors/filters',
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Saves a doctor as a favourite.
 * @param doctorId - The doctor to save.
 */
export async function saveFavoriteDoctor(doctorId: string): Promise<void> {
  const session = await requireSession();
  await restClient.post(
    `/care/doctors/${doctorId}/favorite`,
    undefined,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
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
  const response: AxiosResponse<DoctorProfile[]> = await restClient.get(
    '/care/doctors/saved',
    {
      params: { userId },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Searches doctors with optional filters.
 * @param query - The search query string.
 * @param filters - Optional filter criteria.
 */
export async function getDoctorSearchList(
  query: string,
  filters?: Partial<DoctorFilter>,
): Promise<DoctorProfile[]> {
  const session = await requireSession();
  const response: AxiosResponse<DoctorProfile[]> = await restClient.get(
    '/care/doctors/search',
    {
      params: { query, ...filters },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
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
  const response: AxiosResponse<VisitSummary> = await restClient.get(
    `/care/visits/${visitId}/summary`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves follow-up instructions for a visit.
 * @param visitId - The visit to check.
 */
export async function getFollowUp(
  visitId: string,
): Promise<{ date: string; instructions: string }> {
  const session = await requireSession();
  const response: AxiosResponse<{ date: string; instructions: string }> =
    await restClient.get(`/care/visits/${visitId}/follow-up`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
  return response.data;
}

/**
 * Retrieves prescriptions issued during a visit.
 * @param visitId - The visit to check.
 */
export async function getVisitPrescriptions(
  visitId: string,
): Promise<Prescription[]> {
  const session = await requireSession();
  const response: AxiosResponse<Prescription[]> = await restClient.get(
    `/care/visits/${visitId}/prescriptions`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves lab orders associated with a visit.
 * @param visitId - The visit to check.
 */
export async function getLabOrders(visitId: string): Promise<LabOrder[]> {
  const session = await requireSession();
  const response: AxiosResponse<LabOrder[]> = await restClient.get(
    `/care/visits/${visitId}/lab-orders`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves a referral associated with a visit.
 * @param visitId - The visit to check.
 */
export async function getReferral(visitId: string): Promise<Referral> {
  const session = await requireSession();
  const response: AxiosResponse<Referral> = await restClient.get(
    `/care/visits/${visitId}/referral`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves the pre-visit checklist for an appointment.
 * @param appointmentId - The appointment to check.
 */
export async function getPreVisitChecklist(
  appointmentId: string,
): Promise<PreVisitChecklist> {
  const session = await requireSession();
  const response: AxiosResponse<PreVisitChecklist> = await restClient.get(
    `/care/appointments/${appointmentId}/checklist`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

/**
 * Retrieves available booking types for a doctor.
 * @param doctorId - The doctor whose booking types to fetch.
 */
export async function getBookingTypes(
  doctorId: string,
): Promise<BookingType[]> {
  const session = await requireSession();
  const response: AxiosResponse<BookingType[]> = await restClient.get(
    `/care/doctors/${doctorId}/booking-types`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves available time slots for a specific booking type and date.
 * @param doctorId - The doctor to check.
 * @param typeId - The booking type ID.
 * @param date - The date in ISO format (YYYY-MM-DD).
 */
export async function getBookingSchedule(
  doctorId: string,
  typeId: string,
  date: string,
): Promise<TimeSlot[]> {
  const session = await requireSession();
  const response: AxiosResponse<TimeSlot[]> = await restClient.get(
    '/care/booking/schedule',
    {
      params: { doctorId, typeId, date },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}

/**
 * Confirms a booking and returns the confirmation details.
 * @param appointmentId - The appointment to confirm.
 */
export async function confirmBooking(
  appointmentId: string,
): Promise<BookingConfirmation> {
  const session = await requireSession();
  const response: AxiosResponse<BookingConfirmation> = await restClient.post(
    `/care/booking/${appointmentId}/confirm`,
    undefined,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Submits insurance information for a booking.
 * @param appointmentId - The appointment to attach insurance to.
 * @param insurance - The insurance submission data.
 */
export async function submitInsurance(
  appointmentId: string,
  insurance: InsuranceSubmission,
): Promise<void> {
  const session = await requireSession();
  await restClient.post(
    `/care/booking/${appointmentId}/insurance`,
    insurance,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
}

/**
 * Uploads documents for a booking (e.g. ID, referral letter).
 * @param appointmentId - The appointment to attach documents to.
 * @param documents - FormData containing the document files.
 * @returns Array of uploaded document URLs.
 */
export async function uploadBookingDocuments(
  appointmentId: string,
  documents: FormData,
): Promise<string[]> {
  const session = await requireSession();
  const response: AxiosResponse<string[]> = await restClient.post(
    `/care/booking/${appointmentId}/documents`,
    documents,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    },
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
export async function getPaymentSummary(
  appointmentId: string,
): Promise<PaymentSummary> {
  const session = await requireSession();
  const response: AxiosResponse<PaymentSummary> = await restClient.get(
    `/care/payments/${appointmentId}/summary`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
  return response.data;
}

/**
 * Retrieves a payment receipt.
 * @param paymentId - The payment whose receipt to fetch.
 */
export async function getPaymentReceipt(
  paymentId: string,
): Promise<PaymentReceipt> {
  const session = await requireSession();
  const response: AxiosResponse<PaymentReceipt> = await restClient.get(
    `/care/payments/${paymentId}/receipt`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } },
  );
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
export async function getMedicalRecords(
  userId: string,
  type?: string,
): Promise<MedicalRecord[]> {
  const session = await requireSession();
  const response: AxiosResponse<MedicalRecord[]> = await restClient.get(
    '/care/medical-records',
    {
      params: { userId, ...(type ? { type } : {}) },
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return response.data;
}
