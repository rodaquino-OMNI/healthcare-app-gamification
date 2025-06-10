/**
 * Types of health metrics supported by the system
 */
export enum MetricType {
  HEART_RATE = 'HEART_RATE',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  BLOOD_GLUCOSE = 'BLOOD_GLUCOSE',
  BODY_TEMPERATURE = 'BODY_TEMPERATURE',
  WEIGHT = 'WEIGHT',
  STEPS = 'STEPS',
  SLEEP = 'SLEEP',
  OXYGEN_SATURATION = 'OXYGEN_SATURATION',
  RESPIRATORY_RATE = 'RESPIRATORY_RATE',
  CALORIES_BURNED = 'CALORIES_BURNED',
  DISTANCE = 'DISTANCE',
  ACTIVITY_DURATION = 'ACTIVITY_DURATION'
}

/**
 * Sources of health metric data
 */
export enum MetricSource {
  MANUAL_ENTRY = 'MANUAL_ENTRY',
  WEARABLE_DEVICE = 'WEARABLE_DEVICE',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  PROVIDER_RECORD = 'PROVIDER_RECORD',
  HEALTH_KIT = 'HEALTH_KIT',
  GOOGLE_FIT = 'GOOGLE_FIT',
  FITBIT = 'FITBIT'
}

/**
 * Types of health goals
 */
export enum GoalType {
  STEPS = 'STEPS',
  WEIGHT = 'WEIGHT',
  ACTIVITY_DURATION = 'ACTIVITY_DURATION',
  SLEEP_DURATION = 'SLEEP_DURATION',
  BLOOD_GLUCOSE = 'BLOOD_GLUCOSE',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  HEART_RATE = 'HEART_RATE'
}

/**
 * Frequency of goal tracking
 */
export enum GoalFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY'
}

/**
 * Status of a health goal
 */
export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ABANDONED = 'ABANDONED'
}

/**
 * Interface for health insights
 */
export interface HealthInsight {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedMetricTypes: MetricType[];
  recommendation: string;
  createdAt: Date;
}