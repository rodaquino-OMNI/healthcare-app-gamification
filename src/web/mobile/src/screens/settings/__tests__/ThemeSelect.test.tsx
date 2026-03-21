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
            brand: { primary: '#00f' },
        },
    }),
}));

// DS token mocks — exact paths used by ThemeSelect.tsx
jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
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
        fontSize: {
            'text-xs': '12px',
            'text-sm': '14px',
            'text-md': '16px',
            'heading-sm': '20px',
            'heading-lg': '26px',
        },
        fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
        letterSpacing: { wide: '0.5px' },
    },
}));
jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacing: { '2xs': '4px', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '40px', '4xl': '64px' },
    spacingValues: { '2xs': 4, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '4xl': 64 },
}));
jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));
jest.mock('../../../../../design-system/src/tokens/sizing', () => ({
    sizing: { component: { sm: '32px', md: '44px', lg: '56px' }, icon: { md: '24px' } },
}));
jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

// ThemeSelect imports themes from the themes index
jest.mock('../../../../../design-system/src/themes', () => ({
    baseTheme: {
        colors: {
            background: { default: '#fff', muted: '#f5f5f5' },
            text: { default: '#000', subtle: '#888' },
            border: { default: '#ddd' },
        },
    },
    darkTheme: {
        colors: {
            background: { default: '#111', muted: '#222' },
            text: { default: '#fff', subtle: '#aaa' },
            border: { default: '#444' },
        },
    },
}));

// ThemeSelect uses useAppTheme from the ThemeContext
jest.mock('../../../context/ThemeContext', () => ({
    useAppTheme: () => ({
        themeMode: 'light',
        setThemeMode: jest.fn(),
        isDark: false,
    }),
}));

// SCREEN IMPORT — always after all mocks
import { ThemeSelectScreen } from '../ThemeSelect';

describe('ThemeSelectScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<ThemeSelectScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('renders the light theme option', () => {
        const { getByTestId } = render(<ThemeSelectScreen />);
        expect(getByTestId('theme-option-light')).toBeTruthy();
    });

    it('renders the dark theme option', () => {
        const { getByTestId } = render(<ThemeSelectScreen />);
        expect(getByTestId('theme-option-dark')).toBeTruthy();
    });

    it('renders the system theme option', () => {
        const { getByTestId } = render(<ThemeSelectScreen />);
        expect(getByTestId('theme-option-system')).toBeTruthy();
    });
});
