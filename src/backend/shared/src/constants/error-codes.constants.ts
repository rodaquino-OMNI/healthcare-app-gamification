/**
 * Error codes constants used throughout the backend services
 * These provide consistent error references for debugging and client error handling
 */

// Authentication error codes
export const AUTH_INVALID_CREDENTIALS = 'AUTH_001';
export const AUTH_TOKEN_EXPIRED = 'AUTH_002'; 
export const AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_003';

// Health journey error codes
export const HEALTH_INVALID_METRIC = 'HEALTH_001';
export const HEALTH_DEVICE_CONNECTION_FAILED = 'HEALTH_002';

// Care journey error codes
export const CARE_PROVIDER_UNAVAILABLE = 'CARE_001';
export const CARE_APPOINTMENT_SLOT_TAKEN = 'CARE_002';
export const CARE_TELEMEDICINE_CONNECTION_FAILED = 'CARE_003';

// Plan journey error codes
export const PLAN_INVALID_CLAIM_DATA = 'PLAN_001';
export const PLAN_COVERAGE_VERIFICATION_FAILED = 'PLAN_002';

// Gamification error codes
export const GAME_INVALID_EVENT_DATA = 'GAME_001';
export const GAME_ACHIEVEMENT_RULE_ERROR = 'GAME_002';

// API error codes
export const API_RATE_LIMIT_EXCEEDED = 'API_001';
export const API_INVALID_INPUT = 'API_002';

// System error codes
export const SYS_INTERNAL_SERVER_ERROR = 'SYS_001';