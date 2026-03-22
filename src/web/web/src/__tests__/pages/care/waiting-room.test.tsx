import { render, screen } from '@testing-library/react';
import React from 'react';

interface MockChildrenProps {
    children: React.ReactNode;
}

interface MockTitleProps {
    title: string;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
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
        Card: ({ children, ...props }: MockSpreadProps) =>
            React.createElement('div', { 'data-testid': 'card', ...props }, children),
        Button: ({ children, onPress, disabled, accessibilityLabel }: MockButtonProps) =>
            React.createElement(
                'button',
                { onClick: onPress, disabled, 'aria-label': accessibilityLabel, 'data-testid': 'care-button' },
                children
            ),
        Text: ({ children, ...props }: MockSpreadProps) => React.createElement('span', props, children),
        Box: ({ children, ...props }: MockSpreadProps) => React.createElement('div', props, children),
    };
});

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        journeys: { care: { primary: '#2e7cf6', text: '#1e3a5f' } },
        gray: { 50: '#888' },
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

import WaitingRoomPage from '../../../pages/care/appointments/waiting-room';

describe('Waiting Room Page', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders without crashing', () => {
        const { container } = render(<WaitingRoomPage />);
        expect(container).toBeTruthy();
    });

    it('renders the care layout', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByTestId('care-layout')).toBeTruthy();
    });

    it('renders the sala de espera title', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/sala de espera/i)).toBeTruthy();
    });

    it('renders doctor name', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/dra. ana silva/i)).toBeTruthy();
    });

    it('renders the queue position section', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/posicao na fila/i)).toBeTruthy();
    });

    it('renders equipment checks', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/conexao de internet/i)).toBeTruthy();
        expect(screen.getByText(/microfone/i)).toBeTruthy();
    });

    it('renders status indicators with role=status', () => {
        render(<WaitingRoomPage />);
        const statusEls = screen.getAllByRole('status');
        expect(statusEls.length).toBeGreaterThan(0);
    });

    it('renders wait tips section', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/enquanto aguarda/i)).toBeTruthy();
    });

    it('renders cancel button', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/cancelar/i)).toBeTruthy();
    });

    it('entry button is initially disabled', () => {
        render(<WaitingRoomPage />);
        const waitingButton = screen.getByRole('button', { name: /aguardando sua vez/i });
        expect(waitingButton).toBeDisabled();
    });
});
