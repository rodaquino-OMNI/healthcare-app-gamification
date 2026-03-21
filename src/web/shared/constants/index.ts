/**
 * Constants Index
 *
 * This barrel file re-exports all constants from the constants directory,
 * providing a single import point for all shared constants used throughout
 * the AUSTA SuperApp web applications.
 *
 * These constants support the journey-centered design approach and ensure
 * consistent identification of features, routes, and styling across the application.
 */

// Re-export API-related constants (API_BASE_URL, API_TIMEOUT)
export * from './api';

// Re-export journey-related constants (JOURNEY_IDS, JOURNEY_NAMES, JOURNEY_COLORS, JOURNEY_ICONS, ALL_JOURNEYS)
export * from './journeys';

// Re-export route-related constants (Web and Mobile routes for each journey, utility functions)
export * from './routes';
