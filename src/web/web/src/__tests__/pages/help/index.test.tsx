import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('design-system/tokens', () => ({
    colors: {
        gray: { 0: '#fff', 20: '#e5e7eb', 40: '#9ca3af', 50: '#888', 60: '#4b5563', 70: '#374151' },
        brand: { primary: '#0066cc' },
        brandPalette: { 50: '#e8f0ff' },
    },
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-xl': '1.75rem',
            'heading-sm': '1.1rem',
            'text-sm': '0.875rem',
            'text-md': '1rem',
            'text-lg': '1.125rem',
            'text-xs': '0.75rem',
            'text-2xs': '0.625rem',
        },
        fontWeight: { semiBold: 600, bold: 700, medium: 500 },
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xs': '4px',
    },
    borderRadius: { md: '8px' },
}));

import HelpHomePage from '../../../pages/help/index';

describe('Help Home Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<HelpHomePage />);
        expect(container).toBeTruthy();
    });

    it('renders the help center heading', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/central de ajuda/i)).toBeTruthy();
    });

    it('renders the subtitle', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/como podemos ajudar/i)).toBeTruthy();
    });

    it('renders the search input', () => {
        render(<HelpHomePage />);
        expect(screen.getByLabelText(/buscar ajuda/i)).toBeTruthy();
    });

    it('renders category cards', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/conta e acesso/i)).toBeTruthy();
        expect(screen.getByText(/plano de saude/i)).toBeTruthy();
        expect(screen.getByText(/consultas e agendamentos/i)).toBeTruthy();
    });

    it('renders gamification category', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/conquistas e recompensas/i)).toBeTruthy();
    });

    it('renders privacy category', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/privacidade e lgpd/i)).toBeTruthy();
    });

    it('renders more help section', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/precisa de mais ajuda/i)).toBeTruthy();
    });

    it('renders support contact buttons', () => {
        render(<HelpHomePage />);
        expect(screen.getByText(/falar com suporte/i)).toBeTruthy();
        expect(screen.getByText(/chat ao vivo/i)).toBeTruthy();
        expect(screen.getByText(/reportar problema/i)).toBeTruthy();
    });

    it('filters categories by search query', () => {
        render(<HelpHomePage />);
        const searchInput = screen.getByLabelText(/buscar ajuda/i);
        fireEvent.change(searchInput, { target: { value: 'conta' } });
        expect(screen.getByText(/conta e acesso/i)).toBeTruthy();
    });
});
