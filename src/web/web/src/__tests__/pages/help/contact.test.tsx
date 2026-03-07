import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('design-system/tokens', () => ({
    colors: {
        gray: { 0: '#fff', 30: '#d1d5db', 40: '#9ca3af', 50: '#888', 60: '#4b5563', 70: '#374151' },
        brand: { primary: '#0066cc' },
        brandPalette: { 50: '#e8f0ff' },
        semantic: { error: '#ef4444', errorBg: '#fef2f2' },
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
        },
        fontWeight: { semiBold: 600, bold: 700 },
    },
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '3xs': '4px',
    },
    borderRadius: { md: '8px' },
}));

// Suppress window.open in tests
global.open = jest.fn();

import ContactPage from '../../../pages/help/contact';

describe('Contact Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<ContactPage />);
        expect(container).toBeTruthy();
    });

    it('renders the fale conosco heading', () => {
        render(<ContactPage />);
        expect(screen.getByText(/fale conosco/i)).toBeTruthy();
    });

    it('renders the subtitle', () => {
        render(<ContactPage />);
        expect(screen.getByText(/canal de sua preferencia/i)).toBeTruthy();
    });

    it('renders chat channel card', () => {
        render(<ContactPage />);
        expect(screen.getByText(/chat ao vivo/i)).toBeTruthy();
    });

    it('renders phone channel card', () => {
        render(<ContactPage />);
        expect(screen.getByText('Telefone')).toBeTruthy();
    });

    it('renders email channel card', () => {
        render(<ContactPage />);
        expect(screen.getByText('Email')).toBeTruthy();
    });

    it('renders whatsapp channel card', () => {
        render(<ContactPage />);
        expect(screen.getByText('WhatsApp')).toBeTruthy();
    });

    it('renders availability info for each channel', () => {
        render(<ContactPage />);
        expect(screen.getByText(/seg-sex, 8h-20h/i)).toBeTruthy();
        expect(screen.getByText(/24 horas/i)).toBeTruthy();
    });

    it('renders emergency card', () => {
        render(<ContactPage />);
        expect(screen.getByText(/emergencia/i)).toBeTruthy();
        expect(screen.getByText(/192/i)).toBeTruthy();
    });

    it('renders back to help center button', () => {
        render(<ContactPage />);
        expect(screen.getByText(/voltar para central/i)).toBeTruthy();
    });

    it('clicking chat channel routes internally', () => {
        const { useRouter } = require('next/router');
        const pushSpy = useRouter().push;
        render(<ContactPage />);
        const chatCard = screen.getByText(/chat ao vivo/i).closest('div');
        if (chatCard) fireEvent.click(chatCard);
        expect(pushSpy).toHaveBeenCalledWith('/help/chat');
    });
});
