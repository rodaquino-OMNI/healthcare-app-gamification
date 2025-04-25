import { gql } from '@apollo/client'; // version 3.7.17

/**
 * Fragment for the HealthMetric type containing essential fields
 * Used to ensure consistent field selection when querying health metrics data
 * across the Health Journey components
 */
export const healthMetricFragment = gql`
  fragment HealthMetricFields on HealthMetric {
    id
    userId
    type
    value
    unit
    timestamp
    source
    notes
    trend
    isAbnormal
  }
`;

/**
 * Fragment for the HealthGoal type containing all necessary fields
 * Used to ensure consistent field selection when querying health goals data
 * for goal tracking and progress visualization
 */
export const healthGoalFragment = gql`
  fragment HealthGoalFields on HealthGoal {
    id
    userId
    type
    title
    description
    target
    unit
    currentValue
    startDate
    endDate
    frequency
    status
    progress
    createdAt
    updatedAt
  }
`;

/**
 * Fragment for the MedicalEvent type containing comprehensive event data
 * Used to ensure consistent field selection when querying medical history
 * for timeline visualization and detailed event information
 */
export const medicalEventFragment = gql`
  fragment MedicalEventFields on MedicalEvent {
    id
    userId
    type
    title
    description
    date
    provider
    location
    documents
    severity
    outcome
    notes
    isImported
    importSource
    createdAt
    updatedAt
  }
`;

/**
 * Fragment for the DeviceConnection type containing connection details
 * Used to ensure consistent field selection when querying device connections
 * for device management and data synchronization
 */
export const deviceConnectionFragment = gql`
  fragment DeviceConnectionFields on DeviceConnection {
    id
    userId
    deviceType
    deviceId
    deviceName
    lastSync
    status
    connectionDetails
  }
`;