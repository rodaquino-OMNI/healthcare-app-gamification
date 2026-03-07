import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/components/index', () => ({
    MainLayout: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
    useAuth: () => ({ isAuthenticated: true }),
}));

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        neutral: { white: '#fff', gray900: '#111827', gray600: '#4b5563', gray700: '#374151', gray300: '#d1d5db' },
        semantic: {
            error: '#ef4444',
            errorBg: '#fef2f2',
            warning: '#f59e0b',
            warningBg: '#fffbeb',
            info: '#3b82f6',
        },
        brand: { primary: '#0066cc' },
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
        '3xs': '4px',
        '4xs': '2px',
        '5xl': '80px',
    },
}));

jest.mock('design-system/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-xl': '1.75rem',
            'heading-md': '1.25rem',
            'heading-sm': '1.1rem',
            'text-md': '1rem',
            'text-sm': '0.875rem',
            'text-xs': '0.75rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
        letterSpacing: { wide: '0.05em' },
        lineHeight: { base: 1.5 },
    },
}));

jest.mock('design-system/tokens/borderRadius', () => ({
    borderRadius: { md: '8px', sm: '4px', full: '9999px' },
}));

jest.mock('design-system/tokens/shadows', () => ({
    shadows: { sm: '0 1px 3px rgba(0,0,0,0.1)' },
}));

import AlertPage from '../../../pages/home/alert';

describe('Alert Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<AlertPage />);
        expect(container).toBeTruthy();
    });

    it('renders the main layout', () => {
        render(<AlertPage />);
        expect(screen.getByTestId('main-layout')).toBeTruthy();
    });

    it('renders the page title', () => {
        render(<AlertPage />);
        expect(screen.getByText(/alertas de saude/i)).toBeTruthy();
    });

    it('renders active alerts', () => {
        render(<AlertPage />);
        expect(screen.getByText(/frequencia cardiaca elevada/i)).toBeTruthy();
    });

    it('renders dismiss all button when there are active alerts', () => {
        render(<AlertPage />);
        expect(screen.getByText(/dispensar todos/i)).toBeTruthy();
    });

    it('renders severity labels', () => {
        render(<AlertPage />);
        expect(screen.getByText(/critico/i)).toBeTruthy();
    });

    it('dismisses an alert when dismiss button is clicked', () => {
        render(<AlertPage />);
        const dismissButtons = screen.getAllByText(/dispensar$/i);
        fireEvent.click(dismissButtons[0]);
        // Alert count decreases (at least one alert dismissed)
        const remainingDismissButtons = screen.queryAllByText(/dispensar$/i);
        expect(remainingDismissButtons.length).toBeLessThan(dismissButtons.length);
    });

    it('dismisses all alerts when dismiss all is clicked', () => {
        render(<AlertPage />);
        const dismissAllButton = screen.getByText(/dispensar todos/i);
        fireEvent.click(dismissAllButton);
        expect(screen.getByText(/nenhum alerta/i)).toBeTruthy();
    });

    it('renders empty state after dismissing all alerts', () => {
        render(<AlertPage />);
        fireEvent.click(screen.getByText(/dispensar todos/i));
        expect(screen.getByText(/continue cuidando da sua saude/i)).toBeTruthy();
    });
});
