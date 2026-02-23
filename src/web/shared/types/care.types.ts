/**
 * Care-related type definitions for the AUSTA SuperApp
 *
 * This file contains TypeScript interfaces and validation schemas for care data
 * used throughout the application, ensuring type safety and consistency across
 * frontend and backend implementations of the Care Journey.
 */

import { z } from 'zod'; // v3.22.4

/**
 * Represents a scheduled appointment between a user and a provider
 * Used for appointment booking and management in the Care Journey
 */
export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  dateTime: string;
  type: string;
  status: string;
  reason?: string;
  notes?: string;
}

/**
 * Represents a medication prescribed to or taken by a user
 * Used for medication tracking and reminders in the Care Journey
 */
export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
}

/**
 * Represents an active telemedicine session between a user and a provider
 * Used for virtual consultations in the Care Journey
 */
export interface TelemedicineSession {
  id: string;
  appointmentId: string;
  userId: string;
  providerId: string;
  status: string;
  startTime?: string;
  endTime?: string;
  roomUrl?: string;
}

/**
 * Represents a treatment plan created by a provider for a user
 * Used for treatment tracking and compliance in the Care Journey
 */
export interface TreatmentPlan {
  id: string;
  userId: string;
  providerId: string;
  diagnosis: string;
  treatments: string[];
  startDate: string;
  endDate?: string;
  status: string;
}

/**
 * Represents a healthcare provider
 * Used for provider search, selection, and display in the Care Journey
 */
export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location?: string;
  avatarUrl?: string;
  available: boolean;
}

/**
 * Zod schema for validating appointment data
 * Ensures data consistency for appointment booking
 */
export const appointmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  providerId: z.string().uuid(),
  dateTime: z.string().datetime(),
  type: z.string(),
  status: z.string(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Zod schema for validating medication data
 * Ensures data consistency for medication tracking
 */
export const medicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  prescribedBy: z.string().optional(),
});

/**
 * Zod schema for validating telemedicine session data
 * Ensures data consistency for virtual consultations
 */
export const telemedicineSessionSchema = z.object({
  id: z.string().uuid(),
  appointmentId: z.string().uuid(),
  userId: z.string().uuid(),
  providerId: z.string().uuid(),
  status: z.string(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  roomUrl: z.string().url().optional(),
});

/**
 * Zod schema for validating treatment plan data
 * Ensures data consistency for treatment tracking
 */
export const treatmentPlanSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  providerId: z.string().uuid(),
  diagnosis: z.string(),
  treatments: z.array(z.string()),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  status: z.string(),
});

/**
 * Zod schema for validating provider data
 * Ensures data consistency for provider search and display
 */
export const providerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  specialty: z.string(),
  rating: z.number(),
  location: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  available: z.boolean(),
});
