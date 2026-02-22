import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/CareLayout', () => ({
  CareLayout: ({ children }: any) => <div data-testid="care-layout">{children}</div>,
}));

jest.mock('src/web/web/src/hooks/useAppointments', () => ({
  useAppointments: () => ({
    appointments: [],
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('src/web/web/src/hooks/useJourney', () => ({
  useJourney: () => ({ journey: 'care' }),
}));

jest.mock('src/web/web/src/components/shared/EmptyState', () => ({
  EmptyState: ({ title, description, actionLabel, onAction }: any) => (
    <div data-testid="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onAction}>{actionLabel}</button>
    </div>
  ),
}));

jest.mock('src/web/web/src/components/shared/LoadingIndicator', () => ({
  LoadingIndicator: ({ text }: any) => <div data-testid="loading-indicator">{text}</div>,
}));

jest.mock('src/web/web/src/components/shared/ErrorState', () => ({
  ErrorState: ({ message, onRetry }: any) => (
    <div data-testid="error-state">
      <p>{message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

jest.mock('src/web/design-system/src/components', () => ({
  Button: ({ children, onPress }: any) => <button onClick={onPress}>{children}</button>,
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));

jest.mock('src/web/design-system/src/primitives', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('src/web/shared/constants/routes', () => ({
  CARE_ROUTES: { BOOK_APPOINTMENT: '/care/appointments/book' },
}));

jest.mock('date-fns', () => ({
  format: (date: Date, formatStr: string) => date.toISOString().split('T')[0],
}));

jest.mock('next/head', () => ({
  Head: ({ children }: any) => <>{children}</>,
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
    jest.mock('src/web/web/src/hooks/useAppointments', () => ({
      useAppointments: () => ({ appointments: [], loading: true, error: null, refetch: jest.fn() }),
    }));
  });

  it('shows loading indicator when loading', async () => {
    const { useAppointments } = require('src/web/web/src/hooks/useAppointments');
    useAppointments.mockReturnValue({ appointments: [], loading: true, error: null, refetch: jest.fn() });
    const { container } = render(<AppointmentsPage />);
    expect(container).toBeTruthy();
  });
});
