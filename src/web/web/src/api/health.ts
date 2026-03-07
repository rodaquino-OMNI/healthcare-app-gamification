/**
 * Provides API functions for interacting with the health-related endpoints
 * of the AUSTA SuperApp's backend, specifically for the web application.
 *
 * This module encapsulates the logic for fetching and manipulating health data,
 * such as metrics, goals, and medical history to support the Health Journey.
 */

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import axios from 'axios'; // axios 1.6.7
import { API_BASE_URL, API_TIMEOUT } from 'shared/constants/api';
import { CREATE_HEALTH_METRIC } from 'shared/graphql/mutations/health.mutations';
import {
    GET_HEALTH_METRICS,
    GET_HEALTH_GOALS,
    GET_MEDICAL_HISTORY,
    GET_CONNECTED_DEVICES,
} from 'shared/graphql/queries/health.queries';
import { HealthMetric, HealthGoal, MedicalEvent, DeviceConnection } from 'shared/types/health.types';

/**
 * Fetches health metrics for a specific user, date range, and metric types.
 *
 * @param userId - The ID of the user whose metrics to fetch
 * @param types - Array of metric types to fetch (e.g., HEART_RATE, BLOOD_PRESSURE)
 * @param startDate - The start date for the range of metrics to fetch
 * @param endDate - The end date for the range of metrics to fetch
 * @returns A promise that resolves to an array of HealthMetric objects
 */
export const getHealthMetrics = async (
    userId: string,
    types: string[],
    startDate: string,
    endDate: string
): Promise<HealthMetric[]> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_HEALTH_METRICS,
                variables: {
                    userId,
                    types,
                    startDate,
                    endDate,
                },
            },
            {
                timeout: API_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.getHealthMetrics;
    } catch (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
    }
};

/**
 * Fetches health goals for a specific user.
 *
 * @param userId - The ID of the user whose goals to fetch
 * @returns A promise that resolves to an array of HealthGoal objects
 */
export const getHealthGoals = async (userId: string): Promise<HealthGoal[]> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_HEALTH_GOALS,
                variables: {
                    userId,
                },
            },
            {
                timeout: API_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.getHealthGoals;
    } catch (error) {
        console.error('Error fetching health goals:', error);
        throw error;
    }
};

/**
 * Fetches medical history events for a specific user.
 *
 * @param userId - The ID of the user whose medical history to fetch
 * @returns A promise that resolves to an array of MedicalEvent objects
 */
export const getMedicalHistory = async (userId: string): Promise<MedicalEvent[]> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_MEDICAL_HISTORY,
                variables: {
                    userId,
                },
            },
            {
                timeout: API_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.getMedicalHistory;
    } catch (error) {
        console.error('Error fetching medical history:', error);
        throw error;
    }
};

/**
 * Fetches connected devices for a specific user.
 *
 * @param userId - The ID of the user whose connected devices to fetch
 * @returns A promise that resolves to an array of DeviceConnection objects
 */
export const getConnectedDevices = async (userId: string): Promise<DeviceConnection[]> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/graphql`,
            {
                query: GET_CONNECTED_DEVICES,
                variables: {
                    userId,
                },
            },
            {
                timeout: API_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.getConnectedDevices;
    } catch (error) {
        console.error('Error fetching connected devices:', error);
        throw error;
    }
};

/**
 * Creates a new health metric for a specific user.
 *
 * @param recordId - The ID of the health record to add the metric to
 * @param createMetricDto - The data for the new health metric
 * @returns A promise that resolves to the created HealthMetric object
 */
// eslint-disable-next-line max-len
export const createHealthMetric = async (recordId: string, createMetricDto: unknown): Promise<HealthMetric> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/graphql`,
            {
                query: CREATE_HEALTH_METRIC,
                variables: {
                    recordId,
                    createMetricDto,
                },
            },
            {
                timeout: API_TIMEOUT,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.createHealthMetric;
    } catch (error) {
        console.error('Error creating health metric:', error);
        throw error;
    }
};
