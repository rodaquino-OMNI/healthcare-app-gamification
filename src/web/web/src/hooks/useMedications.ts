import { useState, useEffect, useCallback } from 'react';
import { HealthMetric } from 'shared/types/health.types';

import { getHealthMetrics } from '@/api/health';
import { useAuth } from '@/hooks/useAuth';

/** Medication-specific view type extending HealthMetric with display fields */
export interface Medication extends HealthMetric {
    name: string;
    dosage: string;
    status: string;
    schedule?: string;
    adherence?: boolean;
    refillDate?: string;
}

interface DateRange {
    start: string;
    end: string;
}

interface UseMedicationsReturn {
    medications: HealthMetric[] | null;
    loading: boolean;
    error: Error | null;
    getMedicationById: (id: string) => HealthMetric | undefined;
    searchMedications: (query: string) => HealthMetric[];
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
 * Hook for fetching medication-type health metrics for the current user.
 * Wraps getHealthMetrics with types=['medication'] and provides helpers
 * to look up a medication by ID or search by source name.
 *
 * @param dateRange - Optional start/end date range for filtering metrics
 * @returns Object with medications, loading, error, getMedicationById, searchMedications, refetch
 */
export const useMedications = (dateRange?: DateRange): UseMedicationsReturn => {
    const { session } = useAuth();
    const userId = session?.userId || '';

    const [medications, setMedications] = useState<HealthMetric[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const range = dateRange || getDefaultDateRange();

    const fetchData = useCallback(() => {
        if (!userId) {
            return;
        }
        let cancelled = false;
        setLoading(true);

        getHealthMetrics(userId, ['medication'], range.start, range.end)
            .then((result) => {
                if (!cancelled) {
                    setMedications(result);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setError(err);
                    console.error('Error fetching medication metrics:', err);
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

    const getMedicationById = useCallback(
        (id: string): HealthMetric | undefined => {
            return medications?.find((m) => m.id === id);
        },
        [medications]
    );

    const searchMedications = useCallback(
        (query: string): HealthMetric[] => {
            if (!medications || !query.trim()) {
                return [];
            }
            const lowerQuery = query.toLowerCase();
            return medications.filter((m) => m.source.toLowerCase().includes(lowerQuery));
        },
        [medications]
    );

    return {
        medications,
        loading,
        error,
        getMedicationById,
        searchMedications,
        refetch: fetchData,
    };
};
