/**
 * Wellness API module for the AUSTA SuperApp mobile application.
 * Provides functions for the AI Wellness Companion journey (Module 06).
 */

import { AxiosResponse } from 'axios';

import { getAuthSession, Session } from './care';
import { restClient } from './client';

// ============ Interfaces ============

export interface CompanionMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    metadata?: Record<string, string>;
}

export interface CompanionChatHistory {
    sessionId: string;
    messages: CompanionMessage[];
    startedAt: string;
    lastMessageAt: string;
}

export interface MoodCheckIn {
    id: string;
    userId: string;
    mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
    energy: number;
    stress: number;
    notes?: string;
    timestamp: string;
}

export interface MoodCheckInPrompt {
    questions: { id: string; text: string; type: 'scale' | 'choice' | 'text' }[];
    previousMood?: MoodCheckIn;
}

export interface BreathingSession {
    id: string;
    userId: string;
    technique: string;
    duration: number;
    cycles: number;
    completedAt: string;
    calmScore?: number;
}

export interface MeditationSession {
    id: string;
    userId: string;
    type: string;
    duration: number;
    audioUrl?: string;
    completedAt: string;
    feedback?: string;
}

export interface DailyWellnessPlan {
    id: string;
    userId: string;
    date: string;
    activities: WellnessActivity[];
    completedCount: number;
    totalCount: number;
}

export interface WellnessActivity {
    id: string;
    type: 'breathing' | 'meditation' | 'journal' | 'exercise' | 'social' | 'nutrition';
    title: string;
    description: string;
    duration: number;
    completed: boolean;
    scheduledTime?: string;
}

export interface WellnessInsight {
    id: string;
    userId: string;
    type: string;
    title: string;
    description: string;
    metric?: string;
    trend?: 'improving' | 'stable' | 'declining';
    createdAt: string;
}

export interface WellnessGoal {
    id: string;
    userId: string;
    category: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline?: string;
    status: 'active' | 'completed' | 'paused';
}

export interface JournalEntry {
    id: string;
    userId: string;
    title: string;
    content: string;
    mood?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface JournalHistory {
    entries: JournalEntry[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface WellnessChallenge {
    id: string;
    name: string;
    description: string;
    type: string;
    duration: number;
    target: number;
    progress: number;
    participants: number;
    startDate: string;
    endDate: string;
    joined: boolean;
}

export interface WellnessChallengeDetail extends WellnessChallenge {
    rules: string[];
    rewards: string[];
    leaderboard: { userId: string; name: string; progress: number }[];
    milestones: { target: number; label: string; reached: boolean }[];
}

export interface WellnessStreak {
    id: string;
    userId: string;
    type: string;
    currentCount: number;
    longestCount: number;
    lastActivityDate: string;
    startDate: string;
}

// ============ Auth helper ============

/** Requires an authenticated session or throws. */
async function requireSession(): Promise<Session> {
    const session = await getAuthSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return session;
}

// ============ Companion Chat ============

/** Sends a message to the AI wellness companion. */
export async function sendCompanionMessage(
    userId: string,
    content: string,
    sessionId?: string
): Promise<CompanionMessage> {
    const session = await requireSession();
    const response: AxiosResponse<CompanionMessage> = await restClient.post(
        '/wellness/companion/messages',
        { userId, content, sessionId },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/** Retrieves the chat history with the AI wellness companion. */
export async function getCompanionHistory(userId: string, sessionId?: string): Promise<CompanionChatHistory> {
    const session = await requireSession();
    const response: AxiosResponse<CompanionChatHistory> = await restClient.get('/wellness/companion/history', {
        params: { userId, sessionId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Retrieves the mood check-in prompt with contextual questions. */
export async function getMoodCheckInPrompt(userId: string): Promise<MoodCheckInPrompt> {
    const session = await requireSession();
    const response: AxiosResponse<MoodCheckInPrompt> = await restClient.get('/wellness/companion/mood-prompt', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Submits a mood check-in for a user. */
export async function submitMoodCheckIn(
    userId: string,
    checkIn: Omit<MoodCheckIn, 'id' | 'userId' | 'timestamp'>
): Promise<MoodCheckIn> {
    const session = await requireSession();
    const response: AxiosResponse<MoodCheckIn> = await restClient.post(
        '/wellness/companion/mood',
        { userId, ...checkIn },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

// ============ Sessions ============

/** Starts a guided breathing session. */
export async function startBreathingSession(
    userId: string,
    technique: string,
    duration: number
): Promise<BreathingSession> {
    const session = await requireSession();
    const response: AxiosResponse<BreathingSession> = await restClient.post(
        '/wellness/sessions/breathing',
        { userId, technique, duration },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/** Starts a guided meditation session. */
export async function startMeditationSession(
    userId: string,
    type: string,
    duration: number
): Promise<MeditationSession> {
    const session = await requireSession();
    const response: AxiosResponse<MeditationSession> = await restClient.post(
        '/wellness/sessions/meditation',
        { userId, type, duration },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/** Retrieves the daily wellness plan for a user. */
export async function getDailyPlan(userId: string, date?: string): Promise<DailyWellnessPlan> {
    const session = await requireSession();
    const response: AxiosResponse<DailyWellnessPlan> = await restClient.get('/wellness/daily-plan', {
        params: { userId, date },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

// ============ Insights & Goals ============

/** Retrieves AI-generated wellness insights for a user. */
export async function getWellnessInsights(userId: string): Promise<WellnessInsight[]> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessInsight[]> = await restClient.get('/wellness/insights', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Retrieves wellness goals for a user. */
export async function getWellnessGoals(userId: string): Promise<WellnessGoal[]> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessGoal[]> = await restClient.get('/wellness/goals', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Updates a wellness goal. */
export async function updateWellnessGoal(goalId: string, updates: Partial<WellnessGoal>): Promise<WellnessGoal> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessGoal> = await restClient.put(`/wellness/goals/${goalId}`, updates, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

// ============ Journal ============

/** Retrieves paginated journal entries for a user. */
export async function getJournalEntries(userId: string, page?: number, pageSize?: number): Promise<JournalHistory> {
    const session = await requireSession();
    const response: AxiosResponse<JournalHistory> = await restClient.get('/wellness/journal', {
        params: { userId, page, pageSize },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Creates a new journal entry. */
export async function createJournalEntry(
    userId: string,
    entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> {
    const session = await requireSession();
    const response: AxiosResponse<JournalEntry> = await restClient.post(
        '/wellness/journal',
        { userId, ...entry },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/** Retrieves journal history for a date range. */
export async function getJournalHistory(userId: string, startDate?: string, endDate?: string): Promise<JournalEntry[]> {
    const session = await requireSession();
    const response: AxiosResponse<JournalEntry[]> = await restClient.get('/wellness/journal/history', {
        params: { userId, startDate, endDate },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

// ============ Challenges ============

/** Retrieves available wellness challenges for a user. */
export async function getWellnessChallenges(userId: string): Promise<WellnessChallenge[]> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessChallenge[]> = await restClient.get('/wellness/challenges', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Retrieves full details for a specific wellness challenge. */
export async function getWellnessChallengeDetail(challengeId: string): Promise<WellnessChallengeDetail> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessChallengeDetail> = await restClient.get(
        `/wellness/challenges/${challengeId}`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

/** Joins a wellness challenge. */
export async function joinWellnessChallenge(userId: string, challengeId: string): Promise<WellnessChallenge> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessChallenge> = await restClient.post(
        `/wellness/challenges/${challengeId}/join`,
        { userId },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

// ============ Streaks ============

/** Retrieves wellness streaks for a user. */
export async function getWellnessStreaks(userId: string): Promise<WellnessStreak[]> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessStreak[]> = await restClient.get('/wellness/streaks', {
        params: { userId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Records activity and updates a wellness streak. */
export async function updateWellnessStreak(userId: string, type: string): Promise<WellnessStreak> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessStreak> = await restClient.post(
        '/wellness/streaks/update',
        { userId, type },
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    return response.data;
}

// ============ Wellness Tips ============

/** Retrieves a personalized wellness tip for the user. */
export async function getWellnessTip(userId: string, category?: string): Promise<WellnessInsight> {
    const session = await requireSession();
    const response: AxiosResponse<WellnessInsight> = await restClient.get('/wellness/tips', {
        params: { userId, category },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}

/** Retrieves quick reply suggestions for the companion chat. */
export async function getCompanionQuickReplies(userId: string, sessionId: string): Promise<string[]> {
    const session = await requireSession();
    const response: AxiosResponse<string[]> = await restClient.get('/wellness/companion/quick-replies', {
        params: { userId, sessionId },
        headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    return response.data;
}
