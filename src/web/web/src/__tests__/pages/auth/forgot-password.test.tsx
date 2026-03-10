import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/layouts/AuthLayout', () => ({
    AuthLayout: function AuthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="auth-layout">{children}</div>;
    },
}));

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        gray: { 20: '#ccc', 40: '#aaa', 50: '#888', 60: '#666', 70: '#333' },
        brand: { primary: '#0066cc' },
        brandPalette: { 400: '#0055aa' },
        neutral: { white: '#ffffff' },
        semantic: { error: '#dc2626' },
    },
}));

jest.mock('design-system/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-lg': '1.5rem',
            'heading-md': '1.25rem',
            'text-sm': '0.875rem',
            'text-md': '1rem',
            'text-xs': '0.75rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
        lineHeight: { base: 1.5, relaxed: 1.75 },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '3xs': '4px',
    },
}));

jest.mock('shared/constants/routes', () => ({
    WEB_AUTH_ROUTES: { LOGIN: '/auth/login' },
}));

import ForgotPasswordPage from '../../../pages/auth/forgot-password';

describe('ForgotPassword Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<ForgotPasswordPage />);
        expect(container).toBeTruthy();
    });

    it('renders the auth layout', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByTestId('auth-layout')).toBeTruthy();
    });

    it('renders the page heading', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/esqueceu a senha/i)).toBeTruthy();
    });

    it('renders subtitle text', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/insira seu e-mail/i)).toBeTruthy();
    });

    it('renders email input', () => {
        render(<ForgotPasswordPage />);
        const emailInput = screen.getByLabelText(/e-mail/i);
        expect(emailInput).toBeTruthy();
    });

    it('renders submit button', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/enviar link/i)).toBeTruthy();
    });

    it('renders back to login link', () => {
        render(<ForgotPasswordPage />);
        expect(screen.getByText(/voltar ao login/i)).toBeTruthy();
    });

    it('submit button is disabled when email is empty', () => {
        render(<ForgotPasswordPage />);
        const submitButton = screen.getByText(/enviar link/i).closest('button');
        expect(submitButton).toBeDisabled();
    });

    it('updates email input on change', () => {
        render(<ForgotPasswordPage />);
        const emailInput: HTMLInputElement = screen.getByLabelText(/e-mail/i);
        fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
        expect(emailInput.value).toBe('test@email.com');
    });

    it('shows error for invalid email on submit', async () => {
        render(<ForgotPasswordPage />);
        const emailInput = screen.getByLabelText(/e-mail/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        const form = emailInput.closest('form');
        if (form) {
            fireEvent.submit(form);
        }
        await waitFor(() => {
            expect(screen.getByText(/e-mail valido/i)).toBeTruthy();
        });
    });
});
