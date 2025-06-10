/**
 * Enum representing different types of health metrics tracked in the system
 */
export enum MetricType {
  STEPS = 'STEPS',
  HEART_RATE = 'HEART_RATE',
  WEIGHT = 'WEIGHT',
  BLOOD_PRESSURE_SYSTOLIC = 'BLOOD_PRESSURE_SYSTOLIC',
  BLOOD_PRESSURE_DIASTOLIC = 'BLOOD_PRESSURE_DIASTOLIC',
  BLOOD_GLUCOSE = 'BLOOD_GLUCOSE',
  SLEEP = 'SLEEP',
  OXYGEN_SATURATION = 'OXYGEN_SATURATION',
  BODY_TEMPERATURE = 'BODY_TEMPERATURE',
  RESPIRATORY_RATE = 'RESPIRATORY_RATE',
  CALORIES = 'CALORIES',
  DISTANCE = 'DISTANCE',
  FLOORS = 'FLOORS',
  ACTIVITY = 'ACTIVITY',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Enum representing different sources of health data
 */
export enum MetricSource {
  USER_INPUT = 'USER_INPUT',
  GOOGLE_FIT = 'GOOGLE_FIT',
  HEALTH_KIT = 'HEALTH_KIT',
  EXTERNAL_LAB = 'EXTERNAL_LAB',
  CONNECTED_DEVICE = 'CONNECTED_DEVICE', 
  CALCULATED = 'CALCULATED'
}

/**
 * Interface defining a health goal
 */
export interface HealthGoal {
  id: string;
  userId: string;
  type: MetricType;
  target: number;
  unit: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  startDate: Date;
  endDate?: Date;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
}

/**
 * Interface defining a health insight
 */
export interface HealthInsight {
  id: string;
  userId: string;
  metricType: MetricType;
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  createdAt: Date;
  expiresAt?: Date;
  actionable: boolean;
  action?: string;
  read: boolean;
}

/**
 * Interface defining a medical event
 */
export interface MedicalEvent {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  provider?: string;
  location?: string;
  date: Date;
  documents?: string[];
  tags?: string[];
}