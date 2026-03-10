import { useState } from 'react';

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
    const [records] = useState<MedicalRecord[]>([]);
    const [isLoading] = useState(false);
    const [error] = useState<Error | null>(null);

    const getRecord = (_recordId: string): MedicalRecord | null => null;
    const searchRecords = async (_query: string): Promise<void> => {};

    return {
        records,
        isLoading,
        error,
        getRecord,
        searchRecords,
    };
};
