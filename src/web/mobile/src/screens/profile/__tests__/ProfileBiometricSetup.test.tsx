import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';

// Navigation mock
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
}));

// i18n mock
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

// DS token mocks
jest.mock('../../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0', successBg: '#e6ffe6' },
        neutral: { white: '#fff', black: '#000', gray700: '#555', gray900: '#111' },
        gray: { 10: '#f9f9f9', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#aaa', 60: '#888', 70: '#666' },
        brandPalette: { 50: '#eef' },
        journeys: {
            plan: { primary: '#90f', background: '#f3e0ff', text: '#333' },
        },
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
    spacingValues: { '3xs': 2, '4xs': 1, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '3xl': 48, '4xl': 64 },
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
            'text-lg': '18px',
            'heading-sm': '20px',
            'heading-md': '22px',
            'heading-lg': '26px',
            'heading-xl': '30px',
            'heading-2xl': '34px',
            'display-md': '36px',
        },
        fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
        letterSpacing: { wide: '0.5px' },
    },
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
}));
jest.mock('../../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
    borderRadiusValues: { xs: 4, sm: 4, md: 8, lg: 12, full: 9999 },
}));
jest.mock('../../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '44px', lg: '56px' }, icon: { md: '24px' } },
    sizingValues: { component: { sm: 32, md: 44, lg: 56 } },
}));
jest.mock('../../../../../../design-system/src/themes/base.theme', () => ({}));

// Auth context mock
jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({
        session: { accessToken: 'mock-token' },
    }),
}));

// Routes mock
jest.mock('../../../constants/routes', () => ({
    ROUTES: {
        PROFILE_CONFIRMATION: 'ProfileConfirmation',
    },
}));

// API mocks
jest.mock('../../../api/auth', () => ({
    registerBiometricKey: jest.fn().mockResolvedValue({}),
    getBiometricChallenge: jest.fn().mockResolvedValue({ challenge: 'test-challenge' }),
    verifyBiometricSignature: jest.fn().mockResolvedValue({ accessToken: 'new-token' }),
}));

// Native module mocks
jest.mock('react-native-biometrics', () => {
    return jest.fn().mockImplementation(() => ({
        createKeys: jest.fn().mockResolvedValue({ publicKey: 'mock-public-key' }),
        createSignature: jest.fn().mockResolvedValue({ success: true, signature: 'mock-sig' }),
    }));
});
jest.mock('expo-local-authentication', () => ({
    hasHardwareAsync: jest.fn().mockResolvedValue(true),
    isEnrolledAsync: jest.fn().mockResolvedValue(true),
    authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../../../utils/secure-storage', () => ({
    secureTokenStorage: {
        setSession: jest.fn(),
        getSession: jest.fn(),
    },
}));

const mockTheme = {
    colors: {
        background: { default: '#fff', muted: '#f5f5f5', subtle: '#fafafa' },
        text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
        border: { default: '#ddd' },
    },
};

import { ProfileBiometricSetup } from '../ProfileBiometricSetup';

describe('ProfileBiometricSetup', () => {
    const renderComponent = () =>
        render(
            <ThemeProvider theme={mockTheme}>
                <ProfileBiometricSetup />
            </ThemeProvider>
        );

    it('renders without crashing', () => {
        const { toJSON } = renderComponent();
        expect(toJSON()).not.toBeNull();
    });

    it('displays the biometric setup title', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('biometric-setup-title')).toBeTruthy();
    });

    it('shows enable and skip buttons', () => {
        const { getByTestId } = renderComponent();
        expect(getByTestId('biometric-setup-enable')).toBeTruthy();
        expect(getByTestId('biometric-setup-skip')).toBeTruthy();
    });
});
