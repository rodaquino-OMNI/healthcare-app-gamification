/**
 * AUSTA SuperApp GraphQL Exports
 * 
 * This file serves as a central export point for all GraphQL-related resources,
 * including queries, mutations, fragments, and the GraphQL schema itself.
 * It simplifies importing and using GraphQL functionalities throughout the 
 * AUSTA SuperApp's web application.
 * 
 * Organized by journey (Health, Care, Plan) and cross-cutting concerns (Auth, Gamification),
 * this file provides a comprehensive set of GraphQL operations for the application.
 */

// Schema
import schema from './schema.graphql';

// Health Journey
import {
  GET_HEALTH_METRICS,
  GET_HEALTH_GOALS,
  GET_MEDICAL_HISTORY,
  GET_CONNECTED_DEVICES
} from './queries/health.queries';

import {
  CREATE_HEALTH_METRIC
} from './mutations/health.mutations';

import {
  healthMetricFragment,
  healthGoalFragment,
  medicalEventFragment,
  deviceConnectionFragment
} from './fragments/health.fragments';

// Care Journey
import {
  GET_APPOINTMENTS,
  GET_APPOINTMENT,
  GET_PROVIDERS
} from './queries/care.queries';

import {
  BOOK_APPOINTMENT,
  CANCEL_APPOINTMENT
} from './mutations/care.mutations';

import {
  AppointmentFragment,
  ProviderFragment,
  TelemedicineSessionFragment
} from './fragments/care.fragments';

// Plan Journey
import {
  GET_PLAN,
  GET_CLAIMS
} from './queries/plan.queries';

import {
  SUBMIT_CLAIM,
  UPLOAD_CLAIM_DOCUMENT,
  UPDATE_CLAIM,
  CANCEL_CLAIM
} from './mutations/plan.mutations';

import {
  PlanFragment,
  CoverageFragment,
  ClaimFragment,
  BenefitFragment
} from './fragments/plan.fragments';

// Gamification
import {
  GET_GAME_PROFILE,
  GET_ACHIEVEMENTS,
  GET_QUESTS,
  GET_REWARDS,
  GET_LEADERBOARD,
  GET_JOURNEY_PROGRESS
} from './queries/gamification.queries';

import {
  CLAIM_REWARD,
  COMPLETE_QUEST_TASK,
  ACKNOWLEDGE_ACHIEVEMENT
} from './mutations/gamification.mutations';

import {
  GamificationProfileFragment,
  AchievementFragment,
  QuestFragment,
  RewardFragment
} from './fragments/gamification.fragments';

// Authentication
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION
} from './mutations/auth.mutations';

import {
  GET_USER_QUERY
} from './queries/auth.queries';

// Export everything
export { schema };

// Health Journey
export {
  GET_HEALTH_METRICS,
  GET_HEALTH_GOALS,
  GET_MEDICAL_HISTORY,
  GET_CONNECTED_DEVICES,
  CREATE_HEALTH_METRIC,
  healthMetricFragment,
  healthGoalFragment,
  medicalEventFragment,
  deviceConnectionFragment
};

// Care Journey
export {
  GET_APPOINTMENTS,
  GET_APPOINTMENT,
  GET_PROVIDERS,
  BOOK_APPOINTMENT,
  CANCEL_APPOINTMENT,
  AppointmentFragment,
  ProviderFragment,
  TelemedicineSessionFragment
};

// Plan Journey
export {
  GET_PLAN,
  GET_CLAIMS,
  SUBMIT_CLAIM,
  UPLOAD_CLAIM_DOCUMENT,
  UPDATE_CLAIM,
  CANCEL_CLAIM,
  PlanFragment,
  CoverageFragment,
  ClaimFragment,
  BenefitFragment
};

// Gamification
export {
  GET_GAME_PROFILE,
  GET_ACHIEVEMENTS,
  GET_QUESTS,
  GET_REWARDS,
  GET_LEADERBOARD,
  GET_JOURNEY_PROGRESS,
  CLAIM_REWARD,
  COMPLETE_QUEST_TASK,
  ACKNOWLEDGE_ACHIEVEMENT,
  GamificationProfileFragment,
  AchievementFragment,
  QuestFragment,
  RewardFragment
};

// Authentication
export {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  GET_USER_QUERY
};