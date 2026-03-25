import { useState, useCallback } from 'react';

import { restClient } from '@/api/client';

export type RecordType = 'visit' | 'lab' | 'prescription' | 'imaging';

export interface MedicalRecord {
    id: string;
    type: RecordType;
    title: string;
    doctor: string;
    date: string;
    description: string;
}

/** Shape returned by the useMedicalRecords hook */
export interface UseMedicalRecordsReturn {
    records: MedicalRecord[];
    isLoading: boolean;
    error: Error | null;
    getRecord: (recordId: string) => MedicalRecord | null;
    searchRecords: (query: string) => Promise<void>;
}

/**
 * Hook for managing medical records data
 * for the medical-records page in the Care Now journey.
 */
export const useMedicalRecords = (): UseMedicalRecordsReturn => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [recordCache, setRecordCache] = useState<Record<string, MedicalRecord>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getRecord = useCallback(
        (recordId: string): MedicalRecord | null => {
            const cached = recordCache[recordId];
            if (cached) {
                return cached;
            }
            // Fetch in background and update cache; return null until available
            void restClient
                .get<MedicalRecord>(`/api/health/records/${recordId}`)
                .then((response) => {
                    setRecordCache((prev) => ({ ...prev, [recordId]: response.data }));
                })
                .catch((err: unknown) => {
                    setError(err instanceof Error ? err : new Error('Erro ao carregar prontuário.'));
                });
            return null;
        },
        [recordCache]
    );

    const searchRecords = useCallback(async (query: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.get<MedicalRecord[]>('/api/health/records/search', {
                params: { q: query },
            });
            setRecords(response.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err : new Error('Erro ao buscar prontuários.'));
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        records,
        isLoading,
        error,
        getRecord,
        searchRecords,
    };
};
