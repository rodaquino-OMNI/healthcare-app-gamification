import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/PlanLayout', () => ({
    PlanLayout: ({ children }: any) => <div data-testid="plan-layout">{children}</div>,
}));

jest.mock('src/web/web/src/hooks/useAuth', () => ({
    useAuth: () => ({
        session: { accessToken: 'mock-token' },
    }),
}));

jest.mock('src/web/design-system/src/plan/InsuranceCard/InsuranceCard', () => ({
    InsuranceCard: ({ plan, user }: any) => (
        <div data-testid="insurance-card">
            <span>{plan.planNumber}</span>
            <span>{user.name}</span>
        </div>
    ),
}));

jest.mock('src/web/design-system/src/plan/ClaimCard/ClaimCard', () => ({
    ClaimCard: ({ claim, onViewDetails }: any) => (
        <div data-testid="claim-card">
            <span>{claim.id}</span>
            <button onClick={onViewDetails}>View Details</button>
        </div>
    ),
}));

jest.mock('src/web/design-system/src/primitives', () => ({
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('@web/design-system/src/tokens', () => ({
    colors: {
        journeys: {
            plan: { primary: '#7c4dff', text: '#2d1b69', accent: '#9c6eff' },
        },
        semantic: { success: '#22c55e' },
        gray: { 50: '#888' },
    },
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            '2xl': '1.5rem',
            'heading-2xl': '2rem',
            'heading-lg': '1.5rem',
            'text-md': '1rem',
            'text-sm': '0.875rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '2xs': '6px',
    },
    borderRadius: { md: '8px' },
}));

jest.mock('src/web/shared/constants/routes', () => ({
    WEB_PLAN_ROUTES: {
        CLAIMS: '/plan/claims',
        COVERAGE: '/plan/coverage',
        COST_SIMULATOR: '/plan/simulator',
    },
}));

import PlanDashboard from '../../../pages/plan/index';

describe('Plan Dashboard Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<PlanDashboard />);
        expect(container).toBeTruthy();
    });

    it('renders the plan layout', () => {
        render(<PlanDashboard />);
        expect(screen.getByTestId('plan-layout')).toBeTruthy();
    });

    it('renders the page title', () => {
        render(<PlanDashboard />);
        expect(screen.getByText(/meu plano & beneficios/i)).toBeTruthy();
    });

    it('renders the stats section', () => {
        render(<PlanDashboard />);
        expect(screen.getByText(/total de solicitacoes/i)).toBeTruthy();
        expect(screen.getByText(/beneficios ativos/i)).toBeTruthy();
        expect(screen.getByText(/cobertura/i)).toBeTruthy();
    });

    it('renders the insurance card section', () => {
        render(<PlanDashboard />);
        expect(screen.getByText(/seu cartao digital/i)).toBeTruthy();
    });

    it('renders insurance card component', () => {
        render(<PlanDashboard />);
        expect(screen.getByTestId('insurance-card')).toBeTruthy();
    });

    it('renders recent claims section', () => {
        render(<PlanDashboard />);
        expect(screen.getByText(/solicitacoes recentes/i)).toBeTruthy();
    });

    it('renders claim cards', () => {
        render(<PlanDashboard />);
        const claimCards = screen.getAllByTestId('claim-card');
        expect(claimCards.length).toBeGreaterThan(0);
    });

    it('renders quick actions section', () => {
        render(<PlanDashboard />);
        expect(screen.getByText(/acoes rapidas/i)).toBeTruthy();
        expect(screen.getByText(/ver cobertura/i)).toBeTruthy();
    });
});
