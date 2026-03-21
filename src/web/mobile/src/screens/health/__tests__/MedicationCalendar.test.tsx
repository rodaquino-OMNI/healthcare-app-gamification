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

jest.mock('../../constants/routes', () => ({
    ROUTES: {
        HEALTH_MEDICATION_LIST: 'HealthMedicationList',
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
    Button: ({ children, ...props }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID={props.testID || 'mock-button'}>
                <Text>{children}</Text>
            </TouchableOpacity>
        );
    },
}));

jest.mock('@austa/design-system/src/components/Badge/Badge', () => ({
    Badge: ({ children }: any) => {
        const { Text } = require('react-native');
        return <Text>{children}</Text>;
    },
}));

jest.mock('@austa/design-system/src/tokens/colors', () => ({
    colors: {
        neutral: { gray300: '#ccc', gray500: '#888', gray600: '#666', gray900: '#111', white: '#fff', black: '#000' },
        journeys: { health: { primary: '#0f0', background: '#e8ffe8' } },
    },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, '3xs': 2, '3xl': 48, '5xl': 80 },
}));

import { MedicationCalendar } from '../MedicationCalendar';

describe('MedicationCalendar', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<MedicationCalendar />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the calendar title', () => {
        const { getByText } = render(<MedicationCalendar />);
        expect(getByText('medication.calendar.title')).toBeTruthy();
    });

    it('renders the back button', () => {
        const { getByTestId } = render(<MedicationCalendar />);
        expect(getByTestId('back-button')).toBeTruthy();
    });

    it('renders the view monthly button', () => {
        const { getByTestId } = render(<MedicationCalendar />);
        expect(getByTestId('view-monthly-button')).toBeTruthy();
    });
});
