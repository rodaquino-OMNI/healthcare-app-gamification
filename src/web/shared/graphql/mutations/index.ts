/**
 * @file index.ts
 * @description A centralized export point for all GraphQL mutations used in the AUSTA SuperApp.
 * This index file aggregates mutations from different journey modules (Health, Care, Plan,
 * Gamification, and Auth) to provide a consistent import path for UI components.
 */

// Authentication mutations
import * as AuthMutations from './auth.mutations';

// Health journey mutations
import * as HealthMutations from './health.mutations';

// Care journey mutations
import * as CareMutations from './care.mutations';

// Plan journey mutations
import * as PlanMutations from './plan.mutations';

// Gamification mutations
import * as GamificationMutations from './gamification.mutations';

// Export all mutation groups
export {
  AuthMutations,
  HealthMutations,
  CareMutations,
  PlanMutations,
  GamificationMutations
};