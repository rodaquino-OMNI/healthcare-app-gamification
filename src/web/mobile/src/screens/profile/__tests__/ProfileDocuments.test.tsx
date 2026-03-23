import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('../../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        semantic: { error: '#f00', success: '#0f0', successBg: '#e6ffe6' },
        neutral: { white: '#fff', black: '#000', gray700: '#555', gray900: '#111' },
        gray: { 10: '#f9f9f9', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#aaa', 60: '#888' },
        brandPalette: { 50: '#eef' },
        journeys: { plan: { primary: '#90f', background: '#f3e0ff' } },
    },
}));
jest.mock('../../../../../../design-system/src/tokens/spacing', () => ({
    spacing: {
        '3xs': '2px',
        '2xs': '4px',
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '64px',
    },
    spacingValues: { '3xs': 2, '4xs': 1, xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
}));
jest.mock('../../../../../../design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { body: 'System', heading: 'System', mono: 'System' },
        fontSize: {
            xs: '12px',
            sm: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            'text-xs': '12px',
            'text-sm': '14px',
            'text-md': '16px',
            'heading-xl': '30px',
        },
        fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
    },
}));
jest.mock('../../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
    borderRadiusValues: { sm: 4, md: 8, lg: 12, full: 9999 },
}));
jest.mock('../../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '44px', lg: '56px' } },
    sizingValues: { component: { sm: 32, md: 44, lg: 56 } },
}));
jest.mock('../../../../../../design-system/src/themes/base.theme', () => ({}));

jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({
        session: { accessToken: 'mock-token' },
    }),
}));

jest.mock('../../../api/auth', () => ({
    updateProfile: jest.fn().mockResolvedValue({}),
}));

jest.mock('expo-document-picker', () => ({
    getDocumentAsync: jest.fn().mockResolvedValue({ canceled: true }),
}));

const mockTheme = {
    colors: {
        background: { default: '#fff', muted: '#f5f5f5', subtle: '#fafafa' },
        text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
        border: { default: '#ddd' },
    },
};

import ProfileDocuments from '../ProfileDocuments';

describe('ProfileDocuments', () => {
    const renderComponent = () =>
        render(
            <ThemeProvider theme={mockTheme as any}>
                <ProfileDocuments />
            </ThemeProvider>
        );

    it('renders without crashing', () => {
        const { toJSON } = renderComponent();
        expect(toJSON()).not.toBeNull();
    });

    it('displays the CPF input field', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('profile-docs-cpf')).toBeTruthy();
    });

    it('displays the RG input field', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('profile-docs-rg')).toBeTruthy();
    });

    it('displays the upload area', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('profile-docs-upload')).toBeTruthy();
    });

    it('displays the continue button', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('profile-docs-continue')).toBeTruthy();
    });
});
