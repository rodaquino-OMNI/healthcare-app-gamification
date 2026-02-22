import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
  Button: ({ children, onPress, accessibilityLabel, disabled }: any) => (
    <button onClick={onPress} aria-label={accessibilityLabel} disabled={disabled} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('src/web/design-system/src/components/Badge/Badge', () => ({
  Badge: ({ children, status, variant }: any) => (
    <span data-testid="badge" data-status={status} data-variant={variant}>{children}</span>
  ),
}));

jest.mock('src/web/design-system/src/components/ProgressBar/ProgressBar', () => ({
  ProgressBar: ({ current, total, ariaLabel }: any) => (
    <div role="progressbar" aria-label={ariaLabel} aria-valuenow={current} aria-valuemax={total} />
  ),
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('src/web/design-system/src/primitives/Box/Box', () => ({
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    journeys: { health: { primary: '#1a9e6a', text: '#0d4a2d' } },
    gray: { 40: '#aaa', 50: '#888' },
    neutral: { gray300: '#d1d5db' },
  },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
  spacing: {
    xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px',
  },
}));

jest.mock('src/web/shared/constants/routes', () => ({
  WEB_HEALTH_ROUTES: { MEDICATIONS: '/health/medications' },
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
