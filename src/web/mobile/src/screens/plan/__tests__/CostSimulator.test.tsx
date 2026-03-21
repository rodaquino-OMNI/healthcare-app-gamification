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
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8', text: '#1a5c1a' },
            care: { primary: '#f90', background: '#fff3e0', text: '#7a4000' },
            plan: { primary: '#90f', background: '#f3e0ff', text: '#4a007a' },
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

jest.mock('src/web/shared/constants/routes', () => ({
    MOBILE_PLAN_ROUTES: { COST_SIMULATOR: 'CostSimulator' },
}));

jest.mock('src/web/design-system/src/components/Input/Input', () => {
    const { View } = require('react-native');
    return ({ testID }: any) => <View testID={testID || 'mock-input'} />;
});

jest.mock('src/web/design-system/src/components/Select/Select', () => ({
    Select: ({ testID }: any) => {
        const { View } = require('react-native');
        return <View testID={testID || 'mock-select'} />;
    },
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => {
    const { TouchableOpacity, Text } = require('react-native');
    return ({ children, onPress, testID }: any) => (
        <TouchableOpacity onPress={onPress} testID={testID || 'mock-button'}>
            <Text>{children}</Text>
        </TouchableOpacity>
    );
});

import CostSimulatorScreen from '../CostSimulator';

describe('CostSimulatorScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<CostSimulatorScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the simulator title', () => {
        const { getByText } = render(<CostSimulatorScreen />);
        expect(getByText('journeys.plan.simulator.title')).toBeTruthy();
    });

    it('displays the simulator subtitle', () => {
        const { getByText } = render(<CostSimulatorScreen />);
        expect(getByText('journeys.plan.simulator.subtitle')).toBeTruthy();
    });
});
