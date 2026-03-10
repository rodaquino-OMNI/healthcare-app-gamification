import { useState } from 'react';

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
    const [visits] = useState<Visit[]>([]);
    const [currentVisit] = useState<Visit | null>(null);
    const [isLoading] = useState(false);
    const [error] = useState<Error | null>(null);

    const getVisitDetails = async (_visitId: string): Promise<void> => {};
    const getVisitHistory = async (): Promise<void> => {};

    return {
        visits,
        currentVisit,
        isLoading,
        error,
        getVisitDetails,
        getVisitHistory,
    };
};
