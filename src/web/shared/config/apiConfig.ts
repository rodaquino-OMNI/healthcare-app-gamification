/**
 * API Configuration Module
 * 
 * This module defines the API endpoints and related settings for the AUSTA SuperApp.
 * It centralizes API URL configuration and constructs journey-specific endpoints
 * to maintain consistency across the application.
 *
 * @module apiConfig
 */
// Import from local constants instead of relying on external import
// This fixes the 'Cannot find module' error
const JOURNEY_IDS = {
  HEALTH: 'health',
  CARE: 'care',
  PLAN: 'plan'
};

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
 * Define the interface for journey endpoints
 */
interface JourneyEndpoints {
  health: string;
  care: string;
  plan: string;
}

/**
 * Define the interface for API configuration
 */
interface ApiConfig {
  baseURL: string;
  journeys: JourneyEndpoints;
}

/**
 * Configuration object for API endpoints and related settings.
 * Centralizes API URL management and journey-specific endpoints.
 */
export const apiConfig: ApiConfig = {
  /**
   * Base URL for all API requests
   * Falls back to localhost in development environment
   */
  baseURL: env.API_BASE_URL || 'http://localhost:3000/api',
  
  /**
   * Journey-specific API endpoints
   * Constructed using the base URL and journey identifiers
   * These endpoints are used for making requests to journey-specific services
   */
  journeys: {
    /**
     * Health journey API endpoint
     * Used for health metrics, goals, and medical history
     */
    health: `${env.API_BASE_URL || 'http://localhost:3000/api'}/${JOURNEY_CONFIG.health}`,
    
    /**
     * Care journey API endpoint
     * Used for appointments, telemedicine, and treatments
     */
    care: `${env.API_BASE_URL || 'http://localhost:3000/api'}/${JOURNEY_CONFIG.care}`,
    
    /**
     * Plan journey API endpoint
     * Used for insurance coverage, claims, and benefits
     */
    plan: `${env.API_BASE_URL || 'http://localhost:3000/api'}/${JOURNEY_CONFIG.plan}`,
  }
};