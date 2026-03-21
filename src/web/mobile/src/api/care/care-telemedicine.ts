/**
 * Care API - Symptom Checker and Telemedicine functions.
 */

import { AxiosResponse } from 'axios'; // Version 1.6.8 with security enhancements

import { restClient } from '../client';
import { requireSession } from './care-appointments';

// ---------------------------------------------------------------------------
// Interfaces - Symptom Checker
// ---------------------------------------------------------------------------

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

export interface SymptomVitals {
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    oxygenSaturation?: number;
    weight?: number;
}

export interface PhotoUploadResult {
    url: string;
    thumbnailUrl: string;
    analysisId?: string;
}

// ---------------------------------------------------------------------------
// Interfaces - Telemedicine
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Symptom Checker
// ---------------------------------------------------------------------------

/**
 * Submits symptoms (and optional vitals) for AI analysis.
 * @param symptoms - Array of symptom descriptions.
 * @param vitals - Optional vital signs.
 */
export async function analyzeSymptoms(symptoms: string[], vitals?: SymptomVitals): Promise<SymptomCheckResult> {
    const session = await requireSession();
    const response: AxiosResponse<SymptomCheckResult> = await restClient.post(
        '/care/symptoms/analyze',
        { symptoms, vitals },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
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
    const response: AxiosResponse<SymptomCheckResult> = await restClient.post('/care/symptoms/check', input, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves condition matches for a given symptom check.
 * @param symptomCheckId - The symptom check ID.
 */
export async function getConditions(symptomCheckId: string): Promise<ConditionMatch[]> {
    const session = await requireSession();
    const response: AxiosResponse<ConditionMatch[]> = await restClient.get(
        `/care/symptoms/${symptomCheckId}/conditions`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Retrieves the full detail of a specific condition.
 * @param conditionId - The condition to retrieve.
 */
export async function getConditionDetail(conditionId: string): Promise<ConditionDetail> {
    const session = await requireSession();
    const response: AxiosResponse<ConditionDetail> = await restClient.get(`/care/conditions/${conditionId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Saves a symptom report for a user.
 * @param report - Report data without server-generated fields.
 */
export async function saveSymptomReport(report: Omit<SymptomReport, 'id' | 'createdAt'>): Promise<SymptomReport> {
    const session = await requireSession();
    const response: AxiosResponse<SymptomReport> = await restClient.post('/care/symptoms/reports', report, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves self-care instructions for a given condition.
 * @param conditionId - The condition ID.
 */
export async function getSelfCareInstructions(conditionId: string): Promise<string[]> {
    const session = await requireSession();
    const response: AxiosResponse<string[]> = await restClient.get(`/care/conditions/${conditionId}/self-care`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Fetches emergency information including nearest ER.
 * @param latitude - Optional latitude for location-based results.
 * @param longitude - Optional longitude for location-based results.
 */
export async function getEmergencyInfo(latitude?: number, longitude?: number): Promise<EmergencyInfo> {
    const session = await requireSession();
    const response: AxiosResponse<EmergencyInfo> = await restClient.get('/care/emergency', {
        params: { latitude, longitude },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves symptom history for a user.
 * @param userId - The user whose history to retrieve.
 */
export async function getSymptomHistory(userId: string): Promise<SymptomReport[]> {
    const session = await requireSession();
    const response: AxiosResponse<SymptomReport[]> = await restClient.get('/care/symptoms/history', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Retrieves the latest vitals for a user.
 * @param userId - The user whose vitals to retrieve.
 */
export async function getSymptomVitals(userId: string): Promise<SymptomVitals> {
    const session = await requireSession();
    const response: AxiosResponse<SymptomVitals> = await restClient.get('/care/symptoms/vitals', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/**
 * Uploads a photo for symptom analysis.
 * @param file - FormData containing the image file.
 */
export async function uploadSymptomPhoto(file: FormData): Promise<PhotoUploadResult> {
    const session = await requireSession();
    const response: AxiosResponse<PhotoUploadResult> = await restClient.post('/care/symptoms/photo', file, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

// ---------------------------------------------------------------------------
// Telemedicine
// ---------------------------------------------------------------------------

/**
 * Creates a new telemedicine session for an appointment.
 * @param appointmentId - The appointment ID to create a session for.
 */
export async function createTelemedicineSession(appointmentId: string): Promise<TelemedicineSession> {
    const session = await requireSession();
    const response: AxiosResponse<TelemedicineSession> = await restClient.post(
        '/care/telemedicine/sessions',
        { appointmentId },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Fetches an existing telemedicine session by ID.
 * @param sessionId - The session ID to fetch.
 */
export async function getTelemedicineSession(sessionId: string): Promise<TelemedicineSession> {
    const session = await requireSession();
    const response: AxiosResponse<TelemedicineSession> = await restClient.get(
        `/care/telemedicine/sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Joins an existing telemedicine session.
 * @param sessionId - The session to join.
 */
export async function joinTelemedicineSession(sessionId: string): Promise<TelemedicineSession> {
    const session = await requireSession();
    const response: AxiosResponse<TelemedicineSession> = await restClient.post(
        `/care/telemedicine/sessions/${sessionId}/join`,
        undefined,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Ends an active telemedicine session.
 * @param sessionId - The session to end.
 */
export async function endTelemedicineSession(sessionId: string): Promise<void> {
    const session = await requireSession();
    await restClient.post(`/care/telemedicine/sessions/${sessionId}/end`, undefined, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
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
    type: 'text' | 'image' | 'file' = 'text'
): Promise<TelemedicineMessage> {
    const session = await requireSession();
    const response: AxiosResponse<TelemedicineMessage> = await restClient.post(
        `/care/telemedicine/sessions/${sessionId}/messages`,
        { content, type },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Retrieves waiting room information for a telemedicine session.
 * @param sessionId - The session to check.
 */
export async function getWaitingRoom(sessionId: string): Promise<WaitingRoomInfo> {
    const session = await requireSession();
    const response: AxiosResponse<WaitingRoomInfo> = await restClient.get(
        `/care/telemedicine/sessions/${sessionId}/waiting-room`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/**
 * Retrieves media controls for a telemedicine session.
 * @param sessionId - The session to check.
 */
export async function getTelemedicineControls(sessionId: string): Promise<TelemedicineControls> {
    const session = await requireSession();
    const response: AxiosResponse<TelemedicineControls> = await restClient.get(
        `/care/telemedicine/sessions/${sessionId}/controls`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}
