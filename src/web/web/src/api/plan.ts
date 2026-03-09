import type { Plan, Claim, Coverage, Benefit } from 'shared/types/plan.types';

import { restClient } from './client';

/**
 * Fetches the user's insurance plan details.
 */
export const getPlan = async (userId: string): Promise<Plan> => {
    const response = await restClient.get<Plan>(`/plan?userId=${userId}`);
    return response.data;
};

/**
 * Fetches all claims for the user.
 */
export const getClaims = async (userId: string): Promise<Claim[]> => {
    const response = await restClient.get<Claim[]>(`/plan/claims?userId=${userId}`);
    return response.data;
};

/**
 * Fetches the user's coverage information.
 */
export const getCoverage = async (userId: string): Promise<Coverage> => {
    const response = await restClient.get<Coverage>(`/plan/coverage?userId=${userId}`);
    return response.data;
};

/**
 * Fetches all benefits for the user's plan.
 */
export const getBenefits = async (userId: string): Promise<Benefit[]> => {
    const response = await restClient.get<Benefit[]>(`/plan/benefits?userId=${userId}`);
    return response.data;
};

/**
 * Submits a new insurance claim.
 */
export const submitClaim = async (claimData: Partial<Claim>): Promise<Claim> => {
    const response = await restClient.post<Claim>('/plan/claims', claimData);
    return response.data;
};

/**
 * Updates an existing claim.
 */
export const updateClaim = async (claimId: string, claimData: Partial<Claim>): Promise<Claim> => {
    const response = await restClient.put<Claim>(`/plan/claims/${claimId}`, claimData);
    return response.data;
};

/**
 * Cancels a claim.
 */
export const cancelClaim = async (claimId: string): Promise<void> => {
    await restClient.delete(`/plan/claims/${claimId}`);
};

/**
 * Uploads a document for a claim.
 */
export const uploadClaimDocument = async (claimId: string, _file: File): Promise<string> => {
    const response = await restClient.post<{ url: string }>(`/plan/claims/${claimId}/documents`);
    return response.data.url;
};

/**
 * Simulates the cost of a healthcare procedure.
 */
export const simulateCost = async (procedureCode: string): Promise<{ estimatedCost: number }> => {
    const response = await restClient.get<{
        estimatedCost: number;
    }>(`/plan/cost-simulator?procedureCode=${procedureCode}`);
    return response.data;
};

/**
 * Fetches the user's digital insurance card data.
 */
export const getDigitalCard = async (_userId?: string, _token?: string): Promise<{ plan: Plan }> => {
    const response = await restClient.get<{ plan: Plan }>('/plan/digital-card');
    return response.data;
};
