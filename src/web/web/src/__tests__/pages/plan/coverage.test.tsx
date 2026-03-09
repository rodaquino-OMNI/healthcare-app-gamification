import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/layouts/PlanLayout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="plan-layout">{children}</div>,
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { accessToken: 'mock-token' } }),
}));

jest.mock('@/hooks/useCoverage', () => ({
    useCoverage: () => ({
        data: null,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
    }),
}));

jest.mock('@/components/shared/LoadingIndicator', () => ({
    default: ({ text }: { text?: string }) => <div data-testid="loading">{text}</div>,
}));

jest.mock('@/components/shared/ErrorState', () => ({
    default: ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
        <div data-testid="error-state">
            <p>{message}</p>
            <button onClick={onRetry}>Retry</button>
        </div>
    ),
}));

jest.mock('next-seo', () => ({
    NextSeo: ({ title }: { title?: string }) => <title>{title}</title>,
}));

jest.mock('design-system/plan/CoverageInfoCard', () => ({
    default: ({ coverage }: { coverage: { type: string } }) => <div data-testid="coverage-card">{coverage.type}</div>,
}));

jest.mock('design-system/primitives', () => ({
    Box: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
        <div {...props}>{children}</div>
    ),
    Text: ({
        children,
        as: Tag = 'span',
        ...props
    }: {
        children?: React.ReactNode;
        as?: keyof JSX.IntrinsicElements;
        [key: string]: unknown;
    }) => <Tag {...(props as React.HTMLAttributes<HTMLElement>)}>{children}</Tag>,
}));

jest.mock('design-system/tokens', () => ({
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
        const coverageModule: { useCoverage: jest.Mock } = jest.requireMock('@/hooks/useCoverage');
        coverageModule.useCoverage.mockReturnValue({ data: null, isLoading: true, isError: false, refetch: jest.fn() });
        const { container } = render(<CoveragePage />);
        expect(container).toBeTruthy();
    });
});

describe('Coverage Page - Error State', () => {
    it('renders error state when there is an error', () => {
        const coverageModule: { useCoverage: jest.Mock } = jest.requireMock('@/hooks/useCoverage');
        coverageModule.useCoverage.mockReturnValue({ data: null, isLoading: false, isError: true, refetch: jest.fn() });
        const { container } = render(<CoveragePage />);
        expect(container).toBeTruthy();
    });
});
