import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/MainLayout', () => ({
    MainLayout: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        gray: { 10: '#f9fafb', 20: '#e5e7eb', 30: '#d1d5db', 40: '#9ca3af', 50: '#888', 60: '#4b5563', 70: '#374151' },
        brand: { primary: '#0066cc' },
        brandPalette: { 400: '#0055aa' },
        neutral: { white: '#fff' },
        semantic: { error: '#ef4444', errorBg: '#fef2f2' },
    },
}));

jest.mock('src/web/design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-xl': '1.75rem',
            'heading-sm': '1.1rem',
            'text-sm': '0.875rem',
            'text-md': '1rem',
            'text-xs': '0.75rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
        lineHeight: { base: 1.5 },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '4xs': '2px',
    },
}));

// Suppress console.log calls from handlers
global.console.log = jest.fn();

import PrivacySettingsPage from '../../../pages/profile/privacy';

describe('Privacy Settings Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<PrivacySettingsPage />);
        expect(container).toBeTruthy();
    });

    it('renders the main layout', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByTestId('main-layout')).toBeTruthy();
    });

    it('renders the privacy heading', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByText(/privacidade/i)).toBeTruthy();
    });

    it('renders the subtitle text', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByText(/preferencias de privacidade/i)).toBeTruthy();
    });

    it('renders health data sharing toggle', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByLabelText(/compartilhar dados de saude/i)).toBeTruthy();
    });

    it('renders analytics toggle', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByLabelText(/dados de uso anonimizados/i)).toBeTruthy();
    });

    it('renders location toggle', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByLabelText(/servicos de localizacao/i)).toBeTruthy();
    });

    it('renders biometric toggle', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByLabelText(/autenticacao biometrica/i)).toBeTruthy();
    });

    it('renders data export button', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByText(/exportar meus dados/i)).toBeTruthy();
    });

    it('renders save settings button', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByText(/salvar configuracoes/i)).toBeTruthy();
    });

    it('renders danger zone section', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByText(/zona de perigo/i)).toBeTruthy();
    });

    it('renders delete account button', () => {
        render(<PrivacySettingsPage />);
        expect(screen.getByText(/excluir minha conta/i)).toBeTruthy();
    });

    it('toggles a setting when clicked', () => {
        render(<PrivacySettingsPage />);
        const analyticsToggle = screen.getByLabelText(/dados de uso anonimizados/i) as HTMLInputElement;
        const initialChecked = analyticsToggle.checked;
        fireEvent.click(analyticsToggle);
        expect(analyticsToggle.checked).toBe(!initialChecked);
    });
});
