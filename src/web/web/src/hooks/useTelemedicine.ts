import { useState, useCallback } from 'react';

import { restClient } from '@/api/client';

interface TelemedicineSession {
    id: string;
    appointmentId: string;
    status: 'waiting' | 'active' | 'ended';
    roomUrl: string;
    token: string;
    startedAt?: string;
    endedAt?: string;
}

/** Shape returned by the useTelemedicine hook */
interface UseTelemedicineReturn {
    session: TelemedicineSession | null;
    isLoading: boolean;
    error: string | null;
    startSession: (providerId: string) => Promise<void>;
    endSession: () => Promise<void>;
}

/**
 * Hook for managing telemedicine sessions
 * in the Care Now journey.
 */
export const useTelemedicine = (): UseTelemedicineReturn => {
    const [session, setSession] = useState<TelemedicineSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startSession = useCallback(async (providerId: string): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await restClient.post<TelemedicineSession>('/api/care/telemedicine/sessions', {
                providerId,
            });
            setSession(response.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao iniciar sessão de telemedicina.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const endSession = useCallback(async (): Promise<void> => {
        if (!session) {
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            await restClient.post(`/api/care/telemedicine/sessions/${session.id}/end`);
            setSession(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao encerrar sessão de telemedicina.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    return {
        session,
        isLoading,
        error,
        startSession,
        endSession,
    };
};
