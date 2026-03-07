import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/web/src/components/index', () => ({
    MainLayout: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
    useHealthMetrics: () => ({ metrics: [] }),
    useAuth: () => ({ isAuthenticated: true }),
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        journeys: {
            health: { primary: '#1a9e6a' },
            care: { primary: '#2e7cf6' },
            plan: { primary: '#7c4dff' },
        },
        neutral: { white: '#fff', gray900: '#111827', gray600: '#4b5563', gray700: '#374151' },
        brand: { primary: '#0066cc' },
        semantic: {
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',
        },
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
        '3xs': '4px',
        '4xs': '2px',
    },
}));

jest.mock('src/web/design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-xl': '1.75rem',
            'heading-md': '1.25rem',
            'text-md': '1rem',
            'text-sm': '0.875rem',
            'text-xs': '0.75rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
    },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
    borderRadius: { md: '8px', full: '9999px', xs: '4px' },
}));

jest.mock('src/web/design-system/src/tokens/shadows', () => ({
    shadows: { sm: '0 1px 3px rgba(0,0,0,0.1)' },
}));

import MetricsPage from '../../../pages/home/metrics';

describe('Metrics Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<MetricsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the main layout', () => {
        render(<MetricsPage />);
        expect(screen.getByTestId('main-layout')).toBeTruthy();
    });

    it('renders the page title', () => {
        render(<MetricsPage />);
        expect(screen.getByText(/minhas metricas/i)).toBeTruthy();
    });

    it('renders page subtitle', () => {
        render(<MetricsPage />);
        expect(screen.getByText(/indicadores de saude/i)).toBeTruthy();
    });

    it('renders the add metric button', () => {
        render(<MetricsPage />);
        expect(screen.getByText(/adicionar metrica/i)).toBeTruthy();
    });

    it('renders filter tabs', () => {
        render(<MetricsPage />);
        expect(screen.getByText('Todas')).toBeTruthy();
        expect(screen.getByText('Sinais Vitais')).toBeTruthy();
        expect(screen.getByText('Atividade')).toBeTruthy();
    });

    it('renders metric cards', () => {
        render(<MetricsPage />);
        expect(screen.getByText(/frequencia cardiaca/i)).toBeTruthy();
    });

    it('renders the weekly trend section', () => {
        render(<MetricsPage />);
        expect(screen.getByText(/tendencia semanal/i)).toBeTruthy();
    });

    it('can filter metrics by category', () => {
        render(<MetricsPage />);
        const vitalButton = screen.getByText('Sinais Vitais');
        fireEvent.click(vitalButton);
        expect(screen.getByText(/frequencia cardiaca/i)).toBeTruthy();
    });

    it('shows activity filter results correctly', () => {
        render(<MetricsPage />);
        fireEvent.click(screen.getByText('Atividade'));
        expect(screen.getByText(/passos/i)).toBeTruthy();
    });
});
