import { render } from '@testing-library/react-native';
import React from 'react';

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

jest.mock('styled-components/native', () => ({
    useTheme: () => ({
        colors: {
            background: { default: '#fff', subtle: '#f5f5f5', muted: '#eee' },
            text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
            border: { default: '#ddd' },
        },
    }),
}));

jest.mock('@web/design-system/src/tokens/colors', () => ({
    colors: {
        neutral: { white: '#fff', black: '#000' },
        gray: { 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#888', 60: '#666' },
        semantic: { errorBg: '#ffe6e6', successBg: '#e6ffe6', error: '#f00', success: '#0f0', warning: '#fa0' },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8', text: '#1a5c1a' },
            care: { primary: '#f90', background: '#fff3e0', text: '#7a4000' },
            plan: { primary: '#90f', background: '#f3e0ff', text: '#4a007a', accent: '#b060f0', secondary: '#d0a0ff' },
        },
        brand: { primary: '#00f' },
    },
}));

jest.mock('@web/design-system/src/tokens/spacing', () => ({
    spacingValues: {
        '4xs': 1,
        '3xs': 2,
        '2xs': 4,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 20,
        xl: 24,
        '2xl': 32,
        '3xl': 48,
        '4xl': 64,
        '5xl': 80,
    },
}));

jest.mock('@web/design-system/src/tokens/typography', () => ({
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24 },
}));

jest.mock('@web/design-system/src/tokens/borderRadius', () => ({
    borderRadiusValues: { xs: 4, sm: 4, md: 8, lg: 12, full: 9999 },
}));

jest.mock('@web/design-system/src/themes/base.theme', () => ({}));

jest.mock('src/web/shared/types/plan.types', () => ({
    Benefit: {},
}));

jest.mock('src/web/shared/constants/journeys', () => ({
    JOURNEY_IDS: { PLAN: 'plan', HEALTH: 'health', CARE: 'care' },
}));

jest.mock('../components/shared/EmptyState', () => {
    const { View, Text } = require('react-native');
    return ({ title }: any) => (
        <View testID="mock-empty-state">
            <Text>{title}</Text>
        </View>
    );
});

jest.mock('../components/shared/ErrorState', () => {
    const { View } = require('react-native');
    return () => <View testID="mock-error-state" />;
});

jest.mock('../components/shared/LoadingIndicator', () => {
    const { View } = require('react-native');
    return () => <View testID="mock-loading-indicator" />;
});

jest.mock('../components/shared/JourneyHeader', () => {
    const { View } = require('react-native');
    return () => <View testID="mock-journey-header" />;
});

import BenefitsScreen from '../Benefits';

describe('BenefitsScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<BenefitsScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('renders the journey header', () => {
        const { getByTestId } = render(<BenefitsScreen />);
        expect(getByTestId('mock-journey-header')).toBeTruthy();
    });

    it('shows loading state initially', () => {
        const { getByTestId } = render(<BenefitsScreen />);
        expect(getByTestId('mock-loading-indicator')).toBeTruthy();
    });
});
