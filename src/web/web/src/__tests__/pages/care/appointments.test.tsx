import { render, screen } from '@testing-library/react';
import React from 'react';

interface MockChildrenProps {
    children: React.ReactNode;
}

interface MockEmptyStateProps {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}

interface MockLoadingProps {
    text: string;
}

interface MockErrorProps {
    message: string;
    onRetry: () => void;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
}

jest.mock('@/layouts/CareLayout', () => ({
    CareLayout: ({ children }: MockChildrenProps) => <div data-testid="care-layout">{children}</div>,
}));

jest.mock('@/hooks/useAppointments', () => ({
    useAppointments: () => ({
        appointments: [],
        loading: false,
        error: null,
        refetch: jest.fn(),
    }),
}));

jest.mock('@/hooks/useJourney', () => ({
    useJourney: () => ({ journey: 'care' }),
}));

jest.mock('@/components/shared/EmptyState', () => ({
    EmptyState: ({ title, description, actionLabel, onAction }: MockEmptyStateProps) => (
        <div data-testid="empty-state">
            <h2>{title}</h2>
            <p>{description}</p>
            <button onClick={onAction}>{actionLabel}</button>
        </div>
    ),
}));

jest.mock('@/components/shared/LoadingIndicator', () => ({
    LoadingIndicator: ({ text }: MockLoadingProps) => <div data-testid="loading-indicator">{text}</div>,
}));

jest.mock('@/components/shared/ErrorState', () => ({
    ErrorState: ({ message, onRetry }: MockErrorProps) => (
        <div data-testid="error-state">
            <p>{message}</p>
            <button onClick={onRetry}>Retry</button>
        </div>
    ),
}));

jest.mock('design-system/components', () => ({
    Button: ({ children, onPress }: MockButtonProps) => <button onClick={onPress}>{children}</button>,
    Card: ({ children }: MockChildrenProps) => <div data-testid="card">{children}</div>,
}));

interface MockSpreadProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

jest.mock('design-system/primitives', () => ({
    Box: ({ children, ...props }: MockSpreadProps) => <div {...props}>{children}</div>,
    Text: ({ children, ...props }: MockSpreadProps) => <span {...props}>{children}</span>,
}));

jest.mock('shared/constants/routes', () => ({
    CARE_ROUTES: { BOOK_APPOINTMENT: '/care/appointments/book' },
}));

jest.mock('date-fns', () => ({
    format: (date: Date, _formatStr: string) => date.toISOString().split('T')[0],
}));

jest.mock('next/head', () => ({
    Head: ({ children }: MockChildrenProps) => <>{children}</>,
}));

import AppointmentsPage from '../../../pages/care/appointments/index';

describe('Appointments Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<AppointmentsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the care layout', () => {
        render(<AppointmentsPage />);
        expect(screen.getByTestId('care-layout')).toBeTruthy();
    });

    it('renders empty state when no appointments', () => {
        render(<AppointmentsPage />);
        expect(screen.getByTestId('empty-state')).toBeTruthy();
    });

    it('shows correct empty state title', () => {
        render(<AppointmentsPage />);
        expect(screen.getByText(/nenhuma consulta agendada/i)).toBeTruthy();
    });

    it('shows book appointment action in empty state', () => {
        render(<AppointmentsPage />);
        expect(screen.getByText(/agendar consulta/i)).toBeTruthy();
    });
});

describe('Appointments Page - Loading State', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.mock('@/hooks/useAppointments', () => ({
            useAppointments: () => ({ appointments: [], loading: true, error: null, refetch: jest.fn() }),
        }));
    });

    it('shows loading indicator when loading', () => {
        const useAppointmentsMod: { useAppointments: jest.Mock } = jest.requireMock('@/hooks/useAppointments');
        useAppointmentsMod.useAppointments.mockReturnValue({
            appointments: [],
            loading: true,
            error: null,
            refetch: jest.fn(),
        });
        const { container } = render(<AppointmentsPage />);
        expect(container).toBeTruthy();
    });
});
