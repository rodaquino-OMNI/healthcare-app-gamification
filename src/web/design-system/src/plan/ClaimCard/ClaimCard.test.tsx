import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ClaimCard from './ClaimCard';
// eslint-disable-next-line import/no-unresolved
import { Claim, ClaimStatus } from '../../../shared/types/plan.types';

// Mock the i18next hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options) => {
            // Mock implementation to simulate translation
            if (key.startsWith('claim.type.')) {
                return key.split('.').pop();
            }
            if (key.startsWith('claim.status.')) {
                return key.split('.').pop();
            }
            if (key === 'claim.submittedOn') {
                return 'Submitted on';
            }
            if (key === 'claim.viewDetails') {
                return 'View Details';
            }
            if (key === 'claim.track') {
                return 'Track Claim';
            }
            if (key.startsWith('claim.documents')) {
                const count = options?.count || 0;
                return `${count} Documents`;
            }
            return key;
        },
    }),
}));

describe('ClaimCard', () => {
    // Sample claim data for testing
    const mockClaim: Claim = {
        id: 'claim-123',
        planId: 'plan-456',
        type: 'medical',
        amount: 150.0,
        status: 'pending',
        submittedAt: '2023-04-15T10:30:00Z',
        documents: [],
    };

    it('renders claim data correctly', () => {
        render(<ClaimCard claim={mockClaim} />);

        // Check type is displayed
        expect(screen.getByText('medical')).toBeInTheDocument();

        // Check amount is displayed (checking for partial text to avoid locale issues)
        expect(screen.getByText(/150/)).toBeInTheDocument();

        // Check submission date is displayed
        expect(screen.getByText(/Submitted on/)).toBeInTheDocument();

        // Check status is displayed
        expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it("displays 'pending' status correctly", () => {
        const pendingClaim = { ...mockClaim, status: 'pending' as ClaimStatus };
        render(<ClaimCard claim={pendingClaim} />);

        expect(screen.getByText('pending')).toBeInTheDocument();
        expect(screen.getByTestId('icon-container')).toBeInTheDocument();
    });

    it("displays 'approved' status correctly", () => {
        const approvedClaim = { ...mockClaim, status: 'approved' as ClaimStatus };
        render(<ClaimCard claim={approvedClaim} />);

        expect(screen.getByText('approved')).toBeInTheDocument();
        expect(screen.getByTestId('icon-container')).toBeInTheDocument();
    });

    it("displays 'denied' status correctly", () => {
        const deniedClaim = { ...mockClaim, status: 'denied' as ClaimStatus };
        render(<ClaimCard claim={deniedClaim} />);

        expect(screen.getByText('denied')).toBeInTheDocument();
        expect(screen.getByTestId('icon-container')).toBeInTheDocument();
    });

    it("displays 'additional_info_required' status correctly", () => {
        const additionalInfoClaim = {
            ...mockClaim,
            status: 'additional_info_required' as ClaimStatus,
        };
        render(<ClaimCard claim={additionalInfoClaim} />);

        expect(screen.getByText('additional_info_required')).toBeInTheDocument();
        expect(screen.getByTestId('icon-container')).toBeInTheDocument();
    });

    it('shows action buttons when showActions is true', () => {
        const onViewDetails = jest.fn();
        const onTrackClaim = jest.fn();

        render(
            <ClaimCard claim={mockClaim} showActions={true} onViewDetails={onViewDetails} onTrackClaim={onTrackClaim} />
        );

        // Both buttons should be visible
        expect(screen.getByText('View Details')).toBeInTheDocument();
        expect(screen.getByText('Track Claim')).toBeInTheDocument();

        // Click the buttons and check if callbacks are called
        fireEvent.click(screen.getByText('View Details'));
        expect(onViewDetails).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Track Claim'));
        expect(onTrackClaim).toHaveBeenCalledTimes(1);
    });

    it('hides action buttons when showActions is false', () => {
        render(<ClaimCard claim={mockClaim} showActions={false} onViewDetails={jest.fn()} onTrackClaim={jest.fn()} />);

        // Buttons should not be visible
        expect(screen.queryByText('View Details')).not.toBeInTheDocument();
        expect(screen.queryByText('Track Claim')).not.toBeInTheDocument();
    });

    it('renders in compact mode correctly', () => {
        render(<ClaimCard claim={mockClaim} compact={true} onViewDetails={jest.fn()} onTrackClaim={jest.fn()} />);

        // In compact mode, action buttons should not be visible
        expect(screen.queryByText('View Details')).not.toBeInTheDocument();
        expect(screen.queryByText('Track Claim')).not.toBeInTheDocument();

        // Should still show essential information
        expect(screen.getByText('medical')).toBeInTheDocument();
        expect(screen.getByText(/150/)).toBeInTheDocument();
        expect(screen.getByText('pending')).toBeInTheDocument();
    });

    it('displays document count when documents are present', () => {
        const claimWithDocuments = {
            ...mockClaim,
            documents: [{ id: 'doc1', type: 'receipt', filePath: '/path', uploadedAt: '2023-01-01' }],
        };

        render(<ClaimCard claim={claimWithDocuments} />);

        // Should display document count
        expect(screen.getByText('1 Documents')).toBeInTheDocument();
    });

    it('does not display document count in compact mode even if documents are present', () => {
        const claimWithDocuments = {
            ...mockClaim,
            documents: [{ id: 'doc1', type: 'receipt', filePath: '/path', uploadedAt: '2023-01-01' }],
        };

        render(<ClaimCard claim={claimWithDocuments} compact={true} />);

        // Should not display document count in compact mode
        expect(screen.queryByText('1 Documents')).not.toBeInTheDocument();
    });

    it('triggers onPress callback when card is clicked', () => {
        const onPress = jest.fn();

        render(<ClaimCard claim={mockClaim} onPress={onPress} />);

        // Find the card and click it
        const card = screen.getByRole('button');
        fireEvent.click(card);

        // Check if callback was called
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility label', () => {
        render(<ClaimCard claim={mockClaim} />);

        // Check the accessibility label of the card
        const card = screen.getByRole('button');
        expect(card).toHaveAttribute('aria-label', expect.stringContaining('medical'));
        expect(card).toHaveAttribute('aria-label', expect.stringContaining('pending'));
    });

    it('uses custom accessibility label when provided', () => {
        const customLabel = 'Custom accessibility label';
        render(<ClaimCard claim={mockClaim} accessibilityLabel={customLabel} />);

        // Check the custom accessibility label
        const card = screen.getByRole('button');
        expect(card).toHaveAttribute('aria-label', customLabel);
    });
});
