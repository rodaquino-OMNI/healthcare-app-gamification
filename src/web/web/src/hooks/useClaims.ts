import { useMutation } from '@apollo/client';
import { Claim } from 'src/web/shared/types/plan.types';
import { SUBMIT_CLAIM } from 'src/web/shared/graphql/mutations/plan.mutations';
import { useAuth } from 'src/web/web/src/context/AuthContext';
import { useJourneyContext } from 'src/web/web/src/context/JourneyContext';

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

/**
 * Custom hook for managing and interacting with claims data within the 'My Plan' journey
 * Encapsulates the logic for submitting insurance claims with appropriate authentication
 * and journey context awareness
 */
export const useClaims = () => {
    // Get current user session for authentication
    const { session } = useAuth();

    // Get current journey context for analytics and tracking
    const { currentJourney } = useJourneyContext();

    // Set up the mutation for submitting claims
    const [submitClaimMutation, { loading: submitting, error: submitError }] = useMutation(SUBMIT_CLAIM);

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
                        // Include authentication token in the request header
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                },
            });

            // Return the submitted claim from the response
            return data.submitClaim;
        } catch (error) {
            // Log and re-throw the error for handling by the caller
            console.error('Error submitting claim:', error);
            throw error;
        }
    };

    // Return claim operations and status
    return {
        submitClaim,
        submitting,
        submitError,
    };
};
