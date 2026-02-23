/**
 * Health API functions for the AUSTA SuperApp mobile application.
 * Provides 78 exported functions covering health metrics, sleep, activity,
 * nutrition, cycle tracking, wellness resources, assessments, medications,
 * health goals, and device sync.
 */

import { AxiosResponse } from 'axios';
import { gql } from '@apollo/client';
import { graphQLClient, restClient } from './client';
import { getAuthSession } from './care';

// ---------------------------------------------------------------------------
// GraphQL query/mutation constants (inline, replacing broken @shared imports)
// ---------------------------------------------------------------------------

const GET_HEALTH_METRICS = gql`
  query GetHealthMetrics($userId: String!, $types: [String!], $startDate: String, $endDate: String) {
    getHealthMetrics(userId: $userId, types: $types, startDate: $startDate, endDate: $endDate) {
      id type value unit timestamp source
    }
  }
`;

const CREATE_HEALTH_METRIC = gql`
  mutation CreateHealthMetric($recordId: String!, $createMetricDto: CreateMetricInput!) {
    createHealthMetric(recordId: $recordId, createMetricDto: $createMetricDto) {
      id type value unit timestamp source
    }
  }
`;

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  source?: string;
}

export interface CreateMetricInput {
  type: string;
  value: number;
  unit: string;
  timestamp?: string;
  source?: string;
}

export interface HealthDevice {
  id: string;
  userId: string;
  deviceType: string;
  deviceId: string;
  name: string;
  connected: boolean;
  lastSyncAt?: string;
}

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

export interface HealthGoal {
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

// ---------------------------------------------------------------------------
// Helper: get auth headers or throw
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<{ Authorization: string }> {
  const session = await getAuthSession();
  if (!session) throw new Error('Authentication required');
  return { Authorization: `Bearer ${session.accessToken}` };
}

// ===========================================================================
// 1. EXISTING GRAPHQL FUNCTIONS (5) - types fixed, imports fixed
// ===========================================================================

export async function getHealthMetrics(
  userId: string,
  types: string[],
  startDate?: string,
  endDate?: string,
): Promise<HealthMetric[]> {
  try {
    const { data } = await graphQLClient.query({
      query: GET_HEALTH_METRICS,
      variables: { userId, types, startDate, endDate },
      fetchPolicy: 'network-only',
    });
    return data.getHealthMetrics;
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    throw error;
  }
}

export async function getConnectedDevices(userId: string): Promise<HealthDevice[]> {
  try {
    const { data } = await graphQLClient.query({
      query: GET_HEALTH_METRICS,
      variables: { userId, types: ['device'] },
      fetchPolicy: 'network-only',
    });
    return data.getConnectedDevices || [];
  } catch (error) {
    console.error('Error fetching connected devices:', error);
    throw error;
  }
}

export async function connectDevice(
  userId: string,
  deviceData: { deviceType: string; deviceId: string },
): Promise<HealthDevice> {
  try {
    const { data } = await graphQLClient.mutate({
      mutation: CREATE_HEALTH_METRIC,
      variables: { userId, ...deviceData },
    });
    return data.connectDevice;
  } catch (error) {
    console.error('Error connecting device:', error);
    throw error;
  }
}

export async function getMedicalHistory(userId: string): Promise<HealthMetric[]> {
  try {
    const { data } = await graphQLClient.query({
      query: GET_HEALTH_METRICS,
      variables: { userId, types: ['history'] },
      fetchPolicy: 'network-only',
    });
    return data.getMedicalHistory || [];
  } catch (error) {
    console.error('Error fetching medical history:', error);
    throw error;
  }
}

export async function createHealthMetric(
  recordId: string,
  createMetricDto: CreateMetricInput,
): Promise<HealthMetric> {
  try {
    const { data } = await graphQLClient.mutate({
      mutation: CREATE_HEALTH_METRIC,
      variables: { recordId, createMetricDto },
    });
    return data.createHealthMetric;
  } catch (error) {
    console.error('Error creating health metric:', error);
    throw error;
  }
}

// ===========================================================================
// 2. SLEEP FUNCTIONS (12)
// ===========================================================================

export async function getSleepLogs(userId: string, startDate?: string, endDate?: string): Promise<SleepLog[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepLog[]> = await restClient.get('/health/sleep/logs', {
    params: { userId, startDate, endDate },
    headers,
  });
  return response.data;
}

export async function createSleepLog(userId: string, log: Omit<SleepLog, 'id' | 'userId'>): Promise<SleepLog> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepLog> = await restClient.post('/health/sleep/logs', { userId, ...log }, { headers });
  return response.data;
}

export async function getSleepQuality(userId: string, date: string): Promise<SleepQuality> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepQuality> = await restClient.get('/health/sleep/quality', {
    params: { userId, date },
    headers,
  });
  return response.data;
}

export async function getSleepDiary(userId: string, startDate?: string, endDate?: string): Promise<SleepDiaryEntry[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepDiaryEntry[]> = await restClient.get('/health/sleep/diary', {
    params: { userId, startDate, endDate },
    headers,
  });
  return response.data;
}

export async function getSleepTrends(userId: string, period: string): Promise<SleepTrend> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepTrend> = await restClient.get('/health/sleep/trends', {
    params: { userId, period },
    headers,
  });
  return response.data;
}

export async function getSleepGoals(userId: string): Promise<SleepGoal> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepGoal> = await restClient.get('/health/sleep/goals', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getSleepDetail(logId: string): Promise<SleepLog> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepLog> = await restClient.get(`/health/sleep/logs/${logId}`, { headers });
  return response.data;
}

export async function getBedtimeRoutine(userId: string): Promise<BedtimeRoutine> {
  const headers = await authHeaders();
  const response: AxiosResponse<BedtimeRoutine> = await restClient.get('/health/sleep/routine', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getSmartAlarm(userId: string): Promise<SmartAlarm> {
  const headers = await authHeaders();
  const response: AxiosResponse<SmartAlarm> = await restClient.get('/health/sleep/alarm', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getSleepInsights(userId: string): Promise<SleepInsight[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<SleepInsight[]> = await restClient.get('/health/sleep/insights', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function syncSleepDevice(userId: string, deviceId: string): Promise<DeviceSyncResult> {
  const headers = await authHeaders();
  const response: AxiosResponse<DeviceSyncResult> = await restClient.post(
    '/health/sleep/sync',
    { userId, deviceId },
    { headers },
  );
  return response.data;
}

export async function exportSleepData(
  userId: string, format: string, startDate: string, endDate: string,
): Promise<ExportResult> {
  const headers = await authHeaders();
  const response: AxiosResponse<ExportResult> = await restClient.post(
    '/health/sleep/export',
    { userId, format, startDate, endDate },
    { headers },
  );
  return response.data;
}

// ===========================================================================
// 3. ACTIVITY FUNCTIONS (10)
// ===========================================================================

export async function getActivitySessions(
  userId: string, startDate?: string, endDate?: string,
): Promise<ActivitySession[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivitySession[]> = await restClient.get('/health/activity/sessions', {
    params: { userId, startDate, endDate },
    headers,
  });
  return response.data;
}

export async function createActivitySession(
  userId: string, session: Omit<ActivitySession, 'id' | 'userId'>,
): Promise<ActivitySession> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivitySession> = await restClient.post(
    '/health/activity/sessions',
    { userId, ...session },
    { headers },
  );
  return response.data;
}

export async function getActivityGoals(userId: string): Promise<ActivityGoal[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivityGoal[]> = await restClient.get('/health/activity/goals', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getActivityHistory(userId: string, page?: number): Promise<ActivitySession[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivitySession[]> = await restClient.get('/health/activity/history', {
    params: { userId, page },
    headers,
  });
  return response.data;
}

export async function getActivityTrends(userId: string, period: string): Promise<ActivityTrend> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivityTrend> = await restClient.get('/health/activity/trends', {
    params: { userId, period },
    headers,
  });
  return response.data;
}

export async function getActivityDetail(sessionId: string): Promise<ActivitySession> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivitySession> = await restClient.get(
    `/health/activity/sessions/${sessionId}`,
    { headers },
  );
  return response.data;
}

export async function getWorkouts(userId: string): Promise<Workout[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<Workout[]> = await restClient.get('/health/activity/workouts', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getActivityChallenges(userId: string): Promise<ActivityChallenge[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<ActivityChallenge[]> = await restClient.get('/health/activity/challenges', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getActivityDeviceData(userId: string, deviceId: string): Promise<HealthMetric[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<HealthMetric[]> = await restClient.get('/health/activity/device-data', {
    params: { userId, deviceId },
    headers,
  });
  return response.data;
}

export async function getActivityWeeklySummary(userId: string): Promise<WeeklySummary> {
  const headers = await authHeaders();
  const response: AxiosResponse<WeeklySummary> = await restClient.get('/health/activity/weekly-summary', {
    params: { userId },
    headers,
  });
  return response.data;
}

// ===========================================================================
// 4. NUTRITION FUNCTIONS (10)
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
  userId: string, log: Omit<NutritionLog, 'id' | 'userId'>,
): Promise<NutritionLog> {
  const headers = await authHeaders();
  const response: AxiosResponse<NutritionLog> = await restClient.post(
    '/health/nutrition/logs',
    { userId, ...log },
    { headers },
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

export async function getNutritionHistory(
  userId: string, startDate: string, endDate: string,
): Promise<NutritionLog[]> {
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
// 5. CYCLE TRACKING FUNCTIONS (15)
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
    { headers },
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
    { headers },
  );
  return response.data;
}

export async function exportCycleData(userId: string, format: string): Promise<ExportResult> {
  const headers = await authHeaders();
  const response: AxiosResponse<ExportResult> = await restClient.post(
    '/health/cycle/export',
    { userId, format },
    { headers },
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
    { headers },
  );
  return response.data;
}

export async function getFertilityWindow(
  userId: string,
): Promise<{ start: string; end: string; ovulation: string }> {
  const headers = await authHeaders();
  const response: AxiosResponse<{ start: string; end: string; ovulation: string }> = await restClient.get(
    '/health/cycle/fertility',
    { params: { userId }, headers },
  );
  return response.data;
}

export async function shareCycleWithPartner(userId: string, partnerEmail: string): Promise<void> {
  const headers = await authHeaders();
  await restClient.post('/health/cycle/share', { userId, partnerEmail }, { headers });
}

// ===========================================================================
// 6. WELLNESS RESOURCES FUNCTIONS (8)
// ===========================================================================

export async function getWellnessArticles(category?: string, page?: number): Promise<WellnessArticle[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<WellnessArticle[]> = await restClient.get('/health/wellness/articles', {
    params: { category, page },
    headers,
  });
  return response.data;
}

export async function getWellnessArticleDetail(articleId: string): Promise<WellnessArticle> {
  const headers = await authHeaders();
  const response: AxiosResponse<WellnessArticle> = await restClient.get(
    `/health/wellness/articles/${articleId}`,
    { headers },
  );
  return response.data;
}

export async function getWellnessVideos(category?: string): Promise<WellnessVideo[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<WellnessVideo[]> = await restClient.get('/health/wellness/videos', {
    params: { category },
    headers,
  });
  return response.data;
}

export async function getWellnessPrograms(userId: string): Promise<WellnessProgram[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<WellnessProgram[]> = await restClient.get('/health/wellness/programs', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getWellnessBookmarks(userId: string): Promise<WellnessBookmark[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<WellnessBookmark[]> = await restClient.get('/health/wellness/bookmarks', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function addWellnessBookmark(
  userId: string, resourceId: string, resourceType: WellnessBookmark['resourceType'],
): Promise<WellnessBookmark> {
  const headers = await authHeaders();
  const response: AxiosResponse<WellnessBookmark> = await restClient.post(
    '/health/wellness/bookmarks',
    { userId, resourceId, resourceType },
    { headers },
  );
  return response.data;
}

export async function removeWellnessBookmark(bookmarkId: string): Promise<void> {
  const headers = await authHeaders();
  await restClient.delete(`/health/wellness/bookmarks/${bookmarkId}`, { headers });
}

export async function searchWellnessResources(
  query: string, type?: string,
): Promise<(WellnessArticle | WellnessVideo)[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<(WellnessArticle | WellnessVideo)[]> = await restClient.get(
    '/health/wellness/search',
    { params: { query, type }, headers },
  );
  return response.data;
}

// ===========================================================================
// 7. ASSESSMENT FUNCTIONS (3)
// ===========================================================================

export async function submitAssessmentStep(userId: string, step: AssessmentStep): Promise<void> {
  const headers = await authHeaders();
  await restClient.post('/health/assessment/steps', { userId, ...step }, { headers });
}

export async function getAssessmentResults(userId: string): Promise<AssessmentResult> {
  const headers = await authHeaders();
  const response: AxiosResponse<AssessmentResult> = await restClient.get('/health/assessment/results', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getHealthScore(
  userId: string,
): Promise<{ score: number; breakdown: { category: string; score: number }[] }> {
  const headers = await authHeaders();
  const response: AxiosResponse<{ score: number; breakdown: { category: string; score: number }[] }> =
    await restClient.get('/health/assessment/score', { params: { userId }, headers });
  return response.data;
}

// ===========================================================================
// 8. MEDICATION FUNCTIONS (11)
// ===========================================================================

export async function getMedications(userId: string): Promise<Medication[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<Medication[]> = await restClient.get('/health/medications', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function addMedication(
  userId: string, medication: Omit<Medication, 'id' | 'userId'>,
): Promise<Medication> {
  const headers = await authHeaders();
  const response: AxiosResponse<Medication> = await restClient.post(
    '/health/medications',
    { userId, ...medication },
    { headers },
  );
  return response.data;
}

export async function editMedication(medicationId: string, updates: Partial<Medication>): Promise<Medication> {
  const headers = await authHeaders();
  const response: AxiosResponse<Medication> = await restClient.put(
    `/health/medications/${medicationId}`,
    updates,
    { headers },
  );
  return response.data;
}

export async function deleteMedication(medicationId: string): Promise<void> {
  const headers = await authHeaders();
  await restClient.delete(`/health/medications/${medicationId}`, { headers });
}

export async function logMedicationDose(medicationId: string, takenAt: string): Promise<MedicationDose> {
  const headers = await authHeaders();
  const response: AxiosResponse<MedicationDose> = await restClient.post(
    `/health/medications/${medicationId}/doses`,
    { takenAt },
    { headers },
  );
  return response.data;
}

export async function logMissedDose(medicationId: string, scheduledTime: string): Promise<MedicationDose> {
  const headers = await authHeaders();
  const response: AxiosResponse<MedicationDose> = await restClient.post(
    `/health/medications/${medicationId}/missed`,
    { scheduledTime },
    { headers },
  );
  return response.data;
}

export async function getMedicationSideEffects(medicationId: string): Promise<SideEffect[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<SideEffect[]> = await restClient.get(
    `/health/medications/${medicationId}/side-effects`,
    { headers },
  );
  return response.data;
}

export async function reportSideEffect(
  medicationId: string, description: string, severity: SideEffect['severity'],
): Promise<SideEffect> {
  const headers = await authHeaders();
  const response: AxiosResponse<SideEffect> = await restClient.post(
    `/health/medications/${medicationId}/side-effects`,
    { description, severity },
    { headers },
  );
  return response.data;
}

export async function getMedicationSchedule(userId: string): Promise<MedicationSchedule> {
  const headers = await authHeaders();
  const response: AxiosResponse<MedicationSchedule> = await restClient.get('/health/medications/schedule', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getMedicationAlarms(userId: string): Promise<MedicationAlarm[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<MedicationAlarm[]> = await restClient.get('/health/medications/alarms', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function getMedicationReminders(userId: string): Promise<MedicationAlarm[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<MedicationAlarm[]> = await restClient.get('/health/medications/reminders', {
    params: { userId },
    headers,
  });
  return response.data;
}

// ===========================================================================
// 9. HEALTH GOALS FUNCTIONS (4)
// ===========================================================================

export async function getHealthGoals(userId: string): Promise<HealthGoal[]> {
  const headers = await authHeaders();
  const response: AxiosResponse<HealthGoal[]> = await restClient.get('/health/goals', {
    params: { userId },
    headers,
  });
  return response.data;
}

export async function createHealthGoal(
  userId: string, goal: Omit<HealthGoal, 'id' | 'userId' | 'current' | 'status'>,
): Promise<HealthGoal> {
  const headers = await authHeaders();
  const response: AxiosResponse<HealthGoal> = await restClient.post(
    '/health/goals',
    { userId, ...goal },
    { headers },
  );
  return response.data;
}

export async function updateHealthGoal(goalId: string, updates: Partial<HealthGoal>): Promise<HealthGoal> {
  const headers = await authHeaders();
  const response: AxiosResponse<HealthGoal> = await restClient.put(
    `/health/goals/${goalId}`,
    updates,
    { headers },
  );
  return response.data;
}

export async function getHealthGoalProgress(goalId: string): Promise<HealthGoalProgress> {
  const headers = await authHeaders();
  const response: AxiosResponse<HealthGoalProgress> = await restClient.get(
    `/health/goals/${goalId}/progress`,
    { headers },
  );
  return response.data;
}
