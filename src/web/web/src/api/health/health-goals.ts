/**
 * Health Goals API Module
 *
 * Nutrition, cycle tracking, wellness resources, and health goal functions.
 */

import { restClient } from '../client';
import type { ExportResult, WeeklySummary } from './health-records';

// ---------------------------------------------------------------------------
// Nutrition types
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
// Cycle types
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
// Wellness types
// ---------------------------------------------------------------------------

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
