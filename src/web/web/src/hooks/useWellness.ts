import { useState, useCallback } from 'react';

import {
    sendCompanionMessage,
    getCompanionHistory,
    getCompanionQuickReplies,
    getMoodCheckInPrompt,
    submitMoodCheckIn,
    startBreathingSession,
    startMeditationSession,
    getDailyPlan,
    getWellnessInsights,
    getWellnessGoals,
    updateWellnessGoal,
    getJournalEntries,
    createJournalEntry,
    getJournalHistory,
    getWellnessChallenges,
    getWellnessChallengeDetail,
    joinWellnessChallenge,
    getWellnessStreaks,
    updateWellnessStreak,
    getWellnessTip,
    type CompanionMessage,
    type CompanionChatHistory,
    type MoodCheckIn,
    type MoodCheckInPrompt,
    type BreathingSession,
    type MeditationSession,
    type DailyWellnessPlan,
    type WellnessInsight,
    type WellnessGoal,
    type JournalEntry,
    type JournalHistory,
    type WellnessChallenge,
    type WellnessChallengeDetail,
    type WellnessStreak,
} from '@/api/wellness';

export type {
    CompanionMessage,
    CompanionChatHistory,
    MoodCheckIn,
    MoodCheckInPrompt,
    BreathingSession,
    MeditationSession,
    DailyWellnessPlan,
    WellnessActivity,
    WellnessInsight,
    WellnessGoal,
    JournalEntry,
    JournalHistory,
    WellnessChallenge,
    WellnessChallengeDetail,
    WellnessStreak,
} from '@/api/wellness';

interface UseWellnessReturn {
    // Companion chat
    chatHistory: CompanionChatHistory | null;
    quickReplies: string[];
    sendMessage: (userId: string, content: string, sessionId?: string) => Promise<CompanionMessage>;
    loadChatHistory: (userId: string, sessionId?: string) => Promise<void>;
    loadQuickReplies: (userId: string, sessionId: string) => Promise<void>;
    // Mood
    moodPrompt: MoodCheckInPrompt | null;
    loadMoodPrompt: (userId: string) => Promise<void>;
    submitMood: (userId: string, checkIn: Omit<MoodCheckIn, 'id' | 'userId' | 'timestamp'>) => Promise<MoodCheckIn>;
    // Sessions
    startBreathing: (userId: string, technique: string, duration: number) => Promise<BreathingSession>;
    startMeditation: (userId: string, type: string, duration: number) => Promise<MeditationSession>;
    // Daily plan
    dailyPlan: DailyWellnessPlan | null;
    loadDailyPlan: (userId: string, date?: string) => Promise<void>;
    // Insights & Goals
    insights: WellnessInsight[];
    goals: WellnessGoal[];
    loadInsights: (userId: string) => Promise<void>;
    loadGoals: (userId: string) => Promise<void>;
    updateGoal: (goalId: string, updates: Partial<WellnessGoal>) => Promise<WellnessGoal>;
    // Journal
    journalEntries: JournalHistory | null;
    journalHistory: JournalEntry[];
    loadJournal: (userId: string, page?: number, pageSize?: number) => Promise<void>;
    createEntry: (
        userId: string,
        entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => Promise<JournalEntry>;
    loadJournalHistory: (userId: string, startDate?: string, endDate?: string) => Promise<void>;
    // Challenges
    challenges: WellnessChallenge[];
    challengeDetail: WellnessChallengeDetail | null;
    loadChallenges: (userId: string) => Promise<void>;
    loadChallengeDetail: (challengeId: string) => Promise<void>;
    joinChallenge: (userId: string, challengeId: string) => Promise<WellnessChallenge>;
    // Streaks
    streaks: WellnessStreak[];
    loadStreaks: (userId: string) => Promise<void>;
    updateStreak: (userId: string, type: string) => Promise<WellnessStreak>;
    // Tips
    tip: WellnessInsight | null;
    loadTip: (userId: string, category?: string) => Promise<void>;
    // State
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook that provides AI Wellness Companion data and actions (Module 06).
 * Wraps all wellness API functions with loading/error state management
 * and provides local state for chat, mood, sessions, plan, insights,
 * goals, journal, challenges, streaks, and tips.
 */
export function useWellness(): UseWellnessReturn {
    const [chatHistory, setChatHistory] = useState<CompanionChatHistory | null>(null);
    const [quickReplies, setQuickReplies] = useState<string[]>([]);
    const [moodPrompt, setMoodPrompt] = useState<MoodCheckInPrompt | null>(null);
    const [dailyPlan, setDailyPlan] = useState<DailyWellnessPlan | null>(null);
    const [insights, setInsights] = useState<WellnessInsight[]>([]);
    const [goals, setGoals] = useState<WellnessGoal[]>([]);
    const [journalEntries, setJournalEntries] = useState<JournalHistory | null>(null);
    const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
    const [challenges, setChallenges] = useState<WellnessChallenge[]>([]);
    const [challengeDetail, setChallengeDetail] = useState<WellnessChallengeDetail | null>(null);
    const [streaks, setStreaks] = useState<WellnessStreak[]>([]);
    const [tip, setTip] = useState<WellnessInsight | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ---- Companion chat ----

    const sendMessage = useCallback(
        async (userId: string, content: string, sessionId?: string): Promise<CompanionMessage> => {
            setError(null);
            try {
                return await sendCompanionMessage(userId, content, sessionId);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to send message.');
                throw err;
            }
        },
        []
    );

    const loadChatHistory = useCallback(async (userId: string, sessionId?: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCompanionHistory(userId, sessionId);
            setChatHistory(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load chat history.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadQuickReplies = useCallback(async (userId: string, sessionId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCompanionQuickReplies(userId, sessionId);
            setQuickReplies(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load quick replies.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ---- Mood ----

    const loadMoodPrompt = useCallback(async (userId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMoodCheckInPrompt(userId);
            setMoodPrompt(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load mood prompt.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const submitMood = useCallback(
        async (userId: string, checkIn: Omit<MoodCheckIn, 'id' | 'userId' | 'timestamp'>): Promise<MoodCheckIn> => {
            setIsLoading(true);
            setError(null);
            try {
                return await submitMoodCheckIn(userId, checkIn);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to submit mood check-in.');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ---- Sessions ----

    const startBreathing = useCallback(
        async (userId: string, technique: string, duration: number): Promise<BreathingSession> => {
            setIsLoading(true);
            setError(null);
            try {
                return await startBreathingSession(userId, technique, duration);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to start breathing session.');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const startMeditation = useCallback(
        async (userId: string, type: string, duration: number): Promise<MeditationSession> => {
            setIsLoading(true);
            setError(null);
            try {
                return await startMeditationSession(userId, type, duration);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to start meditation session.');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ---- Daily plan ----

    const loadDailyPlan = useCallback(async (userId: string, date?: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getDailyPlan(userId, date);
            setDailyPlan(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load daily plan.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ---- Insights & Goals ----

    const loadInsights = useCallback(async (userId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWellnessInsights(userId);
            setInsights(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load insights.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadGoals = useCallback(async (userId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWellnessGoals(userId);
            setGoals(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load goals.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateGoal = useCallback(async (goalId: string, updates: Partial<WellnessGoal>): Promise<WellnessGoal> => {
        setError(null);
        try {
            const updated = await updateWellnessGoal(goalId, updates);
            setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
            return updated;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update goal.');
            throw err;
        }
    }, []);

    // ---- Journal ----

    const loadJournal = useCallback(async (userId: string, page?: number, pageSize?: number): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getJournalEntries(userId, page, pageSize);
            setJournalEntries(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load journal.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createEntry = useCallback(
        async (
            userId: string,
            entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
        ): Promise<JournalEntry> => {
            setIsLoading(true);
            setError(null);
            try {
                const created = await createJournalEntry(userId, entry);
                setJournalEntries((prev) => {
                    if (!prev) {
                        return { entries: [created], totalCount: 1, page: 1, pageSize: 20 };
                    }
                    return { ...prev, entries: [created, ...prev.entries], totalCount: prev.totalCount + 1 };
                });
                return created;
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to create journal entry.');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const loadJournalHistory = useCallback(
        async (userId: string, startDate?: string, endDate?: string): Promise<void> => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getJournalHistory(userId, startDate, endDate);
                setJournalHistory(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load journal history.');
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ---- Challenges ----

    const loadChallenges = useCallback(async (userId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWellnessChallenges(userId);
            setChallenges(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load challenges.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadChallengeDetail = useCallback(async (challengeId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWellnessChallengeDetail(challengeId);
            setChallengeDetail(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load challenge detail.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const joinChallenge = useCallback(
        async (userId: string, challengeId: string): Promise<WellnessChallenge> => {
            setIsLoading(true);
            setError(null);
            try {
                const joined = await joinWellnessChallenge(userId, challengeId);
                setChallenges((prev) => prev.map((c) => (c.id === challengeId ? joined : c)));
                if (challengeDetail?.id === challengeId) {
                    setChallengeDetail((prev) => (prev ? { ...prev, joined: true } : prev));
                }
                return joined;
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to join challenge.');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [challengeDetail]
    );

    // ---- Streaks ----

    const loadStreaks = useCallback(async (userId: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWellnessStreaks(userId);
            setStreaks(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load streaks.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateStreak = useCallback(async (userId: string, type: string): Promise<WellnessStreak> => {
        setError(null);
        try {
            const updated = await updateWellnessStreak(userId, type);
            setStreaks((prev) => prev.map((s) => (s.type === type ? updated : s)));
            return updated;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update streak.');
            throw err;
        }
    }, []);

    // ---- Tips ----

    const loadTip = useCallback(async (userId: string, category?: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWellnessTip(userId, category);
            setTip(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load tip.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        chatHistory,
        quickReplies,
        sendMessage,
        loadChatHistory,
        loadQuickReplies,
        moodPrompt,
        loadMoodPrompt,
        submitMood,
        startBreathing,
        startMeditation,
        dailyPlan,
        loadDailyPlan,
        insights,
        goals,
        loadInsights,
        loadGoals,
        updateGoal,
        journalEntries,
        journalHistory,
        loadJournal,
        createEntry,
        loadJournalHistory,
        challenges,
        challengeDetail,
        loadChallenges,
        loadChallengeDetail,
        joinChallenge,
        streaks,
        loadStreaks,
        updateStreak,
        tip,
        loadTip,
        isLoading,
        error,
    };
}
