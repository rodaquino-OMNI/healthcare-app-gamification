import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

jest.mock('@/layouts/MainLayout', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        gray: { 10: '#f9fafb', 20: '#e5e7eb', 40: '#9ca3af', 60: '#4b5563', 70: '#374151' },
        brand: { primary: '#0066cc' },
        brandPalette: { 400: '#0055aa' },
        neutral: { white: '#fff' },
    },
}));

jest.mock('design-system/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-xl': '1.75rem',
            'text-sm': '0.875rem',
            'text-md': '1rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
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

import ProfileEditPage from '../../../pages/profile/edit';

describe('Profile Edit Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<ProfileEditPage />);
        expect(container).toBeTruthy();
    });

    it('renders the main layout', () => {
        render(<ProfileEditPage />);
        expect(screen.getByTestId('main-layout')).toBeTruthy();
    });

    it('renders the edit profile heading', () => {
        render(<ProfileEditPage />);
        expect(screen.getByText(/editar perfil/i)).toBeTruthy();
    });

    it('renders the subtitle text', () => {
        render(<ProfileEditPage />);
        expect(screen.getByText(/informacoes pessoais/i)).toBeTruthy();
    });

    it('renders name input', () => {
        render(<ProfileEditPage />);
        expect(screen.getByLabelText(/nome completo/i)).toBeTruthy();
    });

    it('renders email input', () => {
        render(<ProfileEditPage />);
        expect(screen.getByLabelText(/e-mail/i)).toBeTruthy();
    });

    it('renders phone input', () => {
        render(<ProfileEditPage />);
        expect(screen.getByLabelText(/telefone/i)).toBeTruthy();
    });

    it('renders CPF input (disabled)', () => {
        render(<ProfileEditPage />);
        const cpfInput: HTMLInputElement = screen.getByLabelText(/cpf/i);
        expect(cpfInput.disabled).toBe(true);
    });

    it('renders date of birth input', () => {
        render(<ProfileEditPage />);
        expect(screen.getByLabelText(/data de nascimento/i)).toBeTruthy();
    });

    it('renders save button', () => {
        render(<ProfileEditPage />);
        expect(screen.getByText(/salvar/i)).toBeTruthy();
    });

    it('renders cancel button', () => {
        render(<ProfileEditPage />);
        expect(screen.getByText(/cancelar/i)).toBeTruthy();
    });

    it('allows changing the name input', () => {
        render(<ProfileEditPage />);
        const nameInput: HTMLInputElement = screen.getByLabelText(/nome completo/i);
        fireEvent.change(nameInput, { target: { value: 'Novo Nome' } });
        expect(nameInput.value).toBe('Novo Nome');
    });
});
