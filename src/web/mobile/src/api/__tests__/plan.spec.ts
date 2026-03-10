/**
 * Tests for src/web/mobile/src/api/plan.ts
 *
 * The mobile plan module uses both graphQLClient and restClient.
 * GraphQL: getPlans, getPlan, getClaims, getClaim, submitClaim, updateClaim, cancelClaim.
 * REST: simulateCost, getDigitalCard, getBenefits, getCoverageDetail, etc.
 */

import { graphQLClient, restClient } from '../client';
import {
    // GraphQL
    getPlans,
    getPlan,
    getClaims,
    getClaim,
    submitClaim,
    updateClaim,
    cancelClaim,
    // REST
    simulateCost,
    getDigitalCard,
    getBenefits,
    getCoverageDetail,
    getClaimStatusTimeline,
    getClaimDocuments,
    getPlanDashboard,
    getNetworkProviders,
    getEOBs,
    getDeductibleStatus,
    getCopayInfo,
    getPreAuthStatus,
    downloadClaimDocument,
    getClaimAppeals,
    submitClaimAppeal,
    getPlanComparison,
    getDigitalCardShare,
} from '../plan';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../client', () => ({
    graphQLClient: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
    restClient: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('apollo-upload-client', () => ({
    ReactNativeFile: jest.fn().mockImplementation((args: any) => args),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ===========================================================================
// GraphQL functions
// ===========================================================================

describe('getPlans (GraphQL)', () => {
    it('should query with userId and network-only policy', async () => {
        const plans = [{ id: 'p1', name: 'Gold Plan' }];
        (graphQLClient.query as jest.Mock).mockResolvedValue({ data: { getPlans: plans } });

        const result = await getPlans('u1');

        expect(graphQLClient.query).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { userId: 'u1' },
                fetchPolicy: 'network-only',
            })
        );
        expect(result).toEqual(plans);
    });
});

describe('getPlan (GraphQL)', () => {
    it('should query with planId and cache-first policy', async () => {
        const plan = { id: 'p1', name: 'Gold Plan' };
        (graphQLClient.query as jest.Mock).mockResolvedValue({ data: { getPlan: plan } });

        const result = await getPlan('p1');

        expect(graphQLClient.query).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { planId: 'p1' },
                fetchPolicy: 'cache-first',
            })
        );
        expect(result).toEqual(plan);
    });
});

describe('getClaims (GraphQL)', () => {
    it('should query with planId and optional status', async () => {
        const claims = [{ id: 'c1', status: 'pending' }];
        (graphQLClient.query as jest.Mock).mockResolvedValue({ data: { getClaims: claims } });

        const result = await getClaims('p1', 'pending' as any);

        expect(graphQLClient.query).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { planId: 'p1', status: 'pending' },
            })
        );
        expect(result).toEqual(claims);
    });
});

describe('getClaim (GraphQL)', () => {
    it('should query with claimId', async () => {
        const claim = { id: 'c1', amount: 100 };
        (graphQLClient.query as jest.Mock).mockResolvedValue({ data: { getClaim: claim } });

        const result = await getClaim('c1');

        expect(graphQLClient.query).toHaveBeenCalledWith(expect.objectContaining({ variables: { claimId: 'c1' } }));
        expect(result).toEqual(claim);
    });
});

describe('submitClaim (GraphQL)', () => {
    it('should mutate with plan and claim data', async () => {
        const claim = { id: 'c1', type: 'medical' };
        (graphQLClient.mutate as jest.Mock).mockResolvedValue({ data: { submitClaim: claim } });

        const claimData = {
            type: 'medical',
            procedureCode: 'XYZ',
            providerName: 'Hospital',
            serviceDate: '2025-01-01',
            amount: 500,
        };
        const result = await submitClaim('p1', claimData);

        expect(graphQLClient.mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: expect.objectContaining({ planId: 'p1', type: 'medical' }),
            })
        );
        expect(result).toEqual(claim);
    });
});

describe('updateClaim (GraphQL)', () => {
    it('should mutate with claim id and additional info', async () => {
        const claim = { id: 'c1', additionalInfo: { note: 'updated' } };
        (graphQLClient.mutate as jest.Mock).mockResolvedValue({ data: { updateClaim: claim } });

        const result = await updateClaim('c1', { note: 'updated' });

        expect(graphQLClient.mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: { id: 'c1', additionalInfo: { note: 'updated' } },
            })
        );
        expect(result).toEqual(claim);
    });
});

describe('cancelClaim (GraphQL)', () => {
    it('should mutate with claim id', async () => {
        const claim = { id: 'c1', status: 'cancelled' };
        (graphQLClient.mutate as jest.Mock).mockResolvedValue({ data: { cancelClaim: claim } });

        const result = await cancelClaim('c1');

        expect(graphQLClient.mutate).toHaveBeenCalledWith(expect.objectContaining({ variables: { id: 'c1' } }));
        expect(result).toEqual(claim);
    });
});

// ===========================================================================
// REST functions
// ===========================================================================

describe('simulateCost', () => {
    it('should POST /plans/:id/simulate-cost', async () => {
        const costResult = { totalCost: 500, coveredAmount: 400, outOfPocket: 100 };
        (restClient.post as jest.Mock).mockResolvedValue({ data: costResult });

        const result = await simulateCost('p1', { procedureCode: 'ABC' });

        expect(restClient.post).toHaveBeenCalledWith('/plans/p1/simulate-cost', { procedureCode: 'ABC' });
        expect(result).toEqual(costResult);
    });
});

describe('getDigitalCard', () => {
    it('should GET /plans/:id/digital-card', async () => {
        const card = { cardImageUrl: 'https://card.png', cardData: {} };
        (restClient.get as jest.Mock).mockResolvedValue({ data: card });

        const result = await getDigitalCard('p1');

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/digital-card');
        expect(result).toEqual(card);
    });
});

describe('getBenefits', () => {
    it('should GET /plans/:id/benefits', async () => {
        const benefits = [{ id: 'b1', name: 'Dental' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: benefits });

        const result = await getBenefits('p1');

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/benefits');
        expect(result).toEqual(benefits);
    });
});

describe('getCoverageDetail', () => {
    it('should GET /plans/:id/coverage/:categoryId', async () => {
        const detail = { id: 'cv1', coveredPercent: 80 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: detail });

        const result = await getCoverageDetail('p1', 'dental');

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/coverage/dental');
        expect(result).toEqual(detail);
    });
});

describe('getClaimStatusTimeline', () => {
    it('should GET /claims/:id/timeline', async () => {
        const events = [{ id: 'e1', status: 'submitted' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: events });

        const result = await getClaimStatusTimeline('c1');

        expect(restClient.get).toHaveBeenCalledWith('/claims/c1/timeline');
        expect(result).toEqual(events);
    });
});

describe('getClaimDocuments', () => {
    it('should GET /claims/:id/documents', async () => {
        const docs = [{ id: 'd1', fileName: 'receipt.pdf' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: docs });

        const result = await getClaimDocuments('c1');

        expect(restClient.get).toHaveBeenCalledWith('/claims/c1/documents');
        expect(result).toEqual(docs);
    });
});

describe('getPlanDashboard', () => {
    it('should GET /users/:id/plan-dashboard', async () => {
        const dashboard = { planId: 'p1', deductibleUsed: 500 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: dashboard });

        const result = await getPlanDashboard('u1');

        expect(restClient.get).toHaveBeenCalledWith('/users/u1/plan-dashboard');
        expect(result).toEqual(dashboard);
    });
});

describe('getNetworkProviders', () => {
    it('should GET /plans/:id/providers with optional filters', async () => {
        const providers = [{ id: 'pr1', name: 'Hospital ABC' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: providers });

        const result = await getNetworkProviders('p1', { specialty: 'cardiology' });

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/providers', { params: { specialty: 'cardiology' } });
        expect(result).toEqual(providers);
    });
});

describe('getEOBs', () => {
    it('should GET /plans/:id/eobs with optional date range', async () => {
        const eobs = [{ id: 'eob1', billedAmount: 1000 }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: eobs });

        const result = await getEOBs('p1', { start: '2025-01-01', end: '2025-01-31' });

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/eobs', {
            params: { start: '2025-01-01', end: '2025-01-31' },
        });
        expect(result).toEqual(eobs);
    });
});

describe('getDeductibleStatus', () => {
    it('should GET /plans/:id/deductible', async () => {
        const status = { planId: 'p1', individual: { used: 500, limit: 2000 } };
        (restClient.get as jest.Mock).mockResolvedValue({ data: status });

        const result = await getDeductibleStatus('p1');

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/deductible');
        expect(result).toEqual(status);
    });
});

describe('getCopayInfo', () => {
    it('should GET /plans/:id/copay with procedureCode param', async () => {
        const info = { copayAmount: 25 };
        (restClient.get as jest.Mock).mockResolvedValue({ data: info });

        const result = await getCopayInfo('p1', 'ABC123');

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/copay', { params: { procedureCode: 'ABC123' } });
        expect(result).toEqual(info);
    });
});

describe('getPreAuthStatus', () => {
    it('should GET /pre-auth/:id', async () => {
        const status = { id: 'pa1', status: 'approved' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: status });

        const result = await getPreAuthStatus('pa1');

        expect(restClient.get).toHaveBeenCalledWith('/pre-auth/pa1');
        expect(result).toEqual(status);
    });
});

describe('downloadClaimDocument', () => {
    it('should GET /claims/:id/documents/:docId/download as blob', async () => {
        const blob = new Blob(['pdf content']);
        (restClient.get as jest.Mock).mockResolvedValue({ data: blob });

        const result = await downloadClaimDocument('c1', 'd1');

        expect(restClient.get).toHaveBeenCalledWith('/claims/c1/documents/d1/download', { responseType: 'blob' });
        expect(result).toEqual(blob);
    });
});

describe('getClaimAppeals', () => {
    it('should GET /claims/:id/appeals', async () => {
        const appeals = [{ id: 'ap1', status: 'submitted' }];
        (restClient.get as jest.Mock).mockResolvedValue({ data: appeals });

        const result = await getClaimAppeals('c1');

        expect(restClient.get).toHaveBeenCalledWith('/claims/c1/appeals');
        expect(result).toEqual(appeals);
    });
});

describe('submitClaimAppeal', () => {
    it('should POST /claims/:id/appeals', async () => {
        const appeal = { id: 'ap1', reason: 'Wrong denial' };
        (restClient.post as jest.Mock).mockResolvedValue({ data: appeal });

        const result = await submitClaimAppeal('c1', { reason: 'Wrong denial' });

        expect(restClient.post).toHaveBeenCalledWith('/claims/c1/appeals', { reason: 'Wrong denial' });
        expect(result).toEqual(appeal);
    });
});

describe('getPlanComparison', () => {
    it('should POST /plans/compare with plan IDs', async () => {
        const comparison = { planIds: ['p1', 'p2'], plans: [] };
        (restClient.post as jest.Mock).mockResolvedValue({ data: comparison });

        const result = await getPlanComparison(['p1', 'p2']);

        expect(restClient.post).toHaveBeenCalledWith('/plans/compare', { planIds: ['p1', 'p2'] });
        expect(result).toEqual(comparison);
    });
});

describe('getDigitalCardShare', () => {
    it('should GET /plans/:id/digital-card/share', async () => {
        const share = { shareUrl: 'https://share.link', expiresAt: '2025-02-01' };
        (restClient.get as jest.Mock).mockResolvedValue({ data: share });

        const result = await getDigitalCardShare('p1');

        expect(restClient.get).toHaveBeenCalledWith('/plans/p1/digital-card/share');
        expect(result).toEqual(share);
    });
});

// ===========================================================================
// Error handling
// ===========================================================================

describe('error handling', () => {
    it('should propagate GraphQL errors', async () => {
        (graphQLClient.query as jest.Mock).mockRejectedValue(new Error('GraphQL error'));

        await expect(getPlans('u1')).rejects.toThrow('GraphQL error');
    });

    it('should propagate REST errors', async () => {
        (restClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(getBenefits('p1')).rejects.toThrow('Network error');
    });
});
