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
}

// Single combined mock for all design-system component/primitive paths.
// All these paths resolve to the same module via moduleNameMapper, so only
// one jest.mock registration is needed — multiple calls overwrite each other.
jest.mock('design-system/components/Card/Card', () => {
    const React = require('react');
    return {
        Card: ({ children, ...props }: MockSpreadProps) =>
            React.createElement('div', { 'data-testid': 'card', ...props }, children),
        Button: ({ children, onPress, accessibilityLabel }: MockButtonProps) =>
            React.createElement('button', { onClick: onPress, 'aria-label': accessibilityLabel }, children),
        Text: ({ children, ...props }: MockSpreadProps) => React.createElement('span', props, children),
        Box: ({ children, ...props }: MockSpreadProps) => React.createElement('div', props, children),
    };
});

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        journeys: { health: { primary: '#1a9e6a', text: '#0d4a2d' } },
        neutral: { gray300: '#d1d5db', gray600: '#4b5563', gray700: '#374151', white: '#fff' },
        semantic: { success: '#22c55e', warning: '#f59e0b', error: '#ef4444' },
        gray: { 40: '#9ca3af', 50: '#888', 60: '#4b5563' },
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

// Suppress window.alert in tests
global.alert = jest.fn();

import MedicationAdherencePage from '../../../pages/health/medications/adherence';

describe('Medication Adherence Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<MedicationAdherencePage />);
        expect(container).toBeTruthy();
    });

    it('renders the heading', () => {
        render(<MedicationAdherencePage />);
        expect(screen.getByText(/medication adherence/i)).toBeTruthy();
    });

    it('renders description text', () => {
        render(<MedicationAdherencePage />);
        expect(screen.getByText(/track how well/i)).toBeTruthy();
    });

    it('renders overall adherence card', () => {
        render(<MedicationAdherencePage />);
        expect(screen.getByText(/overall adherence/i)).toBeTruthy();
    });

    it('renders daily tab by default', () => {
        render(<MedicationAdherencePage />);
        const dailyTab = screen.getByTestId('tab-daily');
        expect(dailyTab).toBeTruthy();
    });

    it('renders all three time range tabs', () => {
        render(<MedicationAdherencePage />);
        expect(screen.getByTestId('tab-daily')).toBeTruthy();
        expect(screen.getByTestId('tab-weekly')).toBeTruthy();
        expect(screen.getByTestId('tab-monthly')).toBeTruthy();
    });

    it('renders bar chart', () => {
        render(<MedicationAdherencePage />);
        const bars = screen.getAllByTestId(/^bar-/);
        expect(bars.length).toBe(7); // 7 days in DAILY_DATA
    });

    it('switches to weekly view on tab click', () => {
        render(<MedicationAdherencePage />);
        fireEvent.click(screen.getByTestId('tab-weekly'));
        const bars = screen.getAllByTestId(/^bar-/);
        expect(bars.length).toBe(4); // 4 weeks in WEEKLY_DATA
    });

    it('switches to monthly view on tab click', () => {
        render(<MedicationAdherencePage />);
        fireEvent.click(screen.getByTestId('tab-monthly'));
        const bars = screen.getAllByTestId(/^bar-/);
        expect(bars.length).toBe(6); // 6 months in MONTHLY_DATA
    });

    it('renders share report button', () => {
        render(<MedicationAdherencePage />);
        expect(screen.getByRole('button', { name: /share adherence report/i })).toBeTruthy();
    });

    it('renders back button', () => {
        render(<MedicationAdherencePage />);
        expect(screen.getByRole('button', { name: /go back/i })).toBeTruthy();
    });
});
