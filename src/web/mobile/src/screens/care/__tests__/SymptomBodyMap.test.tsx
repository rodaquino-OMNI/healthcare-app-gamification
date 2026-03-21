import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({ params: { symptoms: [], description: '' } }),
    RouteProp: {},
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

jest.mock('@austa/design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
        neutral: { white: '#fff', black: '#000', gray300: '#ccc', gray500: '#888', gray600: '#666', gray700: '#444' },
        journeys: {
            health: { primary: '#0f0', background: '#e8ffe8' },
            care: { primary: '#f90', background: '#fff3e0', accent: '#f60', text: '#333', secondary: '#fa0' },
            plan: { primary: '#90f', background: '#f3e0ff' },
        },
    },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
    spacingValues: {
        '3xs': 2,
        '2xs': 4,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
        '4xl': 64,
        '5xl': 80,
    },
}));

jest.mock('@austa/design-system/src/themes/base.theme', () => ({}));

jest.mock('@austa/design-system/src/components/Stepper/Stepper', () => ({
    Stepper: () => {
        const { View } = require('react-native');
        return <View testID="mock-stepper" />;
    },
}));

jest.mock('@austa/design-system/src/components/Button/Button', () => ({
    Button: ({ children, testID, onPress, disabled }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID={testID || 'mock-button'} onPress={onPress} disabled={disabled}>
                <Text>{children}</Text>
            </TouchableOpacity>
        );
    },
}));

jest.mock('@austa/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children, testID }: any) => {
        const { Text: RNText } = require('react-native');
        return <RNText testID={testID}>{children}</RNText>;
    },
}));

jest.mock('@austa/design-system/src/primitives/Box/Box', () => ({
    Box: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

jest.mock('@austa/design-system/src/primitives/Touchable/Touchable', () => ({
    Touchable: ({ children, testID, onPress }: any) => {
        const { TouchableOpacity } = require('react-native');
        return (
            <TouchableOpacity testID={testID} onPress={onPress}>
                {children}
            </TouchableOpacity>
        );
    },
}));

jest.mock('../../../../constants/routes', () => ({
    ROUTES: {
        CARE_SYMPTOM_DETAIL: 'CareSymptomDetail',
    },
}));

import SymptomBodyMap from '../SymptomBodyMap';

describe('SymptomBodyMap', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<SymptomBodyMap />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the body map title', () => {
        const { getByTestId } = render(<SymptomBodyMap />);
        expect(getByTestId('body-map-title')).toBeTruthy();
    });

    it('displays the body map subtitle', () => {
        const { getByTestId } = render(<SymptomBodyMap />);
        expect(getByTestId('body-map-subtitle')).toBeTruthy();
    });

    it('renders the stepper', () => {
        const { getByTestId } = render(<SymptomBodyMap />);
        expect(getByTestId('mock-stepper')).toBeTruthy();
    });

    it('renders the back button', () => {
        const { getByTestId } = render(<SymptomBodyMap />);
        expect(getByTestId('back-button')).toBeTruthy();
    });

    it('renders the continue button', () => {
        const { getByTestId } = render(<SymptomBodyMap />);
        expect(getByTestId('continue-button')).toBeTruthy();
    });

    it('renders the head body region', () => {
        const { getByTestId } = render(<SymptomBodyMap />);
        expect(getByTestId('body-region-head')).toBeTruthy();
    });
});
