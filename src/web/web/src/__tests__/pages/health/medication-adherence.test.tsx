import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
  Button: ({ children, onPress, accessibilityLabel }: any) => (
    <button onClick={onPress} aria-label={accessibilityLabel}>{children}</button>
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
    neutral: { gray300: '#d1d5db', gray600: '#4b5563', gray700: '#374151' },
    semantic: { success: '#22c55e', warning: '#f59e0b', error: '#ef4444' },
  },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
  spacing: {
    xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px',
  },
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
