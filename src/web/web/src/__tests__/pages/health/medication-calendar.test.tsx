import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
    Card: ({ children, ...props }: any) => (
        <div data-testid="card" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
    Button: ({ children, onPress, accessibilityLabel }: any) => (
        <button onClick={onPress} aria-label={accessibilityLabel}>
            {children}
        </button>
    ),
}));

jest.mock('src/web/design-system/src/components/Badge/Badge', () => ({
    Badge: ({ children, status }: any) => (
        <span data-testid="badge" data-status={status}>
            {children}
        </span>
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
        neutral: { white: '#fff', gray900: '#111', gray300: '#d1d5db' },
        gray: { 50: '#888' },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
    },
}));

jest.mock('src/web/shared/constants/routes', () => ({
    WEB_HEALTH_ROUTES: { MEDICATIONS: '/health/medications' },
}));

import MedicationCalendarPage from '../../../pages/health/medications/calendar';

describe('Medication Calendar Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<MedicationCalendarPage />);
        expect(container).toBeTruthy();
    });

    it('renders the calendar heading', () => {
        render(<MedicationCalendarPage />);
        expect(screen.getByText(/medication calendar/i)).toBeTruthy();
    });

    it('renders the weekly schedule subtitle', () => {
        render(<MedicationCalendarPage />);
        expect(screen.getByText(/weekly dose schedule/i)).toBeTruthy();
    });

    it('renders day buttons for the week', () => {
        render(<MedicationCalendarPage />);
        const dayButtons = screen
            .getAllByRole('button')
            .filter((btn) => btn.getAttribute('aria-label')?.match(/sun|mon|tue|wed|thu|fri|sat/i));
        expect(dayButtons.length).toBe(7);
    });

    it('renders dose cards', () => {
        render(<MedicationCalendarPage />);
        const cards = screen.getAllByTestId('card');
        expect(cards.length).toBeGreaterThan(0);
    });

    it('renders medication names in dose list', () => {
        render(<MedicationCalendarPage />);
        expect(screen.getAllByText(/metformin/i).length).toBeGreaterThan(0);
    });

    it('renders dose status badges', () => {
        render(<MedicationCalendarPage />);
        const badges = screen.getAllByTestId('badge');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders view monthly button', () => {
        render(<MedicationCalendarPage />);
        expect(screen.getByRole('button', { name: /view monthly/i })).toBeTruthy();
    });

    it('changes selected date when day button is clicked', () => {
        render(<MedicationCalendarPage />);
        const dayButtons = screen
            .getAllByRole('button')
            .filter((btn) => btn.getAttribute('aria-label')?.match(/sun|mon|tue|wed|thu|fri|sat/i));
        if (dayButtons.length > 1) {
            fireEvent.click(dayButtons[1]);
            expect(screen.getAllByTestId('card').length).toBeGreaterThan(0);
        }
    });
});
