/**
 * Hook for managing telemedicine sessions in the Care Now journey.
 */
export const useTelemedicine = () => {
    return {
        session: null,
        isLoading: false,
        error: null,
        startSession: async (_providerId: string) => {},
        endSession: async () => {},
    };
};
