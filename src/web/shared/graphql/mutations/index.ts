/**
 * @file index.ts
 * @description A centralized export point for all GraphQL mutations used in the AUSTA SuperApp.
 * This index file aggregates mutations from different journey modules (Health, Care, Plan,
 * Gamification, and Auth) to provide a consistent import path for UI components.
 */

// Authentication mutations
import * as AuthMutations from 'src/web/shared/graphql/mutations/auth.mutations';

// Health journey mutations
import * as HealthMutations from 'src/web/shared/graphql/mutations/health.mutations';

// Care journey mutations
import * as CareMutations from 'src/web/shared/graphql/mutations/care.mutations';

// Plan journey mutations
import * as PlanMutations from 'src/web/shared/graphql/mutations/plan.mutations';

// Gamification mutations
import * as GamificationMutations from 'src/web/shared/graphql/mutations/gamification.mutations';

// Export all mutation groups
export {
  AuthMutations,
  HealthMutations,
  CareMutations,
  PlanMutations,
  GamificationMutations
};