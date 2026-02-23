/**
 * Health API functions for the AUSTA SuperApp mobile application
 * Provides functions for fetching and updating health-related data
 * Implements the My Health journey functionality (F-101)
 */

import { useEffect } from 'react'; // v18.2.0
import { HealthMetric } from '@shared/types/health.types';
import { API_BASE_URL } from '@shared/constants/api';
import { graphQLClient } from '@api/client';
import { useAuth } from '@hooks/useAuth';
import { GET_HEALTH_METRICS } from '@shared/graphql/queries/health.queries';
import { CREATE_HEALTH_METRIC } from '@shared/graphql/mutations/health.mutations';

/**
 * Fetches health metrics for a specific user and metric types
 * @param userId - User ID to fetch metrics for
 * @param types - Array of metric types to fetch
 * @param startDate - Optional start date for filtering metrics
 * @param endDate - Optional end date for filtering metrics
 * @returns Promise resolving to an array of HealthMetric objects
 */
export async function getHealthMetrics(
  userId: string,
  types: string[],
  startDate?: string,
  endDate?: string
): Promise<HealthMetric[]> {
  try {
    // Execute the GraphQL query to fetch health metrics
    const { data } = await graphQLClient.query({
      query: GET_HEALTH_METRICS,
      variables: {
        userId,
        types,
        startDate,
        endDate
      },
      // Refresh cache to get latest data
      fetchPolicy: 'network-only'
    });

    // Return the health metrics from the response
    return data.getHealthMetrics;
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    throw error;
  }
}

/**
 * Fetches connected health devices for a user
 * @param userId - User ID to fetch devices for
 * @returns Promise resolving to an array of connected devices
 */
export async function getConnectedDevices(userId: string): Promise<any[]> {
  try {
    const { data } = await graphQLClient.query({
      query: GET_HEALTH_METRICS,
      variables: { userId, types: ['device'] },
      fetchPolicy: 'network-only'
    });
    return data.getConnectedDevices || [];
  } catch (error) {
    console.error('Error fetching connected devices:', error);
    throw error;
  }
}

/**
 * Connects a new health device for a user
 * @param userId - User ID to connect device for
 * @param deviceData - Device connection data
 * @returns Promise resolving to the connected device
 */
export async function connectDevice(
  userId: string,
  deviceData: { deviceType: string; deviceId: string }
): Promise<any> {
  try {
    const { data } = await graphQLClient.mutate({
      mutation: CREATE_HEALTH_METRIC,
      variables: { userId, ...deviceData }
    });
    return data.connectDevice;
  } catch (error) {
    console.error('Error connecting device:', error);
    throw error;
  }
}

/**
 * Fetches medical history for a user
 * @param userId - User ID to fetch history for
 * @returns Promise resolving to medical history records
 */
export async function getMedicalHistory(userId: string): Promise<any[]> {
  try {
    const { data } = await graphQLClient.query({
      query: GET_HEALTH_METRICS,
      variables: { userId, types: ['history'] },
      fetchPolicy: 'network-only'
    });
    return data.getMedicalHistory || [];
  } catch (error) {
    console.error('Error fetching medical history:', error);
    throw error;
  }
}

/**
 * Creates a new health metric for a specific user
 * @param recordId - Health record ID to associate metric with
 * @param createMetricDto - Object containing metric data (type, value, unit, etc.)
 * @returns Promise resolving to the created HealthMetric object
 */
export async function createHealthMetric(
  recordId: string,
  createMetricDto: any
): Promise<HealthMetric> {
  try {
    // Execute the GraphQL mutation to create a health metric
    const { data } = await graphQLClient.mutate({
      mutation: CREATE_HEALTH_METRIC,
      variables: {
        recordId,
        createMetricDto
      }
    });

    // Return the created health metric from the response
    return data.createHealthMetric;
  } catch (error) {
    console.error('Error creating health metric:', error);
    throw error;
  }
}