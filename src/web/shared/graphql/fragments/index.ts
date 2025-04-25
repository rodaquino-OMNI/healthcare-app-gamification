/**
 * @file GraphQL Fragments
 * @description Centralizes all GraphQL fragments used across the AUSTA SuperApp.
 * Fragments are organized by journey domains (Health, Care, Plan) and cross-cutting
 * concerns like gamification and user data, making them available through a single import.
 * This supports the API-first approach by providing reusable GraphQL fragments for
 * consistent data fetching across all three core user journeys.
 */

// Import and re-export all Health journey fragments
export * from './health.fragments';

// Import and re-export all Care journey fragments
export * from './care.fragments';

// Import and re-export all Plan journey fragments
export * from './plan.fragments';

// Import and re-export all Gamification fragments
export * from './gamification.fragments';

// Import and re-export all User fragments
export * from './user.fragments';