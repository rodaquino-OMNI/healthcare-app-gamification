/**
 * Care Telemedicine & Symptom Checker API Module
 *
 * Handles symptom analysis, condition lookup, telemedicine sessions,
 * waiting rooms, and session messaging for the Care Now Journey.
 */

import { restClient } from '../client';

// ---------------------------------------------------------------------------
// Symptom Interfaces
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
// Telemedicine Interfaces
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

// ===========================================================================
// 1. SYMPTOM CHECKER FUNCTIONS (10)
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
// 2. TELEMEDICINE FUNCTIONS (7)
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
// 3. ADDITIONAL TELEMEDICINE FUNCTIONS (1)
// ===========================================================================

/** Retrieves messages from a telemedicine session. */
export async function getTelemedicineMessages(sessionId: string): Promise<TelemedicineMessage[]> {
    const response = await restClient.get<TelemedicineMessage[]>(`/care/telemedicine/sessions/${sessionId}/messages`);
    return response.data;
}
