import { gql } from '@apollo/client'; // version 3.7.17
import {
  healthMetricFragment,
  healthGoalFragment,
  medicalEventFragment,
  deviceConnectionFragment
} from '../fragments/health.fragments';

/**
 * Mutation to create a new health metric
 * Used in the Health Dashboard to record new health measurements
 */
export const CREATE_HEALTH_METRIC = gql`
  mutation CreateHealthMetric($recordId: ID!, $createMetricDto: CreateHealthMetricInput!) {
    createHealthMetric(recordId: $recordId, createMetricDto: $createMetricDto) {
      ...HealthMetricFields
    }
  }
  ${healthMetricFragment}
`;

/**
 * Mutation to update an existing health metric
 * Used to correct or modify previously recorded health metrics
 */
export const UPDATE_HEALTH_METRIC = gql`
  mutation UpdateHealthMetric($id: ID!, $updateMetricDto: UpdateHealthMetricInput!) {
    updateHealthMetric(id: $id, updateMetricDto: $updateMetricDto) {
      ...HealthMetricFields
    }
  }
  ${healthMetricFragment}
`;

/**
 * Mutation to delete a health metric
 * Used to remove incorrect or unwanted health metrics
 */
export const DELETE_HEALTH_METRIC = gql`
  mutation DeleteHealthMetric($id: ID!) {
    deleteHealthMetric(id: $id) {
      id
      success
    }
  }
`;

/**
 * Mutation to create multiple health metrics in one operation
 * Used during device synchronization to efficiently upload multiple measurements
 */
export const BULK_CREATE_HEALTH_METRICS = gql`
  mutation BulkCreateHealthMetrics($recordId: ID!, $metrics: [CreateHealthMetricInput!]!) {
    bulkCreateHealthMetrics(recordId: $recordId, metrics: $metrics) {
      metrics {
        ...HealthMetricFields
      }
      successCount
      failureCount
    }
  }
  ${healthMetricFragment}
`;

/**
 * Mutation to create a new health goal
 * Used to set personal health objectives and targets
 */
export const CREATE_HEALTH_GOAL = gql`
  mutation CreateHealthGoal($recordId: ID!, $createGoalDto: CreateHealthGoalInput!) {
    createHealthGoal(recordId: $recordId, createGoalDto: $createGoalDto) {
      ...HealthGoalFields
    }
  }
  ${healthGoalFragment}
`;

/**
 * Mutation to update an existing health goal
 * Used to modify goal targets, timeframes, or other attributes
 */
export const UPDATE_HEALTH_GOAL = gql`
  mutation UpdateHealthGoal($id: ID!, $updateGoalDto: UpdateHealthGoalInput!) {
    updateHealthGoal(id: $id, updateGoalDto: $updateGoalDto) {
      ...HealthGoalFields
    }
  }
  ${healthGoalFragment}
`;

/**
 * Mutation to delete a health goal
 * Used to remove goals that are no longer relevant
 */
export const DELETE_HEALTH_GOAL = gql`
  mutation DeleteHealthGoal($id: ID!) {
    deleteHealthGoal(id: $id) {
      id
      success
    }
  }
`;

/**
 * Mutation to mark a health goal as complete
 * Used when a user manually completes a goal
 */
export const COMPLETE_HEALTH_GOAL = gql`
  mutation CompleteHealthGoal($id: ID!) {
    completeHealthGoal(id: $id) {
      ...HealthGoalFields
    }
  }
  ${healthGoalFragment}
`;

/**
 * Mutation to create a new medical event
 * Used to record significant health events in the medical history
 */
export const CREATE_MEDICAL_EVENT = gql`
  mutation CreateMedicalEvent($recordId: ID!, $createEventDto: CreateMedicalEventInput!) {
    createMedicalEvent(recordId: $recordId, createEventDto: $createEventDto) {
      ...MedicalEventFields
    }
  }
  ${medicalEventFragment}
`;

/**
 * Mutation to update an existing medical event
 * Used to modify details of previously recorded medical events
 */
export const UPDATE_MEDICAL_EVENT = gql`
  mutation UpdateMedicalEvent($id: ID!, $updateEventDto: UpdateMedicalEventInput!) {
    updateMedicalEvent(id: $id, updateEventDto: $updateEventDto) {
      ...MedicalEventFields
    }
  }
  ${medicalEventFragment}
`;

/**
 * Mutation to delete a medical event
 * Used to remove incorrectly added or private medical events
 */
export const DELETE_MEDICAL_EVENT = gql`
  mutation DeleteMedicalEvent($id: ID!) {
    deleteMedicalEvent(id: $id) {
      id
      success
    }
  }
`;

/**
 * Mutation to import multiple medical events from external sources
 * Used for EHR integration and medical history import features
 */
export const IMPORT_MEDICAL_EVENTS = gql`
  mutation ImportMedicalEvents($recordId: ID!, $events: [CreateMedicalEventInput!]!, $source: String!) {
    importMedicalEvents(recordId: $recordId, events: $events, source: $source) {
      events {
        ...MedicalEventFields
      }
      successCount
      failureCount
    }
  }
  ${medicalEventFragment}
`;

/**
 * Mutation to connect a health monitoring device
 * Used to establish connection with wearables and health devices
 */
export const CONNECT_DEVICE = gql`
  mutation ConnectDevice($recordId: ID!, $connectDeviceDto: ConnectDeviceInput!) {
    connectDevice(recordId: $recordId, connectDeviceDto: $connectDeviceDto) {
      ...DeviceConnectionFields
    }
  }
  ${deviceConnectionFragment}
`;

/**
 * Mutation to disconnect a previously connected device
 * Used when removing a device from the user's health account
 */
export const DISCONNECT_DEVICE = gql`
  mutation DisconnectDevice($id: ID!) {
    disconnectDevice(id: $id) {
      id
      success
    }
  }
`;

/**
 * Mutation to update device connection details
 * Used to modify connection parameters or update device information
 */
export const UPDATE_DEVICE_CONNECTION = gql`
  mutation UpdateDeviceConnection($id: ID!, $updateConnectionDto: UpdateDeviceConnectionInput!) {
    updateDeviceConnection(id: $id, updateConnectionDto: $updateConnectionDto) {
      ...DeviceConnectionFields
    }
  }
  ${deviceConnectionFragment}
`;

/**
 * Mutation to trigger a manual synchronization with a connected device
 * Used when the user wants to immediately sync their device data
 */
export const SYNC_DEVICE_DATA = gql`
  mutation SyncDeviceData($id: ID!) {
    syncDeviceData(id: $id) {
      connection {
        ...DeviceConnectionFields
      }
      syncedMetrics {
        count
        metrics {
          ...HealthMetricFields
        }
      }
      lastSync
      success
    }
  }
  ${deviceConnectionFragment}
  ${healthMetricFragment}
`;