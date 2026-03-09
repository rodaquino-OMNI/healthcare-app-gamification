/** Shape returned by the useTelemedicine hook */
interface UseTelemedicineReturn {
    session: null;
    isLoading: boolean;
    error: null;
    startSession: (_providerId: string) => Promise<void>;
    endSession: () => Promise<void>;
}

/**
 * Hook for managing telemedicine sessions
 * in the Care Now journey.
 */
export const useTelemedicine = (): UseTelemedicineReturn => {
    return {
        session: null,
        isLoading: false,
        error: null,
        startSession: async (_providerId: string) => {},
        endSession: async () => {},
    };
};
