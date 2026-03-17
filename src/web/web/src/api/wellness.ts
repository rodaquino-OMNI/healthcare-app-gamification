/**
 * Wellness API module for the AUSTA SuperApp web application.
 * Provides functions for the AI Wellness Companion journey (Module 06).
 * Ported from the mobile reference — web pattern uses restClient directly
 * (auth is handled via interceptors in client.ts, no manual token attachment needed).
 */

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

// ============ Companion Chat ============

/** Sends a message to the AI wellness companion. */
export async function sendCompanionMessage(
    userId: string,
    content: string,
    sessionId?: string
): Promise<CompanionMessage> {
    try {
        const response = await restClient.post<CompanionMessage>('/wellness/companion/messages', {
            userId,
            content,
            sessionId,
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to send companion message');
    }
}

/** Retrieves the chat history with the AI wellness companion. */
export async function getCompanionHistory(userId: string, sessionId?: string): Promise<CompanionChatHistory> {
    try {
        const response = await restClient.get<CompanionChatHistory>('/wellness/companion/history', {
            params: { userId, sessionId },
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve companion history');
    }
}

/** Retrieves the mood check-in prompt with contextual questions. */
export async function getMoodCheckInPrompt(userId: string): Promise<MoodCheckInPrompt> {
    try {
        const response = await restClient.get<MoodCheckInPrompt>('/wellness/companion/mood-prompt', {
            params: { userId },
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve mood check-in prompt');
    }
}

/** Submits a mood check-in for a user. */
export async function submitMoodCheckIn(
    userId: string,
    checkIn: Omit<MoodCheckIn, 'id' | 'userId' | 'timestamp'>
): Promise<MoodCheckIn> {
    try {
        const response = await restClient.post<MoodCheckIn>('/wellness/companion/mood', { userId, ...checkIn });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to submit mood check-in');
    }
}

// ============ Sessions ============

/** Starts a guided breathing session. */
export async function startBreathingSession(
    userId: string,
    technique: string,
    duration: number
): Promise<BreathingSession> {
    try {
        const response = await restClient.post<BreathingSession>('/wellness/sessions/breathing', {
            userId,
            technique,
            duration,
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to start breathing session');
    }
}

/** Starts a guided meditation session. */
export async function startMeditationSession(
    userId: string,
    type: string,
    duration: number
): Promise<MeditationSession> {
    try {
        const response = await restClient.post<MeditationSession>('/wellness/sessions/meditation', {
            userId,
            type,
            duration,
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to start meditation session');
    }
}

/** Retrieves the daily wellness plan for a user. */
export async function getDailyPlan(userId: string, date?: string): Promise<DailyWellnessPlan> {
    try {
        const response = await restClient.get<DailyWellnessPlan>('/wellness/daily-plan', { params: { userId, date } });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve daily wellness plan');
    }
}

// ============ Insights & Goals ============

/** Retrieves AI-generated wellness insights for a user. */
export async function getWellnessInsights(userId: string): Promise<WellnessInsight[]> {
    try {
        const response = await restClient.get<WellnessInsight[]>('/wellness/insights', { params: { userId } });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve wellness insights');
    }
}

/** Retrieves wellness goals for a user. */
export async function getWellnessGoals(userId: string): Promise<WellnessGoal[]> {
    try {
        const response = await restClient.get<WellnessGoal[]>('/wellness/goals', { params: { userId } });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve wellness goals');
    }
}

/** Updates a wellness goal. */
export async function updateWellnessGoal(goalId: string, updates: Partial<WellnessGoal>): Promise<WellnessGoal> {
    try {
        const response = await restClient.put<WellnessGoal>(`/wellness/goals/${goalId}`, updates);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to update wellness goal');
    }
}

// ============ Journal ============

/** Retrieves paginated journal entries for a user. */
export async function getJournalEntries(userId: string, page?: number, pageSize?: number): Promise<JournalHistory> {
    try {
        const response = await restClient.get<JournalHistory>('/wellness/journal', {
            params: { userId, page, pageSize },
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve journal entries');
    }
}

/** Creates a new journal entry. */
export async function createJournalEntry(
    userId: string,
    entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> {
    try {
        const response = await restClient.post<JournalEntry>('/wellness/journal', { userId, ...entry });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to create journal entry');
    }
}

/** Retrieves journal history for a date range. */
export async function getJournalHistory(userId: string, startDate?: string, endDate?: string): Promise<JournalEntry[]> {
    try {
        const response = await restClient.get<JournalEntry[]>('/wellness/journal/history', {
            params: { userId, startDate, endDate },
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve journal history');
    }
}

// ============ Challenges ============

/** Retrieves available wellness challenges for a user. */
export async function getWellnessChallenges(userId: string): Promise<WellnessChallenge[]> {
    try {
        const response = await restClient.get<WellnessChallenge[]>('/wellness/challenges', { params: { userId } });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve wellness challenges');
    }
}

/** Retrieves full details for a specific wellness challenge. */
export async function getWellnessChallengeDetail(challengeId: string): Promise<WellnessChallengeDetail> {
    try {
        const response = await restClient.get<WellnessChallengeDetail>(`/wellness/challenges/${challengeId}`);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve wellness challenge detail');
    }
}

/** Joins a wellness challenge. */
export async function joinWellnessChallenge(userId: string, challengeId: string): Promise<WellnessChallenge> {
    try {
        const response = await restClient.post<WellnessChallenge>(`/wellness/challenges/${challengeId}/join`, {
            userId,
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to join wellness challenge');
    }
}

// ============ Streaks ============

/** Retrieves wellness streaks for a user. */
export async function getWellnessStreaks(userId: string): Promise<WellnessStreak[]> {
    try {
        const response = await restClient.get<WellnessStreak[]>('/wellness/streaks', { params: { userId } });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve wellness streaks');
    }
}

/** Records activity and updates a wellness streak. */
export async function updateWellnessStreak(userId: string, type: string): Promise<WellnessStreak> {
    try {
        const response = await restClient.post<WellnessStreak>('/wellness/streaks/update', { userId, type });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to update wellness streak');
    }
}

// ============ Wellness Tips ============

/** Retrieves a personalized wellness tip for the user. */
export async function getWellnessTip(userId: string, category?: string): Promise<WellnessInsight> {
    try {
        const response = await restClient.get<WellnessInsight>('/wellness/tips', { params: { userId, category } });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve wellness tip');
    }
}

/** Retrieves quick reply suggestions for the companion chat. */
export async function getCompanionQuickReplies(userId: string, sessionId: string): Promise<string[]> {
    try {
        const response = await restClient.get<string[]>('/wellness/companion/quick-replies', {
            params: { userId, sessionId },
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve companion quick replies');
    }
}

// ============ Additional Wellness Functions ============

/** Deletes a journal entry by ID. */
export async function deleteJournalEntry(entryId: string): Promise<void> {
    try {
        await restClient.delete(`/wellness/journal/${entryId}`);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to delete journal entry');
    }
}

/** Updates an existing journal entry. */
export async function updateJournalEntry(
    entryId: string,
    updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<JournalEntry> {
    try {
        const response = await restClient.put<JournalEntry>(`/wellness/journal/${entryId}`, updates);
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to update journal entry');
    }
}

/** Leaves a wellness challenge. */
export async function leaveWellnessChallenge(userId: string, challengeId: string): Promise<void> {
    try {
        await restClient.post(`/wellness/challenges/${challengeId}/leave`, { userId });
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to leave wellness challenge');
    }
}

/** Retrieves the leaderboard for a wellness challenge. */
export async function getWellnessChallengeLeaderboard(
    challengeId: string
): Promise<Array<{ userId: string; name: string; progress: number; rank: number }>> {
    try {
        const response = await restClient.get<Array<{ userId: string; name: string; progress: number; rank: number }>>(
            `/wellness/challenges/${challengeId}/leaderboard`
        );
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve challenge leaderboard');
    }
}

/** Creates a new wellness goal for a user. */
export async function createWellnessGoal(
    userId: string,
    goal: Omit<WellnessGoal, 'id' | 'userId' | 'current' | 'status'>
): Promise<WellnessGoal> {
    try {
        const response = await restClient.post<WellnessGoal>('/wellness/goals', { userId, ...goal });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to create wellness goal');
    }
}

/** Deletes a wellness goal by ID. */
export async function deleteWellnessGoal(goalId: string): Promise<void> {
    try {
        await restClient.delete(`/wellness/goals/${goalId}`);
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to delete wellness goal');
    }
}

/** Retrieves mood history for a user within an optional date range. */
export async function getMoodHistory(userId: string, startDate?: string, endDate?: string): Promise<MoodCheckIn[]> {
    try {
        const response = await restClient.get<MoodCheckIn[]>('/wellness/companion/mood-history', {
            params: { userId, startDate, endDate },
        });
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve mood history');
    }
}

/** Retrieves available breathing techniques. */
export async function getBreathingTechniques(): Promise<
    Array<{ id: string; name: string; description: string; durationMinutes: number }>
> {
    try {
        const response = await restClient.get<
            Array<{ id: string; name: string; description: string; durationMinutes: number }>
        >('/wellness/sessions/breathing/techniques');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve breathing techniques');
    }
}

/** Retrieves available meditation types. */
export async function getMeditationTypes(): Promise<
    Array<{ id: string; name: string; description: string; audioUrl?: string }>
> {
    try {
        const response = await restClient.get<
            Array<{ id: string; name: string; description: string; audioUrl?: string }>
        >('/wellness/sessions/meditation/types');
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to retrieve meditation types');
    }
}

/** Completes a wellness activity and returns the updated daily plan. */
export async function completeWellnessActivity(userId: string, activityId: string): Promise<DailyWellnessPlan> {
    try {
        const response = await restClient.post<DailyWellnessPlan>(
            `/wellness/daily-plan/activities/${activityId}/complete`,
            { userId }
        );
        return response.data;
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error('Failed to complete wellness activity');
    }
}
