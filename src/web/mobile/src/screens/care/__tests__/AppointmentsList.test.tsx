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
            gray500: '#888',
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
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 40,
        '3xl': 48,
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

jest.mock('@austa/design-system/src/components/Button/Button', () => ({
    Button: ({ children, testID, onPress }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID={testID || 'mock-button'} onPress={onPress}>
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

jest.mock('../../../../constants/routes', () => ({
    ROUTES: {
        CARE_APPOINTMENTS: 'CareAppointments',
        CARE_DOCTOR_SEARCH: 'CareDoctorSearch',
    },
}));

import { AppointmentsList } from '../AppointmentsList';

describe('AppointmentsList', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<AppointmentsList />);
        expect(toJSON()).not.toBeNull();
    });

    it('renders the back button', () => {
        const { getByTestId } = render(<AppointmentsList />);
        expect(getByTestId('back-button')).toBeTruthy();
    });

    it('renders the upcoming tab', () => {
        const { getByTestId } = render(<AppointmentsList />);
        expect(getByTestId('tab-upcoming')).toBeTruthy();
    });

    it('renders the past tab', () => {
        const { getByTestId } = render(<AppointmentsList />);
        expect(getByTestId('tab-past')).toBeTruthy();
    });

    it('renders the cancelled tab', () => {
        const { getByTestId } = render(<AppointmentsList />);
        expect(getByTestId('tab-cancelled')).toBeTruthy();
    });

    it('renders appointment cards for upcoming appointments', () => {
        const { getByTestId } = render(<AppointmentsList />);
        expect(getByTestId('appointment-card-apt-1')).toBeTruthy();
    });
});
