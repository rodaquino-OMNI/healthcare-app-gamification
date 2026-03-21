import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: { medicationId: '1' },
    }),
    RouteProp: {},
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, _params?: any) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('../../constants/routes', () => ({
    ROUTES: {
        HEALTH_MEDICATION_ADD: 'HealthMedicationAdd',
    },
}));

jest.mock('@austa/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children, ...props }: any) => {
        const { Text: RNText } = require('react-native');
        return <RNText testID={props.testID}>{children}</RNText>;
    },
}));

jest.mock('@austa/design-system/src/primitives/Touchable/Touchable', () => ({
    Touchable: ({ children, ...props }: any) => {
        const { TouchableOpacity } = require('react-native');
        return (
            <TouchableOpacity testID={props.testID} style={props.style} onPress={props.onPress}>
                {children}
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

jest.mock('@austa/design-system/src/components/Button/Button', () => ({
    Button: ({ children }: any) => {
        const { Text } = require('react-native');
        return <Text>{children}</Text>;
    },
}));

jest.mock('@austa/design-system/src/components/Badge/Badge', () => ({
    Badge: ({ children }: any) => {
        const { Text } = require('react-native');
        return <Text>{children}</Text>;
    },
}));

jest.mock('@austa/design-system/src/components/ProgressBar/ProgressBar', () => ({
    ProgressBar: () => {
        const { View } = require('react-native');
        return <View testID="mock-progress-bar" />;
    },
}));

jest.mock('@austa/design-system/src/components/Modal/Modal', () => ({
    Modal: ({ children, visible }: any) => {
        if (!visible) {
            return null;
        }
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

jest.mock('@austa/design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { success: '#0f0', warning: '#fa0', error: '#f00' },
        neutral: {
            gray200: '#e0e0e0',
            gray300: '#ccc',
            gray500: '#888',
            gray600: '#666',
            gray700: '#444',
            white: '#fff',
            black: '#000',
        },
        journeys: { health: { primary: '#0f0', background: '#e8ffe8' } },
    },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, xl: 24, '2xl': 32, '3xs': 2, '3xl': 48 },
}));

import MedicationDetail from '../MedicationDetail';

describe('MedicationDetail', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<MedicationDetail />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the medication name', () => {
        const { getByText } = render(<MedicationDetail />);
        expect(getByText('Metformin')).toBeTruthy();
    });

    it('displays the back button', () => {
        const { getByTestId } = render(<MedicationDetail />);
        expect(getByTestId('back-button')).toBeTruthy();
    });

    it('displays the delete medication button', () => {
        const { getByTestId } = render(<MedicationDetail />);
        expect(getByTestId('delete-medication-button')).toBeTruthy();
    });
});
