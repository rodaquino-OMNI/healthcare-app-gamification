/**
 * Health-related type definitions for the AUSTA SuperApp
 * 
 * This file contains TypeScript interfaces and validation schemas for health data
 * used throughout the application, ensuring type safety and consistency across
 * frontend and backend implementations of the Health Journey.
 */

import { z } from 'zod'; // v3.22.4

/**
 * Types of health metrics that can be tracked in the application
 * Aligned with the My Health journey requirements
 */
export enum HealthMetricType {
  HEART_RATE = 'HEART_RATE',
  BLOOD_PRESSURE = 'BLOOD_PRESSURE',
  BLOOD_GLUCOSE = 'BLOOD_GLUCOSE',
  STEPS = 'STEPS',
  SLEEP = 'SLEEP',
  WEIGHT = 'WEIGHT',
}

/**
 * Represents a single health metric measurement
 * Used for displaying and tracking health data in the My Health journey
 */
export interface HealthMetric {
  id: string;
  userId: string;
  type: HealthMetricType;
  value: number;
  unit: string;
  timestamp: string;
  source: string;
  /** Optional trend indicator (e.g. 'up', 'down', 'stable') for UI display */
  trend?: string;
}

/**
 * Represents a medical event in a user's health history
 * Used for tracking medical history in the My Health journey
 */
export interface MedicalEvent {
  id: string;
  userId: string;
  type: string;
  description: string;
  date: string;
  provider: string;
  documents: string[];
}

/**
 * Represents a health goal set by the user
 * Used for goal tracking and gamification in the My Health journey
 */
export interface HealthGoal {
  id: string;
  userId: string;
  type: string;
  target: number;
  startDate: string;
  endDate: string;
  status: string;
}

/**
 * Represents a connection to a health tracking device
 * Used for device integration in the My Health journey
 */
export interface DeviceConnection {
  id: string;
  userId: string;
  deviceType: string;
  deviceId: string;
  lastSync: string;
  status: string;
}

/**
 * Zod schema for validating health metric data
 * Ensures data consistency for health metric visualization
 */
export const healthMetricSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.nativeEnum(HealthMetricType),
  value: z.number(),
  unit: z.string(),
  timestamp: z.string().datetime(),
  source: z.string(),
});

/**
 * Zod schema for validating medical event data
 * Ensures data consistency for medical history timeline
 */
export const medicalEventSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  provider: z.string(),
  documents: z.array(z.string()),
});

/**
 * Zod schema for validating health goal data
 * Ensures data consistency for goal tracking
 */
export const healthGoalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string(),
  target: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.string(),
});

/**
 * Zod schema for validating device connection data
 * Ensures data consistency for device integration
 */
export const deviceConnectionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  deviceType: z.string(),
  deviceId: z.string(),
  lastSync: z.string().datetime(),
  status: z.string(),
});