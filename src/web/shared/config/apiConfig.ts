/**
 * API Configuration Module
 * 
 * This module defines the API endpoints and related settings for the AUSTA SuperApp.
 * It centralizes API URL configuration and constructs journey-specific endpoints
 * to maintain consistency across the application.
 *
 * @module apiConfig
 */

import { JOURNEY_IDS } from '../constants/journeys';
import { env } from './env';

/**
 * Journey configuration mapping for easy access to journey identifiers
 * This creates a lowercase version of the journey IDs for consistent API path construction
 */
const JOURNEY_CONFIG = {
  health: JOURNEY_IDS.HEALTH,
  care: JOURNEY_IDS.CARE,
  plan: JOURNEY_IDS.PLAN,
};

/**
 * Configuration object for API endpoints and related settings.
 * Centralizes API URL management and journey-specific endpoints.
 */
export const apiConfig = {
  /**
   * Base URL for all API requests
   * Falls back to localhost in development environment
   */
  baseURL: env.API_BASE_URL || 'http://localhost:3000/api',
};

/**
 * Journey-specific API endpoints
 * Constructed using the base URL and journey identifiers
 * These endpoints are used for making requests to journey-specific services
 */
apiConfig.journeys = {
  /**
   * Health journey API endpoint
   * Used for health metrics, goals, and medical history
   */
  health: `${apiConfig.baseURL}/${JOURNEY_CONFIG.health}`,
  
  /**
   * Care journey API endpoint
   * Used for appointments, telemedicine, and treatments
   */
  care: `${apiConfig.baseURL}/${JOURNEY_CONFIG.care}`,
  
  /**
   * Plan journey API endpoint
   * Used for insurance coverage, claims, and benefits
   */
  plan: `${apiConfig.baseURL}/${JOURNEY_CONFIG.plan}`,
};