import { useMutation, useQuery, ApolloError } from '@apollo/client';
import { SUBMIT_CLAIM } from 'shared/graphql/mutations/plan.mutations';
import { GET_CLAIMS } from 'shared/graphql/queries/plan.queries';
import { Claim } from 'shared/types/plan.types';

import { useJourneyContext } from '@/context/JourneyContext';
import { useAuth } from '@/hooks/useAuth';

/**
 * Interface for claim submission data
 */
interface ClaimSubmissionData {
    planId: string;
    type: string;
    procedureCode: string;
    providerName: string;
    serviceDate: string;
    amount: number;
    documents?: string[];
}

/** Typed query data shape */
interface GetClaimsData {
    getClaims: Claim[];
}

/** Typed mutation data shape */
interface SubmitClaimData {
    submitClaim: Claim;
}

/** Shape returned by the useClaims hook */
interface UseClaimsReturn {
    claims: Claim[];
    loading: boolean;
    error: ApolloError | undefined;
    submitClaim: (claimData: ClaimSubmissionData) => Promise<Claim>;
    submitting: boolean;
    submitError: ApolloError | undefined;
}

/**
 * Custom hook for managing and interacting with claims data within the 'My Plan' journey
 * Encapsulates the logic for submitting insurance claims with appropriate authentication
 * and journey context awareness
 */
export const useClaims = (): UseClaimsReturn => {
    // Get current user session for authentication
    const { session } = useAuth();

    // Get current journey context for analytics and tracking
    useJourneyContext();

    // Fetch existing claims
    const {
        data: claimsData,
        loading,
        error,
        refetch,
    } = useQuery<GetClaimsData>(GET_CLAIMS, {
        variables: { planId: 'default' },
        fetchPolicy: 'cache-and-network',
    });

    const claims: Claim[] = claimsData?.getClaims ?? [];

    // Set up the mutation for submitting claims
    const [submitClaimMutation, { loading: submitting, error: submitError }] =
        useMutation<SubmitClaimData>(SUBMIT_CLAIM);

    /**
     * Submits a new insurance claim to the backend
     *
     * @param claimData - The data for the insurance claim being submitted
     * @returns A promise that resolves to the submitted claim data
     */
    const submitClaim = async (claimData: ClaimSubmissionData): Promise<Claim> => {
        try {
            // Execute the mutation with the provided claim data
            const { data } = await submitClaimMutation({
                variables: claimData,
                context: {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
            });

            // Refetch claims after successful submission
            void refetch();

            // Return the submitted claim from the response
            return data!.submitClaim;
        } catch (err) {
            // Log and re-throw the error for handling by the caller
            console.error('Error submitting claim:', err);
            throw err;
        }
    };

    // Return claim operations and status
    return {
        claims,
        loading,
        error,
        submitClaim,
        submitting,
        submitError,
    };
};
