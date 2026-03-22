import { render, screen } from '@testing-library/react';
import React from 'react';

interface MockSpreadProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
    disabled?: boolean;
}

interface MockBadgeProps {
    children?: React.ReactNode;
    status?: string;
}

interface MockProgressBarProps {
    current: number;
    total: number;
    ariaLabel?: string;
}

// Single combined mock for all design-system component/primitive paths.
// All these paths resolve to the same module via moduleNameMapper, so only
// one jest.mock registration is needed — multiple calls overwrite each other.
jest.mock('design-system/components/Card/Card', () => {
    const React = require('react');
    return {
        Card: ({ children, ...props }: MockSpreadProps) =>
            React.createElement('div', { 'data-testid': 'card', ...props }, children),
        Button: ({ children, onPress, accessibilityLabel, disabled }: MockButtonProps) =>
            React.createElement(
                'button',
                { onClick: onPress, 'aria-label': accessibilityLabel, disabled, 'data-testid': 'button' },
                children
            ),
        Badge: ({ children, status }: MockBadgeProps) =>
            React.createElement('span', { 'data-testid': 'badge', 'data-status': status }, children),
        ProgressBar: ({ current, total, ariaLabel }: MockProgressBarProps) =>
            React.createElement('div', {
                role: 'progressbar',
                'aria-label': ariaLabel,
                'aria-valuenow': current,
                'aria-valuemax': total,
            }),
        Text: ({ children, ...props }: MockSpreadProps) => React.createElement('span', props, children),
        Box: ({ children, ...props }: MockSpreadProps) => React.createElement('div', props, children),
    };
});

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        journeys: { care: { text: '#1e3a5f', primary: '#2e7cf6' } },
        gray: { 50: '#888' },
        semantic: { warning: '#f59e0b' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
    },
}));

jest.mock('shared/constants/routes', () => ({
    WEB_CARE_ROUTES: {
        SYMPTOM_RECOMMENDATION: '/care/symptom-checker/recommendation',
    },
}));

// Mock the hooks barrel to prevent Apollo useQuery from running without a provider
jest.mock('@/hooks', () => ({
    useAppointments: () => ({ appointments: [], loading: false, error: null }),
    useAuth: () => ({ session: null, isAuthenticated: false }),
    useSymptomChecker: () => ({ results: [], isLoading: false, error: null, getRecommendations: jest.fn() }),
    useMedications: () => ({ medications: null, loading: false, error: null, refetch: jest.fn() }),
    useHealthMetrics: () => ({ metrics: [], loading: false, error: null }),
}));

import SymptomResultPage from '../../../pages/care/symptom-checker/result';

describe('Symptom Checker Result Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<SymptomResultPage />);
        expect(container).toBeTruthy();
    });

    it('renders the assessment results heading', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/assessment results/i)).toBeTruthy();
    });

    it('renders the disclaimer text', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/not a medical diagnosis/i)).toBeTruthy();
    });

    it('renders condition cards', () => {
        render(<SymptomResultPage />);
        const cards = screen.getAllByTestId('card');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('renders Upper Respiratory Infection condition', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/upper respiratory infection/i)).toBeTruthy();
    });

    it('renders Seasonal Allergies condition', () => {
        render(<SymptomResultPage />);
        expect(screen.getByText(/seasonal allergies/i)).toBeTruthy();
    });

    it('renders progress bars for probability', () => {
        render(<SymptomResultPage />);
        const progressBars = screen.getAllByRole('progressbar');
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it('renders back button', () => {
        render(<SymptomResultPage />);
        expect(screen.getByRole('button', { name: /go back/i })).toBeTruthy();
    });

    it('renders view recommendations button', () => {
        render(<SymptomResultPage />);
        expect(screen.getByRole('button', { name: /view recommendations/i })).toBeTruthy();
    });
});
