import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
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
            care: { primary: '#f90', background: '#fff3e0', text: '#333' },
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
        '5xl': 80,
    },
}));

jest.mock('@austa/design-system/src/components/Card/Card', () => ({
    Card: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

jest.mock('@austa/design-system/src/components/Badge/Badge', () => ({
    Badge: ({ children, testID }: any) => {
        const { Text } = require('react-native');
        return <Text testID={testID}>{children}</Text>;
    },
}));

jest.mock('@austa/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children, testID }: any) => {
        const { Text: RNText } = require('react-native');
        return <RNText testID={testID}>{children}</RNText>;
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
        CARE_SYMPTOM_HISTORY_DETAIL: 'CareSymptomHistoryDetail',
    },
}));

import SymptomHistory from '../SymptomHistory';

describe('SymptomHistory', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<SymptomHistory />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the history title', () => {
        const { getByTestId } = render(<SymptomHistory />);
        expect(getByTestId('history-title')).toBeTruthy();
    });

    it('renders the history list', () => {
        const { getByTestId } = render(<SymptomHistory />);
        expect(getByTestId('history-list')).toBeTruthy();
    });

    it('renders the filter-all tab', () => {
        const { getByTestId } = render(<SymptomHistory />);
        expect(getByTestId('filter-all')).toBeTruthy();
    });

    it('renders the filter-7d tab', () => {
        const { getByTestId } = render(<SymptomHistory />);
        expect(getByTestId('filter-7d')).toBeTruthy();
    });

    it('renders the first history item', () => {
        const { getByTestId } = render(<SymptomHistory />);
        expect(getByTestId('history-item-0')).toBeTruthy();
    });

    it('displays the first check date', () => {
        const { getByTestId } = render(<SymptomHistory />);
        expect(getByTestId('check-date-0')).toBeTruthy();
    });
});
