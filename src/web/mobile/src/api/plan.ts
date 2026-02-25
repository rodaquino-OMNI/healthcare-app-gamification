/**
 * @file plan.ts
 * @description API functions for the Plan journey: plan details, claims, coverage, and benefits.
 */

import { ReactNativeFile } from 'apollo-upload-client'; // v17.0.0
import { graphQLClient, restClient } from './client';
import { GET_PLAN, GET_CLAIMS } from '@shared/graphql/queries/plan.queries';
import {
  SUBMIT_CLAIM,
  UPLOAD_CLAIM_DOCUMENT,
  UPDATE_CLAIM,
  CANCEL_CLAIM,
} from '@shared/graphql/mutations/plan.mutations';
import { Plan, Claim, ClaimStatus, Benefit } from '@shared/types/plan.types';

// ---------------------------------------------------------------------------
// Local types for REST-only endpoints
// ---------------------------------------------------------------------------

export interface CoverageDetail {
  id: string; planId: string; categoryId: string; name: string;
  description: string; coveredPercent: number; annualLimit?: number;
  coPayment?: number; requiresReferral: boolean;
}

export interface ClaimTimelineEvent {
  id: string; claimId: string; status: string; description: string;
  timestamp: string; actor?: string;
}

export interface ClaimDocument {
  id: string; claimId: string; fileName: string; fileType: string;
  fileSize: number; uploadedAt: string; url?: string;
}

export interface PlanDashboardData {
  planId: string; userId: string; deductibleUsed: number; deductibleTotal: number;
  outOfPocketUsed: number; outOfPocketMax: number; activeClaims: number;
  pendingClaims: number; nextPremiumDueDate: string; premiumAmount: number;
}

export interface ProviderFilter {
  specialty?: string; city?: string; state?: string;
  inNetwork?: boolean; acceptingNewPatients?: boolean;
}

export interface Provider {
  id: string; name: string; specialty: string; address: string;
  city: string; state: string; phone: string;
  inNetwork: boolean; acceptingNewPatients: boolean; rating?: number;
}

export interface EOB {
  id: string; planId: string; claimId?: string; serviceDate: string;
  providerName: string; billedAmount: number; allowedAmount: number;
  planPaid: number; memberResponsibility: number; issuedAt: string;
}

export interface DeductibleStatus {
  planId: string;
  individual: { used: number; limit: number; remaining: number };
  family: { used: number; limit: number; remaining: number };
  periodStart: string; periodEnd: string;
}

export interface CopayInfo {
  planId: string; procedureCode: string; copayAmount: number;
  coinsurancePercent: number; requiresDeductibleFirst: boolean; notes?: string;
}

export interface PreAuthStatus {
  id: string; status: 'pending' | 'approved' | 'denied' | 'expired';
  serviceType: string; requestedDate: string; decisionDate?: string;
  expirationDate?: string; approvedUnits?: number; denialReason?: string;
}

export interface AppealData {
  reason: string; supportingDocuments?: string[]; additionalNotes?: string;
}

export interface ClaimAppeal {
  id: string; claimId: string; status: 'submitted' | 'under_review' | 'resolved' | 'denied';
  reason: string; submittedAt: string; resolvedAt?: string; resolution?: string;
}

export interface PlanComparison {
  planIds: string[];
  plans: Array<{ id: string; name: string; premium: number; deductible: number;
    outOfPocketMax: number; coverageHighlights: string[] }>;
}

export interface ShareData { shareUrl: string; expiresAt: string; qrCodeUrl?: string; }

// ---------------------------------------------------------------------------
// GraphQL-backed functions
// ---------------------------------------------------------------------------

/** Fetches all insurance plans for a user. */
export const getPlans = async (userId: string): Promise<Plan[]> => {
  const { data } = await graphQLClient.query({
    query: GET_PLAN,
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  return data.getPlans;
};

/** Fetches a specific plan by ID. */
export const getPlan = async (planId: string): Promise<Plan> => {
  const { data } = await graphQLClient.query({
    query: GET_PLAN,
    variables: { planId },
    fetchPolicy: 'cache-first',
  });
  return data.getPlan;
};

/** Fetches claims for a plan, optionally filtered by status. */
export const getClaims = async (planId: string, status?: ClaimStatus): Promise<Claim[]> => {
  const { data } = await graphQLClient.query({
    query: GET_CLAIMS,
    variables: { planId, status },
    fetchPolicy: 'network-only',
  });
  return data.getClaims;
};

/** Fetches a specific claim by ID. */
export const getClaim = async (claimId: string): Promise<Claim> => {
  const { data } = await graphQLClient.query({
    query: GET_CLAIMS,
    variables: { claimId },
  });
  return data.getClaim;
};

/** Submits a new insurance claim. */
export const submitClaim = async (
  planId: string,
  claimData: {
    type: string; procedureCode: string; providerName: string;
    serviceDate: string; amount: number; documents?: string[];
  }
): Promise<Claim> => {
  const { data } = await graphQLClient.mutate({
    mutation: SUBMIT_CLAIM,
    variables: { planId, ...claimData },
  });
  return data.submitClaim;
};

/** Uploads a document to an existing claim. */
export const uploadClaimDocument = async (
  claimId: string,
  file: { uri: string; name: string; type: string }
): Promise<{ id: string; fileName: string; fileType: string; fileSize: number; uploadedAt: string }> => {
  const uploadFile = new ReactNativeFile({ uri: file.uri, name: file.name, type: file.type });
  const { data } = await graphQLClient.mutate({
    mutation: UPLOAD_CLAIM_DOCUMENT,
    variables: { claimId, file: uploadFile },
  });
  return data.uploadClaimDocument;
};

/** Updates an existing claim with additional information. */
export const updateClaim = async (
  claimId: string,
  additionalInfo: Record<string, unknown>
): Promise<Claim> => {
  const { data } = await graphQLClient.mutate({
    mutation: UPDATE_CLAIM,
    variables: { id: claimId, additionalInfo },
  });
  return data.updateClaim;
};

/** Cancels an existing claim. */
export const cancelClaim = async (claimId: string): Promise<Claim> => {
  const { data } = await graphQLClient.mutate({
    mutation: CANCEL_CLAIM,
    variables: { id: claimId },
  });
  return data.cancelClaim;
};

// ---------------------------------------------------------------------------
// REST-backed functions
// ---------------------------------------------------------------------------

/** Simulates the cost of a procedure based on plan coverage. */
export const simulateCost = async (
  planId: string,
  procedureData: { procedureCode: string; providerName?: string; providerId?: string; estimatedCost?: number }
): Promise<{ totalCost: number; coveredAmount: number; outOfPocket: number }> => {
  const { data } = await restClient.post(`/plans/${planId}/simulate-cost`, procedureData);
  return data;
};

/** Retrieves the digital insurance card for a plan. */
export const getDigitalCard = async (
  planId: string
): Promise<{ cardImageUrl: string; cardData: object }> => {
  const { data } = await restClient.get(`/plans/${planId}/digital-card`);
  return data;
};

/** Fetches all benefits for a plan. */
export const getBenefits = async (planId: string): Promise<Benefit[]> => {
  const { data } = await restClient.get(`/plans/${planId}/benefits`);
  return data;
};

/** Fetches coverage details for a specific category within a plan. */
export const getCoverageDetail = async (
  planId: string,
  categoryId: string
): Promise<CoverageDetail> => {
  const { data } = await restClient.get(`/plans/${planId}/coverage/${categoryId}`);
  return data;
};

/** Fetches the status timeline for a claim. */
export const getClaimStatusTimeline = async (claimId: string): Promise<ClaimTimelineEvent[]> => {
  const { data } = await restClient.get(`/claims/${claimId}/timeline`);
  return data;
};

/** Fetches documents attached to a claim. */
export const getClaimDocuments = async (claimId: string): Promise<ClaimDocument[]> => {
  const { data } = await restClient.get(`/claims/${claimId}/documents`);
  return data;
};

/** Fetches the plan dashboard summary for a user. */
export const getPlanDashboard = async (userId: string): Promise<PlanDashboardData> => {
  const { data } = await restClient.get(`/users/${userId}/plan-dashboard`);
  return data;
};

/** Fetches in-network providers for a plan with optional filters. */
export const getNetworkProviders = async (
  planId: string,
  filters?: ProviderFilter
): Promise<Provider[]> => {
  const { data } = await restClient.get(`/plans/${planId}/providers`, { params: filters });
  return data;
};

/** Fetches Explanation of Benefits documents for a plan. */
export const getEOBs = async (
  planId: string,
  dateRange?: { start: string; end: string }
): Promise<EOB[]> => {
  const { data } = await restClient.get(`/plans/${planId}/eobs`, { params: dateRange });
  return data;
};

/** Fetches the current deductible status for a plan. */
export const getDeductibleStatus = async (planId: string): Promise<DeductibleStatus> => {
  const { data } = await restClient.get(`/plans/${planId}/deductible`);
  return data;
};

/** Fetches copay information for a procedure under a plan. */
export const getCopayInfo = async (planId: string, procedureCode: string): Promise<CopayInfo> => {
  const { data } = await restClient.get(`/plans/${planId}/copay`, { params: { procedureCode } });
  return data;
};

/** Fetches the pre-authorization status for a pre-auth request. */
export const getPreAuthStatus = async (preAuthId: string): Promise<PreAuthStatus> => {
  const { data } = await restClient.get(`/pre-auth/${preAuthId}`);
  return data;
};

/** Downloads a claim document as a binary blob. */
export const downloadClaimDocument = async (
  claimId: string,
  documentId: string
): Promise<Blob> => {
  const { data } = await restClient.get(
    `/claims/${claimId}/documents/${documentId}/download`,
    { responseType: 'blob' }
  );
  return data;
};

/** Fetches all appeals for a claim. */
export const getClaimAppeals = async (claimId: string): Promise<ClaimAppeal[]> => {
  const { data } = await restClient.get(`/claims/${claimId}/appeals`);
  return data;
};

/** Submits a new appeal for a claim. */
export const submitClaimAppeal = async (
  claimId: string,
  appealData: AppealData
): Promise<ClaimAppeal> => {
  const { data } = await restClient.post(`/claims/${claimId}/appeals`, appealData);
  return data;
};

/** Compares multiple insurance plans side by side. */
export const getPlanComparison = async (planIds: string[]): Promise<PlanComparison> => {
  const { data } = await restClient.post('/plans/compare', { planIds });
  return data;
};

/** Fetches a shareable link for a digital insurance card. */
export const getDigitalCardShare = async (planId: string): Promise<ShareData> => {
  const { data } = await restClient.get(`/plans/${planId}/digital-card/share`);
  return data;
};
