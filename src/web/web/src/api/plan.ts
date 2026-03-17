import type { Plan, Claim, Coverage, Benefit } from 'shared/types/plan.types';

import { restClient } from './client';

// ---------------------------------------------------------------------------
// Local types for REST-only endpoints (ported from mobile)
// ---------------------------------------------------------------------------

export interface CoverageDetail {
    id: string;
    planId: string;
    categoryId: string;
    name: string;
    description: string;
    coveredPercent: number;
    annualLimit?: number;
    coPayment?: number;
    requiresReferral: boolean;
}

export interface ClaimTimelineEvent {
    id: string;
    claimId: string;
    status: string;
    description: string;
    timestamp: string;
    actor?: string;
}

export interface ClaimDocument {
    id: string;
    claimId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    url?: string;
}

export interface PlanDashboardData {
    planId: string;
    userId: string;
    deductibleUsed: number;
    deductibleTotal: number;
    outOfPocketUsed: number;
    outOfPocketMax: number;
    activeClaims: number;
    pendingClaims: number;
    nextPremiumDueDate: string;
    premiumAmount: number;
}

export interface ProviderFilter {
    specialty?: string;
    city?: string;
    state?: string;
    inNetwork?: boolean;
    acceptingNewPatients?: boolean;
}

export interface Provider {
    id: string;
    name: string;
    specialty: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    inNetwork: boolean;
    acceptingNewPatients: boolean;
    rating?: number;
}

export interface EOB {
    id: string;
    planId: string;
    claimId?: string;
    serviceDate: string;
    providerName: string;
    billedAmount: number;
    allowedAmount: number;
    planPaid: number;
    memberResponsibility: number;
    issuedAt: string;
}

export interface DeductibleStatus {
    planId: string;
    individual: { used: number; limit: number; remaining: number };
    family: { used: number; limit: number; remaining: number };
    periodStart: string;
    periodEnd: string;
}

export interface CopayInfo {
    planId: string;
    procedureCode: string;
    copayAmount: number;
    coinsurancePercent: number;
    requiresDeductibleFirst: boolean;
    notes?: string;
}

export interface PreAuthStatus {
    id: string;
    status: 'pending' | 'approved' | 'denied' | 'expired';
    serviceType: string;
    requestedDate: string;
    decisionDate?: string;
    expirationDate?: string;
    approvedUnits?: number;
    denialReason?: string;
}

export interface AppealData {
    reason: string;
    supportingDocuments?: string[];
    additionalNotes?: string;
}

export interface ClaimAppeal {
    id: string;
    claimId: string;
    status: 'submitted' | 'under_review' | 'resolved' | 'denied';
    reason: string;
    submittedAt: string;
    resolvedAt?: string;
    resolution?: string;
}

export interface PlanComparison {
    planIds: string[];
    plans: Array<{
        id: string;
        name: string;
        premium: number;
        deductible: number;
        outOfPocketMax: number;
        coverageHighlights: string[];
    }>;
}

export interface ShareData {
    shareUrl: string;
    expiresAt: string;
    qrCodeUrl?: string;
}

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

// ---------------------------------------------------------------------------
// Additional plan functions (ported from mobile)
// ---------------------------------------------------------------------------

/** Fetches all insurance plans for a user. */
export const getPlans = async (userId: string): Promise<Plan[]> => {
    const response = await restClient.get<Plan[]>('/plans', { params: { userId } });
    return response.data;
};

/** Fetches a specific claim by ID. */
export const getClaim = async (claimId: string): Promise<Claim> => {
    const response = await restClient.get<Claim>(`/plan/claims/${claimId}`);
    return response.data;
};

/** Fetches coverage details for a specific category within a plan. */
export const getCoverageDetail = async (planId: string, categoryId: string): Promise<CoverageDetail> => {
    const response = await restClient.get<CoverageDetail>(`/plans/${planId}/coverage/${categoryId}`);
    return response.data;
};

/** Fetches the status timeline for a claim. */
export const getClaimStatusTimeline = async (claimId: string): Promise<ClaimTimelineEvent[]> => {
    const response = await restClient.get<ClaimTimelineEvent[]>(`/claims/${claimId}/timeline`);
    return response.data;
};

/** Fetches documents attached to a claim. */
export const getClaimDocuments = async (claimId: string): Promise<ClaimDocument[]> => {
    const response = await restClient.get<ClaimDocument[]>(`/claims/${claimId}/documents`);
    return response.data;
};

/** Fetches the plan dashboard summary for a user. */
export const getPlanDashboard = async (userId: string): Promise<PlanDashboardData> => {
    const response = await restClient.get<PlanDashboardData>(`/users/${userId}/plan-dashboard`);
    return response.data;
};

/** Fetches in-network providers for a plan with optional filters. */
export const getNetworkProviders = async (planId: string, filters?: ProviderFilter): Promise<Provider[]> => {
    const response = await restClient.get<Provider[]>(`/plans/${planId}/providers`, { params: filters });
    return response.data;
};

/** Fetches Explanation of Benefits documents for a plan. */
export const getEOBs = async (planId: string, dateRange?: { start: string; end: string }): Promise<EOB[]> => {
    const response = await restClient.get<EOB[]>(`/plans/${planId}/eobs`, { params: dateRange });
    return response.data;
};

/** Fetches the current deductible status for a plan. */
export const getDeductibleStatus = async (planId: string): Promise<DeductibleStatus> => {
    const response = await restClient.get<DeductibleStatus>(`/plans/${planId}/deductible`);
    return response.data;
};

/** Fetches copay information for a procedure under a plan. */
export const getCopayInfo = async (planId: string, procedureCode: string): Promise<CopayInfo> => {
    const response = await restClient.get<CopayInfo>(`/plans/${planId}/copay`, {
        params: { procedureCode },
    });
    return response.data;
};

/** Fetches the pre-authorization status for a pre-auth request. */
export const getPreAuthStatus = async (preAuthId: string): Promise<PreAuthStatus> => {
    const response = await restClient.get<PreAuthStatus>(`/pre-auth/${preAuthId}`);
    return response.data;
};

/** Downloads a claim document as a binary blob. */
export const downloadClaimDocument = async (claimId: string, documentId: string): Promise<Blob> => {
    const response = await restClient.get<Blob>(`/claims/${claimId}/documents/${documentId}/download`, {
        responseType: 'blob',
    });
    return response.data;
};

/** Fetches all appeals for a claim. */
export const getClaimAppeals = async (claimId: string): Promise<ClaimAppeal[]> => {
    const response = await restClient.get<ClaimAppeal[]>(`/claims/${claimId}/appeals`);
    return response.data;
};

/** Submits a new appeal for a claim. */
export const submitClaimAppeal = async (claimId: string, appealData: AppealData): Promise<ClaimAppeal> => {
    const response = await restClient.post<ClaimAppeal>(`/claims/${claimId}/appeals`, appealData);
    return response.data;
};

/** Compares multiple insurance plans side by side. */
export const getPlanComparison = async (planIds: string[]): Promise<PlanComparison> => {
    const response = await restClient.post<PlanComparison>('/plans/compare', { planIds });
    return response.data;
};

/** Fetches a shareable link for a digital insurance card. */
export const getDigitalCardShare = async (planId: string): Promise<ShareData> => {
    const response = await restClient.get<ShareData>(`/plans/${planId}/digital-card/share`);
    return response.data;
};

/** Fetches a coverage summary for a user. */
export const getCoverageSummary = async (
    userId: string
): Promise<{ planName: string; coverageLevel: string; deductibleMet: number; outOfPocketMet: number }> => {
    const response = await restClient.get<{
        planName: string;
        coverageLevel: string;
        deductibleMet: number;
        outOfPocketMet: number;
    }>('/plan/coverage-summary', { params: { userId } });
    return response.data;
};

/** Requests pre-authorization for a service under a plan. */
export const requestPreAuth = async (
    planId: string,
    request: { serviceType: string; providerId: string; reason: string }
): Promise<PreAuthStatus> => {
    const response = await restClient.post<PreAuthStatus>(`/plans/${planId}/pre-auth`, request);
    return response.data;
};

/** Fetches a claim cost estimate for a procedure under a plan. */
export const getClaimEstimate = async (
    planId: string,
    procedureCode: string
): Promise<{ estimatedCost: number; estimatedCoverage: number; estimatedOutOfPocket: number }> => {
    const response = await restClient.get<{
        estimatedCost: number;
        estimatedCoverage: number;
        estimatedOutOfPocket: number;
    }>(`/plans/${planId}/claim-estimate`, { params: { procedureCode } });
    return response.data;
};

/** Fetches documents associated with a plan. */
export const getPlanDocuments = async (
    planId: string
): Promise<Array<{ id: string; name: string; type: string; url: string; uploadedAt: string }>> => {
    const response = await restClient.get<
        Array<{ id: string; name: string; type: string; url: string; uploadedAt: string }>
    >(`/plans/${planId}/documents`);
    return response.data;
};

/** Exports claim data for a user in the specified format. */
export const exportClaimData = async (
    userId: string,
    format: string,
    dateRange?: { start: string; end: string }
): Promise<{ url: string; expiresAt: string }> => {
    const response = await restClient.post<{ url: string; expiresAt: string }>('/plan/claims/export', {
        userId,
        format,
        dateRange,
    });
    return response.data;
};

/** Fetches payment history for a user. */
export const getPaymentHistory = async (
    userId: string,
    page?: number
): Promise<Array<{ id: string; amount: number; date: string; description: string; status: string }>> => {
    const response = await restClient.get<
        Array<{ id: string; amount: number; date: string; description: string; status: string }>
    >('/plan/payments/history', { params: { userId, page } });
    return response.data;
};
