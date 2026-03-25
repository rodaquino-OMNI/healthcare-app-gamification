import { useState, useCallback } from 'react';

import { restClient } from '@/api/client';

export interface Visit {
    id: string;
    doctor: string;
    specialty: string;
    date: string;
    type: 'in-person' | 'telemedicine';
    status: 'scheduled' | 'completed' | 'cancelled';
    diagnosis?: string;
    notes?: string;
}

/** Shape returned by the useVisits hook */
export interface UseVisitsReturn {
    visits: Visit[];
    currentVisit: Visit | null;
    isLoading: boolean;
    error: Error | null;
    getVisitDetails: (visitId: string) => Promise<void>;
    getVisitHistory: () => Promise<void>;
}

/**
 * Hook for managing visit data
 * for the 5 visit pages in the Care Now journey.
 */
export const useVisits = (): UseVisitsReturn => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getVisitDetails = useCallback(async (visitId: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.get<Visit>(`/api/care/appointments/${visitId}`);
            setCurrentVisit(response.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao carregar detalhes da consulta.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getVisitHistory = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.get<Visit[]>('/api/care/appointments');
            setVisits(response.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao carregar histórico de consultas.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        visits,
        currentVisit,
        isLoading,
        error,
        getVisitDetails,
        getVisitHistory,
    };
};
