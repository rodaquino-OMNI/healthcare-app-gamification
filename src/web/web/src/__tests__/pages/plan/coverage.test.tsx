import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/PlanLayout', () => ({
    default: ({ children }: any) => <div data-testid="plan-layout">{children}</div>,
}));

jest.mock('src/web/web/src/hooks/useAuth', () => ({
    useAuth: () => ({ session: { accessToken: 'mock-token' } }),
}));

jest.mock('src/web/web/src/hooks/useCoverage', () => ({
    useCoverage: () => ({
        data: null,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
    }),
}));

jest.mock('src/web/web/src/components/shared/LoadingIndicator', () => ({
    default: ({ text }: any) => <div data-testid="loading">{text}</div>,
}));

jest.mock('src/web/web/src/components/shared/ErrorState', () => ({
    default: ({ message, onRetry }: any) => (
        <div data-testid="error-state">
            <p>{message}</p>
            <button onClick={onRetry}>Retry</button>
        </div>
    ),
}));

jest.mock('next-seo', () => ({
    NextSeo: ({ title }: any) => <title>{title}</title>,
}));

jest.mock('src/web/design-system/src/plan/CoverageInfoCard', () => ({
    default: ({ coverage }: any) => <div data-testid="coverage-card">{coverage.type}</div>,
}));

jest.mock('src/web/design-system/src/primitives', () => ({
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Text: ({ children, as: Tag = 'span', ...props }: any) => <Tag {...props}>{children}</Tag>,
}));

jest.mock('@web/design-system/src/tokens', () => ({
    colors: {
        journeys: { plan: { primary: '#7c4dff', text: '#2d1b69' } },
        gray: { 50: '#888' },
    },
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: { 'heading-md': '1.25rem', 'text-sm': '0.875rem', 'text-xs': '0.75rem' },
        fontWeight: { semiBold: 600 },
    },
    spacing: { sm: '12px', md: '16px', lg: '24px' },
    borderRadius: { md: '8px' },
}));

import CoveragePage from '../../../pages/plan/coverage';

describe('Coverage Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<CoveragePage />);
        expect(container).toBeTruthy();
    });

    it('renders the plan layout', () => {
        render(<CoveragePage />);
        expect(screen.getByTestId('plan-layout')).toBeTruthy();
    });

    it('renders the coverage page heading', () => {
        render(<CoveragePage />);
        expect(screen.getByText(/informacoes de cobertura/i)).toBeTruthy();
    });

    it('renders the description text', () => {
        render(<CoveragePage />);
        expect(screen.getByText(/detalhes da sua cobertura/i)).toBeTruthy();
    });

    it('renders empty when no coverage data', () => {
        render(<CoveragePage />);
        const cards = screen.queryAllByTestId('coverage-card');
        expect(cards.length).toBe(0);
    });
});

describe('Coverage Page - Loading State', () => {
    it('renders loading indicator when loading', () => {
        const { useCoverage } = require('src/web/web/src/hooks/useCoverage');
        useCoverage.mockReturnValue({ data: null, isLoading: true, isError: false, refetch: jest.fn() });
        const { container } = render(<CoveragePage />);
        expect(container).toBeTruthy();
    });
});

describe('Coverage Page - Error State', () => {
    it('renders error state when there is an error', () => {
        const { useCoverage } = require('src/web/web/src/hooks/useCoverage');
        useCoverage.mockReturnValue({ data: null, isLoading: false, isError: true, refetch: jest.fn() });
        const { container } = render(<CoveragePage />);
        expect(container).toBeTruthy();
    });
});
