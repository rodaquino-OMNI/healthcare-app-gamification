/**
 * @file useHealthMetrics.ts
 * @description Custom React hook for fetching health metrics data within the
 * Health Journey (F-101) dashboard and health data visualization (F-405).
 * Replaces the former Apollo GraphQL query with TanStack Query v5 + REST API.
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHealthMetrics, HealthMetric } from '../api/health';
import { HealthMetricType } from '@shared/types/health.types';

/**
 * Fetches health metrics for a given user and optional time range.
 * Supports the Health Journey dashboard and health data visualization screens.
 *
 * @param userId - ID of the user to fetch metrics for
 * @param startDate - Optional start date for the metrics time range
 * @param endDate - Optional end date for the metrics time range
 * @param types - Array of HealthMetricType values to filter by
 * @returns Object containing the loading state, error, health metrics data, and refetch function
 */
export const useHealthMetrics = (
  userId: string,
  startDate: Date | string | null,
  endDate: Date | string | null,
  types: HealthMetricType[],
) => {
  // Normalise dates to ISO strings; pass undefined when absent so the API
  // omits them from query parameters rather than sending an explicit null.
  const startISO: string | undefined =
    startDate ? new Date(startDate).toISOString() : undefined;
  const endISO: string | undefined =
    endDate ? new Date(endDate).toISOString() : undefined;

  // When no types are specified, fall back to all known metric types so the
  // API returns a full result set — matching the previous Apollo behaviour.
  const resolvedTypes: string[] =
    types.length > 0
      ? types
      : Object.values(HealthMetricType);

  const {
    data,
    isPending,
    error,
    refetch,
  } = useQuery<HealthMetric[], Error>({
    queryKey: ['healthMetrics', userId, startISO, endISO, resolvedTypes],
    queryFn: () => getHealthMetrics(userId, resolvedTypes, startISO, endISO),
    // Skip the query when no userId is provided
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,  // 5 minutes — aligns with Health Journey cache policy
    gcTime: 30 * 60 * 1000,    // 30 minutes
  });

  // Log errors via useEffect (TanStack Query v5 removed onError from useQuery)
  useEffect(() => {
    if (error) {
      console.error(`Error fetching health metrics for user ${userId}:`, error.message);
    }
  }, [error, userId]);

  return {
    data: data ?? [],
    isLoading: isPending,
    error,
    refetch,
  };
};
