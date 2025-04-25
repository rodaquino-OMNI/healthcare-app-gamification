/**
 * @file plan.ts
 * @description API functions for the Plan journey, enabling interaction with backend services
 * for insurance-related features such as retrieving plan details, submitting and managing claims,
 * and verifying coverage.
 */

import { ReactNativeFile } from 'apollo-upload-client'; // v17.0.0
import { graphQLClient, restClient } from './client';
import {
  GET_PLAN,
  GET_CLAIMS,
} from '../../shared/graphql/queries/plan.queries';
import {
  SUBMIT_CLAIM,
  UPLOAD_CLAIM_DOCUMENT,
  UPDATE_CLAIM,
  CANCEL_CLAIM,
} from '../../shared/graphql/mutations/plan.mutations';
import { Plan, Claim, ClaimStatus } from '../../shared/types/plan.types';

/**
 * Fetches all insurance plans for a specific user
 * 
 * @param userId - The ID of the user whose plans to fetch
 * @returns A promise that resolves to an array of Plan objects
 */
export const getPlans = async (userId: string): Promise<Plan[]> => {
  const { data } = await graphQLClient.query({
    query: GET_PLAN,
    variables: { userId },
    fetchPolicy: 'network-only', // Ensure we get the latest data
  });
  
  return data.getPlans;
};

/**
 * Fetches a specific insurance plan by ID
 * 
 * @param planId - The ID of the plan to fetch
 * @returns A promise that resolves to a Plan object
 */
export const getPlan = async (planId: string): Promise<Plan> => {
  const { data } = await graphQLClient.query({
    query: GET_PLAN,
    variables: { planId },
    fetchPolicy: 'cache-first',
  });
  
  return data.getPlan;
};

/**
 * Fetches claims for a specific plan, optionally filtered by status
 * 
 * @param planId - The ID of the plan whose claims to fetch
 * @param status - Optional claim status to filter by
 * @returns A promise that resolves to an array of Claim objects
 */
export const getClaims = async (planId: string, status?: ClaimStatus): Promise<Claim[]> => {
  const { data } = await graphQLClient.query({
    query: GET_CLAIMS,
    variables: { planId, status },
    fetchPolicy: 'network-only', // Ensure we get the latest data
  });
  
  return data.getClaims;
};

/**
 * Fetches a specific claim by ID
 * 
 * @param claimId - The ID of the claim to fetch
 * @returns A promise that resolves to a Claim object
 */
export const getClaim = async (claimId: string): Promise<Claim> => {
  // Note: Using GET_CLAIMS and extracting the specific claim
  // In a production implementation, this would likely use a dedicated GET_CLAIM query
  const { data } = await graphQLClient.query({
    query: GET_CLAIMS,
    variables: { claimId },
  });
  
  return data.getClaim;
};

/**
 * Submits a new insurance claim
 * 
 * @param planId - The ID of the plan for which to submit a claim
 * @param claimData - The claim data including type, procedure code, provider name, etc.
 * @returns A promise that resolves to the submitted Claim object
 */
export const submitClaim = async (planId: string, claimData: {
  type: string;
  procedureCode: string;
  providerName: string;
  serviceDate: string;
  amount: number;
  documents?: string[];
}): Promise<Claim> => {
  const { data } = await graphQLClient.mutate({
    mutation: SUBMIT_CLAIM,
    variables: {
      planId,
      ...claimData,
    },
  });
  
  return data.submitClaim;
};

/**
 * Uploads a document to an existing claim
 * 
 * @param claimId - The ID of the claim to which the document will be uploaded
 * @param file - The file object to upload
 * @returns A promise that resolves to the uploaded document information
 */
export const uploadClaimDocument = async (
  claimId: string,
  file: { uri: string; name: string; type: string }
): Promise<{ id: string; fileName: string; fileType: string; fileSize: number; uploadedAt: string }> => {
  // Create a ReactNativeFile instance for GraphQL upload
  const uploadFile = new ReactNativeFile({
    uri: file.uri,
    name: file.name,
    type: file.type,
  });

  const { data } = await graphQLClient.mutate({
    mutation: UPLOAD_CLAIM_DOCUMENT,
    variables: {
      claimId,
      file: uploadFile,
    },
  });
  
  return data.uploadClaimDocument;
};

/**
 * Updates an existing claim with additional information
 * 
 * @param claimId - The ID of the claim to update
 * @param additionalInfo - Additional information to add to the claim
 * @returns A promise that resolves to the updated Claim object
 */
export const updateClaim = async (
  claimId: string,
  additionalInfo: Record<string, any>
): Promise<Claim> => {
  const { data } = await graphQLClient.mutate({
    mutation: UPDATE_CLAIM,
    variables: {
      id: claimId,
      additionalInfo,
    },
  });
  
  return data.updateClaim;
};

/**
 * Cancels an existing claim
 * 
 * @param claimId - The ID of the claim to cancel
 * @returns A promise that resolves to the canceled Claim object
 */
export const cancelClaim = async (claimId: string): Promise<Claim> => {
  const { data } = await graphQLClient.mutate({
    mutation: CANCEL_CLAIM,
    variables: {
      id: claimId,
    },
  });
  
  return data.cancelClaim;
};

/**
 * Simulates the cost of a procedure based on coverage
 * 
 * @param planId - The ID of the plan to use for the simulation
 * @param procedureData - The procedure details for the simulation
 * @returns A promise that resolves to the cost simulation results
 */
export const simulateCost = async (
  planId: string,
  procedureData: {
    procedureCode: string;
    providerName?: string;
    providerId?: string;
    estimatedCost?: number;
  }
): Promise<{ totalCost: number; coveredAmount: number; outOfPocket: number }> => {
  const { data } = await restClient.post(`/plans/${planId}/simulate-cost`, procedureData);
  
  return data;
};

/**
 * Retrieves the digital insurance card for a specific plan
 * 
 * @param planId - The ID of the plan for which to get the digital card
 * @returns A promise that resolves to the digital card information
 */
export const getDigitalCard = async (
  planId: string
): Promise<{ cardImageUrl: string; cardData: object }> => {
  const { data } = await restClient.get(`/plans/${planId}/digital-card`);
  
  return data;
};