import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        neutral: {
            white: '#ffffff',
            gray50: '#f9fafb',
            gray300: '#d1d5db',
            gray400: '#9ca3af',
            gray500: '#6b7280',
            gray600: '#4b5563',
            gray900: '#111827',
            black: '#000000',
        },
        brand: { primary: '#0066cc' },
    },
}));

jest.mock('src/web/design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-lg': '1.5rem',
            'text-md': '1rem',
            'text-sm': '0.875rem',
            'text-xs': '0.75rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
        lineHeight: { relaxed: 1.75 },
        letterSpacing: { wide: '0.05em' },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
    borderRadius: { md: '8px' },
}));

import SocialAuthPage from '../../../pages/auth/social-auth';

describe('SocialAuth Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<SocialAuthPage />);
        expect(container).toBeTruthy();
    });

    it('renders welcome title', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/bem-vindo/i)).toBeTruthy();
    });

    it('renders the description text', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/faça login ou crie uma conta/i)).toBeTruthy();
    });

    it('renders Google sign-in button', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/continuar com google/i)).toBeTruthy();
    });

    it('renders Apple sign-in button', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/continuar com apple/i)).toBeTruthy();
    });

    it('renders Facebook sign-in button', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/continuar com facebook/i)).toBeTruthy();
    });

    it('renders email login button', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/continuar com email/i)).toBeTruthy();
    });

    it('renders LGPD legal text', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/lgpd/i)).toBeTruthy();
    });

    it('renders privacy policy link', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/política de privacidade/i)).toBeTruthy();
    });

    it('renders terms of service link', () => {
        render(<SocialAuthPage />);
        expect(screen.getByText(/termos de serviço/i)).toBeTruthy();
    });
});
