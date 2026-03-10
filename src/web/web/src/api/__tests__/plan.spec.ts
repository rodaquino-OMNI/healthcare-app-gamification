/**
 * Tests for src/web/web/src/api/plan.ts
 *
 * The web plan module uses restClient (axios).
 * We mock restClient to validate endpoints, methods, and error handling.
 */

import {
    getPlan,
    getClaims,
    getCoverage,
    getBenefits,
    submitClaim,
    updateClaim,
    cancelClaim,
    uploadClaimDocument,
    simulateCost,
    getDigitalCard,
} from '../plan';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../client', () => ({
    restClient: mockClient,
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// getPlan
// ---------------------------------------------------------------------------

describe('getPlan', () => {
    it('should GET /plan with userId', async () => {
        const plan = { id: 'p1', name: 'Gold Plan' };
        mockClient.get.mockResolvedValue({ data: plan });

        const result = await getPlan('u1');

        expect(mockClient.get).toHaveBeenCalledWith('/plan?userId=u1');
        expect(result).toEqual(plan);
    });
});

// ---------------------------------------------------------------------------
// getClaims
// ---------------------------------------------------------------------------

describe('getClaims', () => {
    it('should GET /plan/claims with userId', async () => {
        const claims = [{ id: 'c1', status: 'pending' }];
        mockClient.get.mockResolvedValue({ data: claims });

        const result = await getClaims('u1');

        expect(mockClient.get).toHaveBeenCalledWith('/plan/claims?userId=u1');
        expect(result).toEqual(claims);
    });
});

// ---------------------------------------------------------------------------
// getCoverage
// ---------------------------------------------------------------------------

describe('getCoverage', () => {
    it('should GET /plan/coverage with userId', async () => {
        const coverage = { id: 'cv1', type: 'medical' };
        mockClient.get.mockResolvedValue({ data: coverage });

        const result = await getCoverage('u1');

        expect(mockClient.get).toHaveBeenCalledWith('/plan/coverage?userId=u1');
        expect(result).toEqual(coverage);
    });
});

// ---------------------------------------------------------------------------
// getBenefits
// ---------------------------------------------------------------------------

describe('getBenefits', () => {
    it('should GET /plan/benefits with userId', async () => {
        const benefits = [{ id: 'b1', name: 'Dental' }];
        mockClient.get.mockResolvedValue({ data: benefits });

        const result = await getBenefits('u1');

        expect(mockClient.get).toHaveBeenCalledWith('/plan/benefits?userId=u1');
        expect(result).toEqual(benefits);
    });
});

// ---------------------------------------------------------------------------
// submitClaim
// ---------------------------------------------------------------------------

describe('submitClaim', () => {
    it('should POST /plan/claims with claim data', async () => {
        const claim = { id: 'c1', type: 'medical' };
        mockClient.post.mockResolvedValue({ data: claim });

        const result = await submitClaim({ type: 'medical' } as any);

        expect(mockClient.post).toHaveBeenCalledWith('/plan/claims', { type: 'medical' });
        expect(result).toEqual(claim);
    });
});

// ---------------------------------------------------------------------------
// updateClaim
// ---------------------------------------------------------------------------

describe('updateClaim', () => {
    it('should PUT /plan/claims/:id with claim data', async () => {
        const claim = { id: 'c1', notes: 'updated' };
        mockClient.put.mockResolvedValue({ data: claim });

        const result = await updateClaim('c1', { notes: 'updated' } as any);

        expect(mockClient.put).toHaveBeenCalledWith('/plan/claims/c1', { notes: 'updated' });
        expect(result).toEqual(claim);
    });
});

// ---------------------------------------------------------------------------
// cancelClaim
// ---------------------------------------------------------------------------

describe('cancelClaim', () => {
    it('should DELETE /plan/claims/:id', async () => {
        mockClient.delete.mockResolvedValue({});

        await cancelClaim('c1');

        expect(mockClient.delete).toHaveBeenCalledWith('/plan/claims/c1');
    });
});

// ---------------------------------------------------------------------------
// uploadClaimDocument
// ---------------------------------------------------------------------------

describe('uploadClaimDocument', () => {
    it('should POST /plan/claims/:id/documents', async () => {
        mockClient.post.mockResolvedValue({ data: { url: 'https://doc.url' } });

        const result = await uploadClaimDocument('c1', new File([], 'doc.pdf'));

        expect(mockClient.post).toHaveBeenCalledWith('/plan/claims/c1/documents');
        expect(result).toBe('https://doc.url');
    });
});

// ---------------------------------------------------------------------------
// simulateCost
// ---------------------------------------------------------------------------

describe('simulateCost', () => {
    it('should GET /plan/cost-simulator with procedureCode', async () => {
        const cost = { estimatedCost: 250 };
        mockClient.get.mockResolvedValue({ data: cost });

        const result = await simulateCost('XYZ123');

        expect(mockClient.get).toHaveBeenCalledWith('/plan/cost-simulator?procedureCode=XYZ123');
        expect(result).toEqual(cost);
    });
});

// ---------------------------------------------------------------------------
// getDigitalCard
// ---------------------------------------------------------------------------

describe('getDigitalCard', () => {
    it('should GET /plan/digital-card', async () => {
        const card = { plan: { id: 'p1', name: 'Gold' } };
        mockClient.get.mockResolvedValue({ data: card });

        const result = await getDigitalCard();

        expect(mockClient.get).toHaveBeenCalledWith('/plan/digital-card');
        expect(result).toEqual(card);
    });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe('error handling', () => {
    it('should propagate network errors', async () => {
        mockClient.get.mockRejectedValue(new Error('Network error'));

        await expect(getPlan('u1')).rejects.toThrow('Network error');
    });
});
