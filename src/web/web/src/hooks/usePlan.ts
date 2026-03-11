import { useState, useEffect, useCallback } from 'react';
import type { Plan, Benefit } from 'shared/types/plan.types';

import {
    getPlan,
    getBenefits,
    submitClaim,
    updateClaim,
    cancelClaim,
    uploadClaimDocument,
    simulateCost,
    getDigitalCard,
} from '@/api/plan';
import { useAuth } from '@/hooks/useAuth';

/** Shape of the digital card data returned by the API */
interface DigitalCardData {
    plan: Plan;
}

/** Shape returned by the usePlan hook */
export interface UsePlanReturn {
    plan: Plan | null;
    benefits: Benefit[];
    digitalCard: DigitalCardData | null;
    isLoading: boolean;
    error: string | null;
    submitClaim: typeof submitClaim;
    updateClaim: typeof updateClaim;
    cancelClaim: typeof cancelClaim;
    uploadDocument: (claimId: string, file: File) => Promise<string>;
    simulateCost: typeof simulateCost;
    refreshPlan: () => Promise<void>;
    refreshBenefits: () => Promise<void>;
}

/**
 * Custom hook for managing the user's insurance plan data within the 'My Plan & Benefits' journey.
 * Provides access to plan details, benefits, digital card, and plan-related mutations.
 * Claims and coverage are intentionally excluded — use useClaims and useCoverage respectively.
 */
export const usePlan = (): UsePlanReturn => {
    const { session } = useAuth();

    const [plan, setPlan] = useState<Plan | null>(null);
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [digitalCard, setDigitalCard] = useState<DigitalCardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const userId = session?.accessToken ?? '';

    const fetchPlan = useCallback(async (): Promise<void> => {
        if (!userId) {
            return;
        }
        try {
            const data = await getPlan(userId);
            setPlan(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load plan';
            setError(message);
        }
    }, [userId]);

    const fetchBenefits = useCallback(async (): Promise<void> => {
        if (!userId) {
            return;
        }
        try {
            const data = await getBenefits(userId);
            setBenefits(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load benefits';
            setError(message);
        }
    }, [userId]);

    const fetchDigitalCard = useCallback(async (): Promise<void> => {
        if (!userId) {
            return;
        }
        try {
            const data = await getDigitalCard(userId, userId);
            setDigitalCard(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load digital card';
            setError(message);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        void Promise.all([fetchPlan(), fetchBenefits(), fetchDigitalCard()]).finally(() => {
            setIsLoading(false);
        });
    }, [userId, fetchPlan, fetchBenefits, fetchDigitalCard]);

    /**
     * Wrapper around uploadClaimDocument that matches the expected uploadDocument signature.
     */
    const uploadDocument = (claimId: string, file: File): Promise<string> => {
        return uploadClaimDocument(claimId, file);
    };

    return {
        plan,
        benefits,
        digitalCard,
        isLoading,
        error,
        submitClaim,
        updateClaim,
        cancelClaim,
        uploadDocument,
        simulateCost,
        refreshPlan: fetchPlan,
        refreshBenefits: fetchBenefits,
    };
};
