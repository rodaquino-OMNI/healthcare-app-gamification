import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/web/src/hooks/useClaims', () => ({
    useClaims: () => ({
        claims: [
            {
                id: 'c1',
                planId: 'p1',
                type: 'medical',
                amount: 200,
                status: 'approved',
                submittedAt: '2026-01-01',
                documents: [],
            },
            {
                id: 'c2',
                planId: 'p1',
                type: 'dental',
                amount: 150,
                status: 'pending',
                submittedAt: '2026-01-15',
                documents: [],
            },
        ],
        loading: false,
        error: null,
    }),
}));

jest.mock('src/web/web/src/hooks/useJourney', () => ({
    useJourney: () => ({
        journey: 'plan',
        t: (key: string) => key,
    }),
}));

jest.mock('src/web/design-system/src/plan/ClaimCard', () => ({
    ClaimCard: ({ claim, onViewDetails }: any) => (
        <div data-testid="claim-card" data-status={claim.status}>
            <span>{claim.type}</span>
            <button onClick={onViewDetails}>View</button>
        </div>
    ),
}));

jest.mock('@web/design-system/src/tokens', () => ({
    colors: {
        journeys: { plan: { primary: '#7c4dff', text: '#2d1b69' } },
        semantic: { error: '#ef4444' },
        gray: { 20: '#e5e7eb', 50: '#888' },
    },
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: { 'heading-xl': '1.75rem', 'text-lg': '1.125rem', 'text-sm': '0.875rem' },
        fontWeight: { semiBold: 600, medium: 500 },
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '3xl': '64px',
    },
    borderRadius: { md: '8px', full: '9999px' },
}));

import Claims from '../../../pages/plan/claims/index';

describe('Claims Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<Claims />);
        expect(container).toBeTruthy();
    });

    it('renders claim cards', () => {
        render(<Claims />);
        const claimCards = screen.getAllByTestId('claim-card');
        expect(claimCards.length).toBeGreaterThan(0);
    });

    it('renders filter tabs', () => {
        render(<Claims />);
        expect(screen.getByText('Todos')).toBeTruthy();
        expect(screen.getByText('Pendentes')).toBeTruthy();
        expect(screen.getByText('Aprovados')).toBeTruthy();
        expect(screen.getByText('Negados')).toBeTruthy();
    });

    it('filters claims by pending status', () => {
        render(<Claims />);
        fireEvent.click(screen.getByText('Pendentes'));
        const claimCards = screen.getAllByTestId('claim-card');
        claimCards.forEach((card) => {
            expect(card.getAttribute('data-status')).toBe('pending');
        });
    });

    it('filters claims by approved status', () => {
        render(<Claims />);
        fireEvent.click(screen.getByText('Aprovados'));
        const claimCards = screen.getAllByTestId('claim-card');
        claimCards.forEach((card) => {
            expect(card.getAttribute('data-status')).toBe('approved');
        });
    });

    it('shows all claims by default', () => {
        render(<Claims />);
        const claimCards = screen.getAllByTestId('claim-card');
        expect(claimCards.length).toBe(2);
    });

    it('has add claim button', () => {
        render(<Claims />);
        const addButtons = screen.getAllByText(/nova solicitacao|primeira solicitacao|addclaim/i);
        expect(addButtons.length).toBeGreaterThan(0);
    });
});
