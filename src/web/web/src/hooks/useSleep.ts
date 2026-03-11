import { useState, useEffect, useCallback } from 'react';
import { HealthMetric } from 'shared/types/health.types';

import { getHealthMetrics } from '@/api/health';
import { useAuth } from '@/hooks/useAuth';

interface DateRange {
    start: string;
    end: string;
}

interface UseSleepReturn {
    data: HealthMetric[] | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Returns the default date range spanning the last 30 days.
 */
const getDefaultDateRange = (): DateRange => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
        start: start.toISOString(),
        end: end.toISOString(),
    };
};

/**
 * Hook for fetching sleep-type health metrics for the current user.
 * Wraps getHealthMetrics with types=['sleep'] and supports an optional
 * date range (defaults to the last 30 days).
 *
 * @param dateRange - Optional start/end date range for filtering metrics
 * @returns Object containing sleep data, loading state, error, and refetch
 */
export const useSleep = (dateRange?: DateRange): UseSleepReturn => {
    const { session } = useAuth();
    const userId = session?.userId || '';

    const [data, setData] = useState<HealthMetric[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const range = dateRange || getDefaultDateRange();

    const fetchData = useCallback(() => {
        if (!userId) {
            return;
        }
        let cancelled = false;
        setLoading(true);

        getHealthMetrics(userId, ['sleep'], range.start, range.end)
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setError(err);
                    console.error('Error fetching sleep metrics:', err);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [userId, range.start, range.end]);

    useEffect(() => {
        const cleanup = fetchData();
        return cleanup;
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};
