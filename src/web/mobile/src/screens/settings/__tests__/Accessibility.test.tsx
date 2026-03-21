import { render } from '@testing-library/react-native';
import React from 'react';

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

// styled-components mock
jest.mock('styled-components/native', () => ({
    useTheme: () => ({
        colors: {
            background: { default: '#fff', subtle: '#f5f5f5', muted: '#eee' },
            text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
            border: { default: '#ddd', muted: '#e0e0e0' },
        },
    }),
}));

// DS token mocks — exact paths used by Accessibility.tsx
jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        semantic: {
            error: '#f00',
            success: '#0f0',
            warning: '#fa0',
            successBg: '#e8ffe8',
        },
        neutral: { white: '#fff', black: '#000', gray900: '#111' },
        gray: { 10: '#f9f9f9', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#aaa' },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8' },
            care: { primary: '#f90', background: '#fff3e0' },
            plan: { primary: '#90f', background: '#f3e0ff' },
        },
    },
}));
jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { body: 'System', heading: 'System', mono: 'System' },
        fontSize: { 'text-xs': '12px', 'text-sm': '14px', 'text-md': '16px', 'heading-lg': '26px' },
        fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
        letterSpacing: { wide: '0.5px' },
    },
}));
jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacing: { '3xs': '2px', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '40px', '4xl': '64px' },
    spacingValues: { '3xs': 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '4xl': 64 },
}));
jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));
jest.mock('../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '44px', lg: '56px' }, icon: { md: '24px' } },
}));
jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

// Routes mock
jest.mock('../../../constants/routes', () => ({
    ROUTES: { SETTINGS_ACCESSIBILITY: 'Accessibility' },
}));

// SCREEN IMPORT — always after all mocks
import { AccessibilityScreen } from '../Accessibility';

describe('AccessibilityScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<AccessibilityScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('renders the small font size button', () => {
        const { getByTestId } = render(<AccessibilityScreen />);
        expect(getByTestId('font-size-s')).toBeTruthy();
    });

    it('renders the medium font size button', () => {
        const { getByTestId } = render(<AccessibilityScreen />);
        expect(getByTestId('font-size-m')).toBeTruthy();
    });

    it('renders the high contrast toggle', () => {
        const { getByTestId } = render(<AccessibilityScreen />);
        expect(getByTestId('accessibility-high-contrast')).toBeTruthy();
    });

    it('renders the reduced motion toggle', () => {
        const { getByTestId } = render(<AccessibilityScreen />);
        expect(getByTestId('accessibility-reduced-motion')).toBeTruthy();
    });

    it('renders the font size preview', () => {
        const { getByTestId } = render(<AccessibilityScreen />);
        expect(getByTestId('font-size-preview')).toBeTruthy();
    });
});
