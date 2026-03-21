import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        replace: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('styled-components/native', () => ({
    __esModule: true,
    default: (component: any) => {
        if (typeof component === 'function') {
            return component;
        }
        return component;
    },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: {
            primary: '#0066FF',
            secondary: '#FF6B35',
        },
        journeys: {
            health: { primary: '#00BCD4' },
            plan: { primary: '#4CAF50' },
            care: { primary: '#FF9800' },
            community: { primary: '#9C27B0' },
        },
        gray: {
            20: '#ECECEC',
            70: '#333333',
        },
    },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { body: 'Inter', heading: 'Inter' },
        fontSize: {
            'text-md': '14px',
            'text-lg': '16px',
            'heading-xl': '28px',
        },
        fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
    },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '3xs': '2px',
    },
    spacingValues: { xl: 24 },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadius: {
        full: '9999px',
        md: '8px',
        xl: '16px',
    },
}));

jest.mock('../../../../../design-system/src/tokens/sizing', () => ({
    sizing: {
        component: { lg: '48px' },
    },
    sizingValues: { lg: 48 },
}));

jest.mock('../../constants/routes', () => ({
    ROUTES: {
        AUTH_WELCOME_CTA: 'WelcomeCTA',
    },
}));

import OnboardingScreen from '../Onboarding';

describe('OnboardingScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<OnboardingScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the onboarding carousel', () => {
        const { getByTestId } = render(<OnboardingScreen />);
        expect(getByTestId('onboarding-carousel')).toBeTruthy();
    });

    it('displays skip button for early exit', () => {
        const { getByTestId } = render(<OnboardingScreen />);
        expect(getByTestId('onboarding-skip')).toBeTruthy();
    });
});
