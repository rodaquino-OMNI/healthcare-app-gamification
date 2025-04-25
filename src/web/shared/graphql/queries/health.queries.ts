import { gql } from '@apollo/client'; // version 3.7.17
import {
  healthMetricFragment,
  healthGoalFragment,
  medicalEventFragment,
  deviceConnectionFragment
} from 'src/web/shared/graphql/fragments/health.fragments.ts';

/**
 * Query to retrieve health metrics with optional filtering by type, date range, and source
 * Used by the Health Journey dashboard and detailed metric views
 */
export const GET_HEALTH_METRICS = gql`
  query GetHealthMetrics(
    $userId: ID!
    $types: [MetricType!]!
    $startDate: DateTime
    $endDate: DateTime
    $source: MetricSource
  ) {
    getHealthMetrics(
      userId: $userId
      types: $types
      startDate: $startDate
      endDate: $endDate
      source: $source
    ) {
      ...HealthMetricFields
    }
  }
  ${healthMetricFragment}
`;

/**
 * Query to retrieve health goals with optional filtering by status and type
 * Used by the Health Journey goals section for tracking and visualization
 */
export const GET_HEALTH_GOALS = gql`
  query GetHealthGoals($userId: ID!, $status: GoalStatus, $type: String) {
    getHealthGoals(userId: $userId, status: $status, type: $type) {
      ...HealthGoalFields
    }
  }
  ${healthGoalFragment}
`;

/**
 * Query to retrieve medical history with optional filtering by event type, date range, and severity
 * Used by the Health Journey medical history timeline and detailed event views
 */
export const GET_MEDICAL_HISTORY = gql`
  query GetMedicalHistory(
    $userId: ID!
    $types: [MedicalEventType!]
    $startDate: DateTime
    $endDate: DateTime
    $severity: MedicalEventSeverity
  ) {
    getMedicalHistory(
      userId: $userId
      types: $types
      startDate: $startDate
      endDate: $endDate
      severity: $severity
    ) {
      ...MedicalEventFields
    }
  }
  ${medicalEventFragment}
`;

/**
 * Query to retrieve connected devices for a user
 * Used by the Health Journey device connection management section
 */
export const GET_CONNECTED_DEVICES = gql`
  query GetConnectedDevices($userId: ID!) {
    getConnectedDevices(userId: $userId) {
      ...DeviceConnectionFields
    }
  }
  ${deviceConnectionFragment}
`;