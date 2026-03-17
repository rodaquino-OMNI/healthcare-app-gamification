/**
 * Health API Module
 *
 * Provides 98 exported functions covering health metrics, sleep, activity,
 * nutrition, cycle tracking, wellness resources, assessments, medications,
 * health goals, and device sync for the web application.
 *
 * Ported from the mobile reference -- web pattern uses restClient/graphQLClient
 * from client.ts (auth is handled via interceptors, no manual token attachment needed).
 */

import axios from 'axios'; // axios 1.6.7
import { API_BASE_URL, API_TIMEOUT } from 'shared/constants/api';
import { CREATE_HEALTH_METRIC } from 'shared/graphql/mutations/health.mutations';
import {
    GET_HEALTH_METRICS,
    GET_HEALTH_GOALS,
    GET_MEDICAL_HISTORY,
    GET_CONNECTED_DEVICES,
} from 'shared/graphql/queries/health.queries';
import { HealthMetric, HealthGoal, MedicalEvent, DeviceConnection } from 'shared/types/health.types';

import { restClient } from './client';

// ---------------------------------------------------------------------------
// GraphQL helpers
// ---------------------------------------------------------------------------

interface GraphQLError {
    message: string;
}

interface GraphQLResponse<T> {
    data: T;
    errors?: GraphQLError[];
}

interface HealthMetricsData {
    getHealthMetrics: HealthMetric[];
}

interface HealthGoalsData {
    getHealthGoals: HealthGoal[];
}

interface MedicalHistoryData {
    getMedicalHistory: MedicalEvent[];
}

interface ConnectedDevicesData {
    getConnectedDevices: DeviceConnection[];
}

interface CreateHealthMetricData {
    createHealthMetric: HealthMetric;
}

interface CreateMetricDto {
    type: string;
    value: number;
    unit: string;
    source?: string;
    timestamp?: string;
}

// ---------------------------------------------------------------------------
// REST interfaces (ported from mobile)
// ---------------------------------------------------------------------------

export interface SleepLog {
    id: string;
    userId: string;
    date: string;
    bedtime: string;
    wakeTime: string;
    duration: number;
    quality: number;
    stages?: SleepStage[];
    notes?: string;
}

export interface SleepStage {
    stage: 'awake' | 'light' | 'deep' | 'rem';
    startTime: string;
    duration: number;
}

export interface SleepQuality {
    date: string;
    score: number;
    factors: { name: string; impact: 'positive' | 'negative' | 'neutral' }[];
}

export interface SleepDiaryEntry {
    id: string;
    date: string;
    bedtime: string;
    wakeTime: string;
    sleepLatency: number;
    awakenings: number;
    notes: string;
    mood: string;
}

export interface SleepTrend {
    period: string;
    averageDuration: number;
    averageQuality: number;
    data: { date: string; duration: number; quality: number }[];
}

export interface SleepGoal {
    id: string;
    userId: string;
    targetBedtime: string;
    targetWakeTime: string;
    targetDuration: number;
    currentStreak: number;
}

export interface BedtimeRoutine {
    id: string;
    userId: string;
    steps: { order: number; activity: string; duration: number }[];
    reminderTime: string;
    enabled: boolean;
}

export interface SmartAlarm {
    id: string;
    userId: string;
    targetTime: string;
    windowMinutes: number;
    sound: string;
    vibration: boolean;
    enabled: boolean;
}

export interface SleepInsight {
    id: string;
    type: string;
    title: string;
    description: string;
    recommendation: string;
    createdAt: string;
}

export interface ActivitySession {
    id: string;
    userId: string;
    type: string;
    startTime: string;
    endTime?: string;
    duration: number;
    caloriesBurned: number;
    distance?: number;
    steps?: number;
    heartRateAvg?: number;
}

export interface ActivityGoal {
    id: string;
    userId: string;
    type: string;
    target: number;
    current: number;
    unit: string;
    period: 'daily' | 'weekly' | 'monthly';
}

export interface ActivityTrend {
    period: string;
    totalCalories: number;
    totalDuration: number;
    totalSteps: number;
    sessions: number;
    data: { date: string; calories: number; duration: number; steps: number }[];
}

export interface Workout {
    id: string;
    name: string;
    type: string;
    exercises: { name: string; sets: number; reps: number; weight?: number }[];
    duration: number;
}

export interface ActivityChallenge {
    id: string;
    name: string;
    description: string;
    type: string;
    target: number;
    progress: number;
    startDate: string;
    endDate: string;
    participants: number;
}

export interface WeeklySummary {
    weekStart: string;
    weekEnd: string;
    totalCalories: number;
    totalDuration: number;
    totalSteps: number;
    activeDays: number;
    topActivity: string;
}

export interface NutritionLog {
    id: string;
    userId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: FoodItem[];
    totalCalories: number;
    notes?: string;
}

export interface FoodItem {
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
}

export interface MealPlan {
    id: string;
    userId: string;
    date: string;
    meals: { mealType: string; foods: FoodItem[]; targetCalories: number }[];
}

export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    calories: number;
    prepTime: number;
    imageUrl?: string;
}

export interface NutrientAnalysis {
    date: string;
    calories: { consumed: number; target: number };
    protein: { consumed: number; target: number };
    carbs: { consumed: number; target: number };
    fat: { consumed: number; target: number };
    fiber: { consumed: number; target: number };
    vitamins: { name: string; percentage: number }[];
}

export interface NutritionGoal {
    id: string;
    userId: string;
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
}

export interface FoodSearchResult {
    id: string;
    name: string;
    brand?: string;
    calories: number;
    servingSize: string;
    nutrients: { protein: number; carbs: number; fat: number };
}

export interface BarcodeScanResult {
    barcode: string;
    food: FoodSearchResult;
    found: boolean;
}

export interface CycleDay {
    id: string;
    userId: string;
    date: string;
    flow: 'none' | 'light' | 'medium' | 'heavy';
    symptoms: string[];
    mood: string;
    temperature?: number;
    notes?: string;
}

export interface CyclePrediction {
    nextPeriodStart: string;
    nextPeriodEnd: string;
    fertileWindowStart: string;
    fertileWindowEnd: string;
    ovulationDate: string;
    cycleLength: number;
}

export interface CycleInsight {
    id: string;
    type: string;
    title: string;
    description: string;
    trend?: string;
}

export interface CycleReminder {
    id: string;
    type: string;
    daysBefore: number;
    enabled: boolean;
    time: string;
}

export interface CycleSettings {
    cycleLength: number;
    periodLength: number;
    trackSymptoms: boolean;
    trackMood: boolean;
    trackTemperature: boolean;
    notifications: boolean;
}

export interface WellnessArticle {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    imageUrl?: string;
    author: string;
    publishedAt: string;
    readTime: number;
}

export interface WellnessVideo {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    category: string;
}

export interface WellnessProgram {
    id: string;
    name: string;
    description: string;
    duration: string;
    modules: { name: string; completed: boolean }[];
    progress: number;
}

export interface WellnessBookmark {
    id: string;
    userId: string;
    resourceId: string;
    resourceType: 'article' | 'video' | 'program';
    createdAt: string;
}

export interface AssessmentStep {
    stepNumber: number;
    question: string;
    answer: string;
    category: string;
}

export interface AssessmentResult {
    id: string;
    userId: string;
    healthScore: number;
    categories: { name: string; score: number; recommendations: string[] }[];
    completedAt: string;
}

export interface Medication {
    id: string;
    userId: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    instructions?: string;
    prescribedBy?: string;
}

export interface MedicationDose {
    id: string;
    medicationId: string;
    scheduledTime: string;
    takenAt?: string;
    status: 'scheduled' | 'taken' | 'missed' | 'skipped';
}

export interface SideEffect {
    id: string;
    medicationId: string;
    description: string;
    severity: 'mild' | 'moderate' | 'severe';
    reportedAt: string;
}

export interface MedicationSchedule {
    medications: { medication: Medication; nextDose: string; doses: MedicationDose[] }[];
}

export interface MedicationAlarm {
    id: string;
    medicationId: string;
    time: string;
    enabled: boolean;
    sound: string;
}

export interface HealthGoalLocal {
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

export interface HealthGoalProgress {
    goalId: string;
    entries: { date: string; value: number }[];
    percentComplete: number;
    trend: 'improving' | 'stable' | 'declining';
}

export interface DeviceSyncResult {
    deviceId: string;
    syncedAt: string;
    metricsCount: number;
    status: 'success' | 'partial' | 'failed';
    errors?: string[];
}

export interface ExportResult {
    url: string;
    format: string;
    generatedAt: string;
    expiresAt: string;
}

// ===========================================================================
// 1. EXISTING GRAPHQL FUNCTIONS (5) - preserved
// ===========================================================================

export const getHealthMetrics = async (
    userId: string,
    types: string[],
    startDate: string,
    endDate: string
): Promise<HealthMetric[]> => {
    try {
        const response = await axios.post<GraphQLResponse<HealthMetricsData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_HEALTH_METRICS,
                variables: { userId, types, startDate, endDate },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getHealthMetrics;
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
    }
};

export const getHealthGoals = async (userId: string): Promise<HealthGoal[]> => {
    try {
        const response = await axios.post<GraphQLResponse<HealthGoalsData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_HEALTH_GOALS,
                variables: { userId },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getHealthGoals;
    } catch (error) {
        console.error('Error fetching health goals:', error);
        throw error;
    }
};

export const getMedicalHistory = async (userId: string): Promise<MedicalEvent[]> => {
    try {
        const response = await axios.post<GraphQLResponse<MedicalHistoryData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_MEDICAL_HISTORY,
                variables: { userId },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getMedicalHistory;
    } catch (error) {
        console.error('Error fetching medical history:', error);
        throw error;
    }
};

export const getConnectedDevices = async (userId: string): Promise<DeviceConnection[]> => {
    try {
        const response = await axios.post<GraphQLResponse<ConnectedDevicesData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_CONNECTED_DEVICES,
                variables: { userId },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.getConnectedDevices;
    } catch (error) {
        console.error('Error fetching connected devices:', error);
        throw error;
    }
};

export const createHealthMetric = async (recordId: string, createMetricDto: CreateMetricDto): Promise<HealthMetric> => {
    try {
        const response = await axios.post<GraphQLResponse<CreateHealthMetricData>>(
            `${API_BASE_URL}/graphql`,
            {
                query: CREATE_HEALTH_METRIC,
                variables: { recordId, createMetricDto },
            },
            {
                timeout: API_TIMEOUT,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data.createHealthMetric;
    } catch (error) {
        console.error('Error creating health metric:', error);
        throw error;
    }
};

// ===========================================================================
// 2. SLEEP FUNCTIONS (12)
// ===========================================================================

export async function getSleepLogs(userId: string, startDate?: string, endDate?: string): Promise<SleepLog[]> {
    const response = await restClient.get<SleepLog[]>('/health/sleep/logs', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function createSleepLog(userId: string, log: Omit<SleepLog, 'id' | 'userId'>): Promise<SleepLog> {
    const response = await restClient.post<SleepLog>('/health/sleep/logs', { userId, ...log });
    return response.data;
}

export async function getSleepQuality(userId: string, date: string): Promise<SleepQuality> {
    const response = await restClient.get<SleepQuality>('/health/sleep/quality', {
        params: { userId, date },
    });
    return response.data;
}

export async function getSleepDiary(userId: string, startDate?: string, endDate?: string): Promise<SleepDiaryEntry[]> {
    const response = await restClient.get<SleepDiaryEntry[]>('/health/sleep/diary', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function getSleepTrends(userId: string, period: string): Promise<SleepTrend> {
    const response = await restClient.get<SleepTrend>('/health/sleep/trends', {
        params: { userId, period },
    });
    return response.data;
}

export async function getSleepGoals(userId: string): Promise<SleepGoal> {
    const response = await restClient.get<SleepGoal>('/health/sleep/goals', {
        params: { userId },
    });
    return response.data;
}

export async function getSleepDetail(logId: string): Promise<SleepLog> {
    const response = await restClient.get<SleepLog>(`/health/sleep/logs/${logId}`);
    return response.data;
}

export async function getBedtimeRoutine(userId: string): Promise<BedtimeRoutine> {
    const response = await restClient.get<BedtimeRoutine>('/health/sleep/routine', {
        params: { userId },
    });
    return response.data;
}

export async function getSmartAlarm(userId: string): Promise<SmartAlarm> {
    const response = await restClient.get<SmartAlarm>('/health/sleep/alarm', {
        params: { userId },
    });
    return response.data;
}

export async function getSleepInsights(userId: string): Promise<SleepInsight[]> {
    const response = await restClient.get<SleepInsight[]>('/health/sleep/insights', {
        params: { userId },
    });
    return response.data;
}

export async function syncSleepDevice(userId: string, deviceId: string): Promise<DeviceSyncResult> {
    const response = await restClient.post<DeviceSyncResult>('/health/sleep/sync', { userId, deviceId });
    return response.data;
}

export async function exportSleepData(
    userId: string,
    format: string,
    startDate: string,
    endDate: string
): Promise<ExportResult> {
    const response = await restClient.post<ExportResult>('/health/sleep/export', {
        userId,
        format,
        startDate,
        endDate,
    });
    return response.data;
}

// ===========================================================================
// 3. ACTIVITY FUNCTIONS (10)
// ===========================================================================

export async function getActivitySessions(
    userId: string,
    startDate?: string,
    endDate?: string
): Promise<ActivitySession[]> {
    const response = await restClient.get<ActivitySession[]>('/health/activity/sessions', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function createActivitySession(
    userId: string,
    session: Omit<ActivitySession, 'id' | 'userId'>
): Promise<ActivitySession> {
    const response = await restClient.post<ActivitySession>('/health/activity/sessions', { userId, ...session });
    return response.data;
}

export async function getActivityGoals(userId: string): Promise<ActivityGoal[]> {
    const response = await restClient.get<ActivityGoal[]>('/health/activity/goals', {
        params: { userId },
    });
    return response.data;
}

export async function getActivityHistory(userId: string, page?: number): Promise<ActivitySession[]> {
    const response = await restClient.get<ActivitySession[]>('/health/activity/history', {
        params: { userId, page },
    });
    return response.data;
}

export async function getActivityTrends(userId: string, period: string): Promise<ActivityTrend> {
    const response = await restClient.get<ActivityTrend>('/health/activity/trends', {
        params: { userId, period },
    });
    return response.data;
}

export async function getActivityDetail(sessionId: string): Promise<ActivitySession> {
    const response = await restClient.get<ActivitySession>(`/health/activity/sessions/${sessionId}`);
    return response.data;
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
    const response = await restClient.get<Workout[]>('/health/activity/workouts', {
        params: { userId },
    });
    return response.data;
}

export async function getActivityChallenges(userId: string): Promise<ActivityChallenge[]> {
    const response = await restClient.get<ActivityChallenge[]>('/health/activity/challenges', {
        params: { userId },
    });
    return response.data;
}

export async function getActivityDeviceData(userId: string, deviceId: string): Promise<HealthMetric[]> {
    const response = await restClient.get<HealthMetric[]>('/health/activity/device-data', {
        params: { userId, deviceId },
    });
    return response.data;
}

export async function getActivityWeeklySummary(userId: string): Promise<WeeklySummary> {
    const response = await restClient.get<WeeklySummary>('/health/activity/weekly-summary', {
        params: { userId },
    });
    return response.data;
}

// ===========================================================================
// 4. NUTRITION FUNCTIONS (10)
// ===========================================================================

export async function getNutritionLogs(userId: string, date?: string): Promise<NutritionLog[]> {
    const response = await restClient.get<NutritionLog[]>('/health/nutrition/logs', {
        params: { userId, date },
    });
    return response.data;
}

export async function createNutritionLog(
    userId: string,
    log: Omit<NutritionLog, 'id' | 'userId'>
): Promise<NutritionLog> {
    const response = await restClient.post<NutritionLog>('/health/nutrition/logs', { userId, ...log });
    return response.data;
}

export async function getMealPlan(userId: string, date?: string): Promise<MealPlan> {
    const response = await restClient.get<MealPlan>('/health/nutrition/meal-plan', {
        params: { userId, date },
    });
    return response.data;
}

export async function getRecipes(category?: string, query?: string): Promise<Recipe[]> {
    const response = await restClient.get<Recipe[]>('/health/nutrition/recipes', {
        params: { category, query },
    });
    return response.data;
}

export async function getNutrientAnalysis(userId: string, date: string): Promise<NutrientAnalysis> {
    const response = await restClient.get<NutrientAnalysis>('/health/nutrition/analysis', {
        params: { userId, date },
    });
    return response.data;
}

export async function getNutritionGoals(userId: string): Promise<NutritionGoal> {
    const response = await restClient.get<NutritionGoal>('/health/nutrition/goals', {
        params: { userId },
    });
    return response.data;
}

export async function getNutritionHistory(userId: string, startDate: string, endDate: string): Promise<NutritionLog[]> {
    const response = await restClient.get<NutritionLog[]>('/health/nutrition/history', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function searchFood(query: string): Promise<FoodSearchResult[]> {
    const response = await restClient.get<FoodSearchResult[]>('/health/nutrition/food-search', {
        params: { query },
    });
    return response.data;
}

export async function scanBarcode(barcode: string): Promise<BarcodeScanResult> {
    const response = await restClient.get<BarcodeScanResult>('/health/nutrition/scan', {
        params: { barcode },
    });
    return response.data;
}

export async function getNutritionWeeklySummary(userId: string): Promise<WeeklySummary> {
    const response = await restClient.get<WeeklySummary>('/health/nutrition/weekly-summary', {
        params: { userId },
    });
    return response.data;
}

// ===========================================================================
// 5. CYCLE TRACKING FUNCTIONS (15)
// ===========================================================================

export async function getCycleDays(userId: string, startDate: string, endDate: string): Promise<CycleDay[]> {
    const response = await restClient.get<CycleDay[]>('/health/cycle/days', {
        params: { userId, startDate, endDate },
    });
    return response.data;
}

export async function logCycleDay(userId: string, day: Omit<CycleDay, 'id' | 'userId'>): Promise<CycleDay> {
    const response = await restClient.post<CycleDay>('/health/cycle/days', { userId, ...day });
    return response.data;
}

export async function getCyclePredictions(userId: string): Promise<CyclePrediction> {
    const response = await restClient.get<CyclePrediction>('/health/cycle/predictions', {
        params: { userId },
    });
    return response.data;
}

export async function getCycleSymptomLog(userId: string, date: string): Promise<string[]> {
    const response = await restClient.get<string[]>('/health/cycle/symptoms', {
        params: { userId, date },
    });
    return response.data;
}

export async function getCycleMoodLog(userId: string, date: string): Promise<string> {
    const response = await restClient.get<string>('/health/cycle/mood', {
        params: { userId, date },
    });
    return response.data;
}

export async function getCycleInsights(userId: string): Promise<CycleInsight[]> {
    const response = await restClient.get<CycleInsight[]>('/health/cycle/insights', {
        params: { userId },
    });
    return response.data;
}

export async function getCycleCalendar(userId: string, month: string): Promise<CycleDay[]> {
    const response = await restClient.get<CycleDay[]>('/health/cycle/calendar', {
        params: { userId, month },
    });
    return response.data;
}

export async function getCycleReminders(userId: string): Promise<CycleReminder[]> {
    const response = await restClient.get<CycleReminder[]>('/health/cycle/reminders', {
        params: { userId },
    });
    return response.data;
}

export async function updateCycleSettings(userId: string, settings: CycleSettings): Promise<CycleSettings> {
    const response = await restClient.put<CycleSettings>('/health/cycle/settings', { userId, ...settings });
    return response.data;
}

export async function exportCycleData(userId: string, format: string): Promise<ExportResult> {
    const response = await restClient.post<ExportResult>('/health/cycle/export', { userId, format });
    return response.data;
}

export async function getCycleHistory(userId: string): Promise<CycleDay[]> {
    const response = await restClient.get<CycleDay[]>('/health/cycle/history', {
        params: { userId },
    });
    return response.data;
}

export async function getCycleDetail(cycleId: string): Promise<CycleDay> {
    const response = await restClient.get<CycleDay>(`/health/cycle/days/${cycleId}`);
    return response.data;
}

export async function logFlow(userId: string, date: string, flow: CycleDay['flow']): Promise<CycleDay> {
    const response = await restClient.post<CycleDay>('/health/cycle/flow', { userId, date, flow });
    return response.data;
}

export async function getFertilityWindow(userId: string): Promise<{ start: string; end: string; ovulation: string }> {
    const response = await restClient.get<{ start: string; end: string; ovulation: string }>(
        '/health/cycle/fertility',
        { params: { userId } }
    );
    return response.data;
}

export async function shareCycleWithPartner(userId: string, partnerEmail: string): Promise<void> {
    await restClient.post('/health/cycle/share', { userId, partnerEmail });
}

// ===========================================================================
// 6. WELLNESS RESOURCES FUNCTIONS (8)
// ===========================================================================

export async function getWellnessArticles(category?: string, page?: number): Promise<WellnessArticle[]> {
    const response = await restClient.get<WellnessArticle[]>('/health/wellness/articles', {
        params: { category, page },
    });
    return response.data;
}

export async function getWellnessArticleDetail(articleId: string): Promise<WellnessArticle> {
    const response = await restClient.get<WellnessArticle>(`/health/wellness/articles/${articleId}`);
    return response.data;
}

export async function getWellnessVideos(category?: string): Promise<WellnessVideo[]> {
    const response = await restClient.get<WellnessVideo[]>('/health/wellness/videos', {
        params: { category },
    });
    return response.data;
}

export async function getWellnessPrograms(userId: string): Promise<WellnessProgram[]> {
    const response = await restClient.get<WellnessProgram[]>('/health/wellness/programs', {
        params: { userId },
    });
    return response.data;
}

export async function getWellnessBookmarks(userId: string): Promise<WellnessBookmark[]> {
    const response = await restClient.get<WellnessBookmark[]>('/health/wellness/bookmarks', {
        params: { userId },
    });
    return response.data;
}

export async function addWellnessBookmark(
    userId: string,
    resourceId: string,
    resourceType: WellnessBookmark['resourceType']
): Promise<WellnessBookmark> {
    const response = await restClient.post<WellnessBookmark>('/health/wellness/bookmarks', {
        userId,
        resourceId,
        resourceType,
    });
    return response.data;
}

export async function removeWellnessBookmark(bookmarkId: string): Promise<void> {
    await restClient.delete(`/health/wellness/bookmarks/${bookmarkId}`);
}

export async function searchWellnessResources(
    query: string,
    type?: string
): Promise<(WellnessArticle | WellnessVideo)[]> {
    const response = await restClient.get<(WellnessArticle | WellnessVideo)[]>('/health/wellness/search', {
        params: { query, type },
    });
    return response.data;
}

// ===========================================================================
// 7. ASSESSMENT FUNCTIONS (3)
// ===========================================================================

export async function submitAssessmentStep(userId: string, step: AssessmentStep): Promise<void> {
    await restClient.post('/health/assessment/steps', { userId, ...step });
}

export async function getAssessmentResults(userId: string): Promise<AssessmentResult> {
    const response = await restClient.get<AssessmentResult>('/health/assessment/results', {
        params: { userId },
    });
    return response.data;
}

export async function getHealthScore(
    userId: string
): Promise<{ score: number; breakdown: { category: string; score: number }[] }> {
    const response = await restClient.get<{ score: number; breakdown: { category: string; score: number }[] }>(
        '/health/assessment/score',
        { params: { userId } }
    );
    return response.data;
}

// ===========================================================================
// 8. MEDICATION FUNCTIONS (11)
// ===========================================================================

export async function getMedications(userId: string): Promise<Medication[]> {
    const response = await restClient.get<Medication[]>('/health/medications', {
        params: { userId },
    });
    return response.data;
}

export async function addMedication(
    userId: string,
    medication: Omit<Medication, 'id' | 'userId'>
): Promise<Medication> {
    const response = await restClient.post<Medication>('/health/medications', { userId, ...medication });
    return response.data;
}

export async function editMedication(medicationId: string, updates: Partial<Medication>): Promise<Medication> {
    const response = await restClient.put<Medication>(`/health/medications/${medicationId}`, updates);
    return response.data;
}

export async function deleteMedication(medicationId: string): Promise<void> {
    await restClient.delete(`/health/medications/${medicationId}`);
}

export async function logMedicationDose(medicationId: string, takenAt: string): Promise<MedicationDose> {
    const response = await restClient.post<MedicationDose>(`/health/medications/${medicationId}/doses`, { takenAt });
    return response.data;
}

export async function logMissedDose(medicationId: string, scheduledTime: string): Promise<MedicationDose> {
    const response = await restClient.post<MedicationDose>(`/health/medications/${medicationId}/missed`, {
        scheduledTime,
    });
    return response.data;
}

export async function getMedicationSideEffects(medicationId: string): Promise<SideEffect[]> {
    const response = await restClient.get<SideEffect[]>(`/health/medications/${medicationId}/side-effects`);
    return response.data;
}

export async function reportSideEffect(
    medicationId: string,
    description: string,
    severity: SideEffect['severity']
): Promise<SideEffect> {
    const response = await restClient.post<SideEffect>(`/health/medications/${medicationId}/side-effects`, {
        description,
        severity,
    });
    return response.data;
}

export async function getMedicationSchedule(userId: string): Promise<MedicationSchedule> {
    const response = await restClient.get<MedicationSchedule>('/health/medications/schedule', {
        params: { userId },
    });
    return response.data;
}

export async function getMedicationAlarms(userId: string): Promise<MedicationAlarm[]> {
    const response = await restClient.get<MedicationAlarm[]>('/health/medications/alarms', {
        params: { userId },
    });
    return response.data;
}

export async function getMedicationReminders(userId: string): Promise<MedicationAlarm[]> {
    const response = await restClient.get<MedicationAlarm[]>('/health/medications/reminders', {
        params: { userId },
    });
    return response.data;
}

// ===========================================================================
// 9. HEALTH GOALS FUNCTIONS (4)
// ===========================================================================

export async function getHealthGoalsRest(userId: string): Promise<HealthGoalLocal[]> {
    const response = await restClient.get<HealthGoalLocal[]>('/health/goals', {
        params: { userId },
    });
    return response.data;
}

export async function createHealthGoal(
    userId: string,
    goal: Omit<HealthGoalLocal, 'id' | 'userId' | 'current' | 'status'>
): Promise<HealthGoalLocal> {
    const response = await restClient.post<HealthGoalLocal>('/health/goals', { userId, ...goal });
    return response.data;
}

export async function updateHealthGoal(goalId: string, updates: Partial<HealthGoalLocal>): Promise<HealthGoalLocal> {
    const response = await restClient.put<HealthGoalLocal>(`/health/goals/${goalId}`, updates);
    return response.data;
}

export async function getHealthGoalProgress(goalId: string): Promise<HealthGoalProgress> {
    const response = await restClient.get<HealthGoalProgress>(`/health/goals/${goalId}/progress`);
    return response.data;
}

// ===========================================================================
// 10. ADDITIONAL SLEEP FUNCTIONS (5)
// ===========================================================================

/** Update sleep goals for a user. */
export async function updateSleepGoals(userId: string, goals: Partial<SleepGoal>): Promise<SleepGoal> {
    const response = await restClient.put<SleepGoal>('/health/sleep/goals', { userId, ...goals });
    return response.data;
}

/** Update smart alarm settings for a user. */
export async function updateSmartAlarm(userId: string, alarm: Partial<SmartAlarm>): Promise<SmartAlarm> {
    const response = await restClient.put<SmartAlarm>('/health/sleep/alarm', { userId, ...alarm });
    return response.data;
}

/** Update bedtime routine for a user. */
export async function updateBedtimeRoutine(userId: string, routine: Partial<BedtimeRoutine>): Promise<BedtimeRoutine> {
    const response = await restClient.put<BedtimeRoutine>('/health/sleep/routine', { userId, ...routine });
    return response.data;
}

/** Create a new sleep diary entry. */
export async function createSleepDiaryEntry(
    userId: string,
    entry: Omit<SleepDiaryEntry, 'id'>
): Promise<SleepDiaryEntry> {
    const response = await restClient.post<SleepDiaryEntry>('/health/sleep/diary', { userId, ...entry });
    return response.data;
}

/** Delete a sleep log by its ID. */
export async function deleteSleepLog(logId: string): Promise<void> {
    await restClient.delete(`/health/sleep/logs/${logId}`);
}

// ===========================================================================
// 11. ADDITIONAL ACTIVITY FUNCTIONS (5)
// ===========================================================================

/** Create a new activity goal for a user. */
export async function createActivityGoal(
    userId: string,
    goal: Omit<ActivityGoal, 'id' | 'userId' | 'current'>
): Promise<ActivityGoal> {
    const response = await restClient.post<ActivityGoal>('/health/activity/goals', { userId, ...goal });
    return response.data;
}

/** Update an existing activity goal. */
export async function updateActivityGoal(goalId: string, updates: Partial<ActivityGoal>): Promise<ActivityGoal> {
    const response = await restClient.put<ActivityGoal>(`/health/activity/goals/${goalId}`, updates);
    return response.data;
}

/** Join an activity challenge. */
export async function joinActivityChallenge(userId: string, challengeId: string): Promise<ActivityChallenge> {
    const response = await restClient.post<ActivityChallenge>(`/health/activity/challenges/${challengeId}/join`, {
        userId,
    });
    return response.data;
}

/** Create a new workout. */
export async function createWorkout(userId: string, workout: Omit<Workout, 'id'>): Promise<Workout> {
    const response = await restClient.post<Workout>('/health/activity/workouts', { userId, ...workout });
    return response.data;
}

/** Delete an activity session by its ID. */
export async function deleteActivitySession(sessionId: string): Promise<void> {
    await restClient.delete(`/health/activity/sessions/${sessionId}`);
}

// ===========================================================================
// 12. ADDITIONAL NUTRITION FUNCTIONS (5)
// ===========================================================================

/** Delete a nutrition log by its ID. */
export async function deleteNutritionLog(logId: string): Promise<void> {
    await restClient.delete(`/health/nutrition/logs/${logId}`);
}

/** Update nutrition goals for a user. */
export async function updateNutritionGoals(userId: string, goals: Partial<NutritionGoal>): Promise<NutritionGoal> {
    const response = await restClient.put<NutritionGoal>('/health/nutrition/goals', { userId, ...goals });
    return response.data;
}

/** Create a new meal plan for a user. */
export async function createMealPlan(userId: string, plan: Omit<MealPlan, 'id' | 'userId'>): Promise<MealPlan> {
    const response = await restClient.post<MealPlan>('/health/nutrition/meal-plan', { userId, ...plan });
    return response.data;
}

/** Get details for a specific recipe. */
export async function getRecipeDetail(recipeId: string): Promise<Recipe> {
    const response = await restClient.get<Recipe>(`/health/nutrition/recipes/${recipeId}`);
    return response.data;
}

/** Get water intake for a user on a given date. */
export async function getWaterIntake(
    userId: string,
    date: string
): Promise<{ consumed: number; target: number; unit: string }> {
    const response = await restClient.get<{ consumed: number; target: number; unit: string }>(
        '/health/nutrition/water',
        { params: { userId, date } }
    );
    return response.data;
}

// ===========================================================================
// 13. ADDITIONAL CYCLE TRACKING FUNCTIONS (2)
// ===========================================================================

/** Update a cycle reminder. */
export async function updateCycleReminder(reminderId: string, updates: Partial<CycleReminder>): Promise<CycleReminder> {
    const response = await restClient.put<CycleReminder>(`/health/cycle/reminders/${reminderId}`, updates);
    return response.data;
}

/** Get cycle settings for a user. */
export async function getCycleSettings(userId: string): Promise<CycleSettings> {
    const response = await restClient.get<CycleSettings>('/health/cycle/settings', {
        params: { userId },
    });
    return response.data;
}

// ===========================================================================
// 14. HEALTH GOALS & DEVICE FUNCTIONS (3)
// ===========================================================================

/** Delete a health goal by its ID. */
export async function deleteHealthGoal(goalId: string): Promise<void> {
    await restClient.delete(`/health/goals/${goalId}`);
}

/** Disconnect a health device for a user. */
export async function disconnectDevice(userId: string, deviceId: string): Promise<void> {
    await restClient.delete(`/health/devices/${deviceId}`, { params: { userId } });
}

/** Get sync history for a specific device. */
export async function getDeviceSyncHistory(userId: string, deviceId: string): Promise<DeviceSyncResult[]> {
    const response = await restClient.get<DeviceSyncResult[]>(`/health/devices/${deviceId}/sync-history`, {
        params: { userId },
    });
    return response.data;
}
