import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

interface MockChildrenProps {
    children: React.ReactNode;
}

interface MockTitleProps {
    title: string;
}

interface MockCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: string;
}

interface MockSpreadProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

jest.mock('@/layouts/CareLayout', () => ({
    CareLayout: ({ children }: MockChildrenProps) => <div data-testid="care-layout">{children}</div>,
}));

// Mock the hooks barrel to prevent Apollo useQuery from running without a provider
jest.mock('@/hooks', () => ({
    useAppointments: () => ({ appointments: [], loading: false, error: null }),
    useAuth: () => ({ session: null, isAuthenticated: false }),
    useSymptomChecker: () => ({ results: [], isLoading: false, error: null, getRecommendations: jest.fn() }),
    useMedications: () => ({ medications: null, loading: false, error: null, refetch: jest.fn() }),
    useHealthMetrics: () => ({ metrics: [], loading: false, error: null }),
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: MockTitleProps) => <h1 data-testid="journey-header">{title}</h1>,
}));

// Single combined mock for all design-system component/primitive paths.
// All these paths resolve to the same module via moduleNameMapper, so only
// one jest.mock registration is needed — multiple calls overwrite each other.
jest.mock('design-system/components/Card/Card', () => {
    const React = require('react');
    return {
        Card: ({ children, onPress, accessibilityLabel }: MockCardProps) =>
            React.createElement(
                'div',
                {
                    'data-testid': 'card',
                    onClick: onPress,
                    onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' && onPress) {
                            onPress();
                        }
                    },
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': accessibilityLabel,
                },
                children
            ),
        Button: ({ children, onPress, variant }: MockButtonProps) =>
            React.createElement('button', { onClick: onPress, 'data-variant': variant }, children),
        Text: ({ children, ...props }: MockSpreadProps) => React.createElement('span', props, children),
        Box: ({ children, ...props }: MockSpreadProps) => React.createElement('div', props, children),
    };
});

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        journeys: {
            care: { primary: '#2e7cf6', background: '#e8f0fe', text: '#1e3a5f' },
        },
        neutral: { gray300: '#d1d5db', white: '#fff' },
        gray: { 40: '#9ca3af', 50: '#888', 60: '#4b5563' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px' },
}));

jest.mock('shared/constants/routes', () => ({
    WEB_CARE_ROUTES: {
        DOCTOR_FILTERS: '/care/appointments/filters',
    },
}));

import DoctorSearchPage from '../../../pages/care/appointments/search';

describe('Doctor Search Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<DoctorSearchPage />);
        expect(container).toBeTruthy();
    });

    it('renders the care layout', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByTestId('care-layout')).toBeTruthy();
    });

    it('renders the journey header with correct title', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/buscar medico/i)).toBeTruthy();
    });

    it('renders the search input', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByLabelText(/buscar medico/i)).toBeTruthy();
    });

    it('renders specialty filter buttons', () => {
        render(<DoctorSearchPage />);
        expect(screen.getAllByText(/cardiologia/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/dermatologia/i).length).toBeGreaterThan(0);
    });

    it('renders doctor results', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/dra. ana silva/i)).toBeTruthy();
        expect(screen.getByText(/dr. carlos santos/i)).toBeTruthy();
    });

    it('renders result count', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/resultado/i)).toBeTruthy();
    });

    it('filters results on search query change', () => {
        render(<DoctorSearchPage />);
        const searchInput = screen.getByLabelText(/buscar medico/i);
        fireEvent.change(searchInput, { target: { value: 'Ana' } });
        expect(screen.getByText(/dra. ana silva/i)).toBeTruthy();
    });

    it('renders filters button', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/filtros/i)).toBeTruthy();
    });
});
