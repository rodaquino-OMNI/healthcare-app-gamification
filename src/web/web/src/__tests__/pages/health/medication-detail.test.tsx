import { render, screen, fireEvent } from '@testing-library/react';
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
    variant?: string;
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
        Badge: ({ children, status, variant }: MockBadgeProps) =>
            React.createElement(
                'span',
                { 'data-testid': 'badge', 'data-status': status, 'data-variant': variant },
                children
            ),
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
        journeys: { health: { primary: '#1a9e6a', text: '#0d4a2d' } },
        gray: { 40: '#aaa', 50: '#888' },
        neutral: { gray300: '#d1d5db' },
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
    WEB_HEALTH_ROUTES: { MEDICATIONS: '/health/medications' },
}));

// Mock the hooks barrel to prevent Apollo useQuery from running without a provider
jest.mock('@/hooks', () => ({
    useAppointments: () => ({ appointments: [], loading: false, error: null }),
    useAuth: () => ({ session: null, isAuthenticated: false }),
    useSymptomChecker: () => ({ results: [], isLoading: false, error: null, getRecommendations: jest.fn() }),
    useMedications: () => ({
        medications: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
        getMedicationById: jest.fn(),
        searchMedications: jest.fn(() => []),
    }),
    useHealthMetrics: () => ({ metrics: [], loading: false, error: null }),
}));

import MedicationDetailPage from '../../../pages/health/medications/[id]';

describe('Medication Detail Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<MedicationDetailPage />);
        expect(container).toBeTruthy();
    });

    it('renders the medication name', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/losartan/i)).toBeTruthy();
    });

    it('renders dosage information', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/50mg/i)).toBeTruthy();
    });

    it('renders the active badge', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/active/i)).toBeTruthy();
    });

    it('renders adherence section', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/adherence/i)).toBeTruthy();
    });

    it('renders progress bar for adherence', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByRole('progressbar')).toBeTruthy();
    });

    it('renders medication details section', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/details/i)).toBeTruthy();
    });

    it('renders the prescribing doctor info', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/dr. maria silva/i)).toBeTruthy();
    });

    it('renders dose history section', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByText(/recent dose history/i)).toBeTruthy();
    });

    it('renders back button', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByRole('button', { name: /back to medications/i })).toBeTruthy();
    });

    it('renders delete button', () => {
        render(<MedicationDetailPage />);
        expect(screen.getByRole('button', { name: /delete this medication/i })).toBeTruthy();
    });

    it('shows confirm delete buttons after clicking delete', () => {
        render(<MedicationDetailPage />);
        fireEvent.click(screen.getByRole('button', { name: /delete this medication/i }));
        expect(screen.getByRole('button', { name: /confirm delete/i })).toBeTruthy();
        expect(screen.getByRole('button', { name: /cancel deletion/i })).toBeTruthy();
    });
});
