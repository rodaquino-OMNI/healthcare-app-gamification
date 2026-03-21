/**
 * Health Goals API — nutrition and cycle tracking functions.
 */

import { AxiosResponse } from 'axios';

import { getAuthSession } from '../care';
import { restClient } from '../client';
import type { ExportResult, WeeklySummary } from './health-records';

// ---------------------------------------------------------------------------
// Nutrition Interfaces
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Cycle Tracking Interfaces
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helper: get auth headers or throw
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<{ Authorization: string }> {
    const session = await getAuthSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return { Authorization: `Bearer ${session.accessToken}` };
}

// ===========================================================================
// NUTRITION FUNCTIONS (10)
// ===========================================================================

export async function getNutritionLogs(userId: string, date?: string): Promise<NutritionLog[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<NutritionLog[]> = await restClient.get('/health/nutrition/logs', {
        params: { userId, date },
        headers,
    });
    return response.data;
}

export async function createNutritionLog(
    userId: string,
    log: Omit<NutritionLog, 'id' | 'userId'>
): Promise<NutritionLog> {
    const headers = await authHeaders();
    const response: AxiosResponse<NutritionLog> = await restClient.post(
        '/health/nutrition/logs',
        { userId, ...log },
        { headers }
    );
    return response.data;
}

export async function getMealPlan(userId: string, date?: string): Promise<MealPlan> {
    const headers = await authHeaders();
    const response: AxiosResponse<MealPlan> = await restClient.get('/health/nutrition/meal-plan', {
        params: { userId, date },
        headers,
    });
    return response.data;
}

export async function getRecipes(category?: string, query?: string): Promise<Recipe[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<Recipe[]> = await restClient.get('/health/nutrition/recipes', {
        params: { category, query },
        headers,
    });
    return response.data;
}

export async function getNutrientAnalysis(userId: string, date: string): Promise<NutrientAnalysis> {
    const headers = await authHeaders();
    const response: AxiosResponse<NutrientAnalysis> = await restClient.get('/health/nutrition/analysis', {
        params: { userId, date },
        headers,
    });
    return response.data;
}

export async function getNutritionGoals(userId: string): Promise<NutritionGoal> {
    const headers = await authHeaders();
    const response: AxiosResponse<NutritionGoal> = await restClient.get('/health/nutrition/goals', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getNutritionHistory(userId: string, startDate: string, endDate: string): Promise<NutritionLog[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<NutritionLog[]> = await restClient.get('/health/nutrition/history', {
        params: { userId, startDate, endDate },
        headers,
    });
    return response.data;
}

export async function searchFood(query: string): Promise<FoodSearchResult[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<FoodSearchResult[]> = await restClient.get('/health/nutrition/food-search', {
        params: { query },
        headers,
    });
    return response.data;
}

export async function scanBarcode(barcode: string): Promise<BarcodeScanResult> {
    const headers = await authHeaders();
    const response: AxiosResponse<BarcodeScanResult> = await restClient.get('/health/nutrition/scan', {
        params: { barcode },
        headers,
    });
    return response.data;
}

export async function getNutritionWeeklySummary(userId: string): Promise<WeeklySummary> {
    const headers = await authHeaders();
    const response: AxiosResponse<WeeklySummary> = await restClient.get('/health/nutrition/weekly-summary', {
        params: { userId },
        headers,
    });
    return response.data;
}

// ===========================================================================
// CYCLE TRACKING FUNCTIONS (15)
// ===========================================================================

export async function getCycleDays(userId: string, startDate: string, endDate: string): Promise<CycleDay[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleDay[]> = await restClient.get('/health/cycle/days', {
        params: { userId, startDate, endDate },
        headers,
    });
    return response.data;
}

export async function logCycleDay(userId: string, day: Omit<CycleDay, 'id' | 'userId'>): Promise<CycleDay> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleDay> = await restClient.post(
        '/health/cycle/days',
        { userId, ...day },
        { headers }
    );
    return response.data;
}

export async function getCyclePredictions(userId: string): Promise<CyclePrediction> {
    const headers = await authHeaders();
    const response: AxiosResponse<CyclePrediction> = await restClient.get('/health/cycle/predictions', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getCycleSymptomLog(userId: string, date: string): Promise<string[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<string[]> = await restClient.get('/health/cycle/symptoms', {
        params: { userId, date },
        headers,
    });
    return response.data;
}

export async function getCycleMoodLog(userId: string, date: string): Promise<string> {
    const headers = await authHeaders();
    const response: AxiosResponse<string> = await restClient.get('/health/cycle/mood', {
        params: { userId, date },
        headers,
    });
    return response.data;
}

export async function getCycleInsights(userId: string): Promise<CycleInsight[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleInsight[]> = await restClient.get('/health/cycle/insights', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getCycleCalendar(userId: string, month: string): Promise<CycleDay[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleDay[]> = await restClient.get('/health/cycle/calendar', {
        params: { userId, month },
        headers,
    });
    return response.data;
}

export async function getCycleReminders(userId: string): Promise<CycleReminder[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleReminder[]> = await restClient.get('/health/cycle/reminders', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function updateCycleSettings(userId: string, settings: CycleSettings): Promise<CycleSettings> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleSettings> = await restClient.put(
        '/health/cycle/settings',
        { userId, ...settings },
        { headers }
    );
    return response.data;
}

export async function exportCycleData(userId: string, format: string): Promise<ExportResult> {
    const headers = await authHeaders();
    const response: AxiosResponse<ExportResult> = await restClient.post(
        '/health/cycle/export',
        { userId, format },
        { headers }
    );
    return response.data;
}

export async function getCycleHistory(userId: string): Promise<CycleDay[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleDay[]> = await restClient.get('/health/cycle/history', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getCycleDetail(cycleId: string): Promise<CycleDay> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleDay> = await restClient.get(`/health/cycle/days/${cycleId}`, { headers });
    return response.data;
}

export async function logFlow(userId: string, date: string, flow: CycleDay['flow']): Promise<CycleDay> {
    const headers = await authHeaders();
    const response: AxiosResponse<CycleDay> = await restClient.post(
        '/health/cycle/flow',
        { userId, date, flow },
        { headers }
    );
    return response.data;
}

export async function getFertilityWindow(userId: string): Promise<{ start: string; end: string; ovulation: string }> {
    const headers = await authHeaders();
    const response: AxiosResponse<{ start: string; end: string; ovulation: string }> = await restClient.get(
        '/health/cycle/fertility',
        { params: { userId }, headers }
    );
    return response.data;
}

export async function shareCycleWithPartner(userId: string, partnerEmail: string): Promise<void> {
    const headers = await authHeaders();
    await restClient.post('/health/cycle/share', { userId, partnerEmail }, { headers });
}
