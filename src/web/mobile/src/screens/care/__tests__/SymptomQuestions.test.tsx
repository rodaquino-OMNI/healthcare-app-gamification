import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: { symptoms: [], description: '', regions: [], details: [] },
    }),
    RouteProp: {},
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('@austa/design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
        neutral: {
            white: '#fff',
            black: '#000',
            gray200: '#e0e0e0',
            gray300: '#ccc',
            gray500: '#888',
            gray600: '#666',
            gray700: '#444',
        },
        journeys: {
            care: { primary: '#f90', background: '#fff3e0', secondary: '#fa0', text: '#333' },
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
    },
}));

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

jest.mock('@austa/design-system/src/components/Card/Card', () => ({
    Card: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

jest.mock('@austa/design-system/src/components/RadioButton/RadioButton', () => ({
    RadioButton: ({ label, testID }: any) => {
        const { Text } = require('react-native');
        return <Text testID={testID}>{label}</Text>;
    },
}));

jest.mock('@austa/design-system/src/components/Checkbox/Checkbox', () => ({
    Checkbox: ({ label, testID }: any) => {
        const { Text } = require('react-native');
        return <Text testID={testID}>{label}</Text>;
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

jest.mock('../../../../constants/routes', () => ({
    ROUTES: {
        CARE_SYMPTOM_SEVERITY: 'CareSymptomSeverity',
    },
}));

import SymptomQuestions from '../SymptomQuestions';

describe('SymptomQuestions', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<SymptomQuestions />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the questions title', () => {
        const { getByTestId } = render(<SymptomQuestions />);
        expect(getByTestId('questions-title')).toBeTruthy();
    });

    it('displays the question text', () => {
        const { getByTestId } = render(<SymptomQuestions />);
        expect(getByTestId('question-text')).toBeTruthy();
    });

    it('renders the stepper', () => {
        const { getByTestId } = render(<SymptomQuestions />);
        expect(getByTestId('mock-stepper')).toBeTruthy();
    });

    it('renders the back button on first question', () => {
        const { getByTestId } = render(<SymptomQuestions />);
        expect(getByTestId('back-button')).toBeTruthy();
    });

    it('renders the next button', () => {
        const { getByTestId } = render(<SymptomQuestions />);
        expect(getByTestId('next-button')).toBeTruthy();
    });
});
