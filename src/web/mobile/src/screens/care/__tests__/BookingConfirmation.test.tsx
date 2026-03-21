import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: {
            appointmentId: 'apt-001',
            doctorId: 'doc-001',
            date: '2026-03-15',
            time: '14:00',
            type: 'presencial',
        },
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
    Button: ({ children, ...props }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID={props.testID || 'mock-button'}>
                <Text>{children}</Text>
            </TouchableOpacity>
        );
    },
}));

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
    Card: ({ children }: any) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
}));

jest.mock('src/web/design-system/src/components/Checkbox/Checkbox', () => ({
    Checkbox: (_props: any) => {
        const { View } = require('react-native');
        return <View testID="mock-checkbox" />;
    },
}));

jest.mock('src/web/design-system/src/components/Badge/Badge', () => ({
    Badge: ({ children }: any) => {
        const { Text } = require('react-native');
        return <Text>{children}</Text>;
    },
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children, ..._props }: any) => {
        const { Text: RNText } = require('react-native');
        return <RNText>{children}</RNText>;
    },
}));

jest.mock('src/web/mobile/src/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: any) => {
        const { View, Text } = require('react-native');
        return (
            <View testID="mock-journey-header">
                <Text>{title}</Text>
            </View>
        );
    },
}));

jest.mock('src/web/mobile/src/constants/routes', () => ({
    ROUTES: {
        CARE_DASHBOARD: 'CareDashboard',
        CARE_WAITING_ROOM: 'CareWaitingRoom',
    },
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { success: '#0f0' },
        gray: { 50: '#888', 70: '#555' },
        neutral: { white: '#fff' },
        journeys: { care: { background: '#fff3e0' } },
    },
}));

import BookingConfirmation from '../BookingConfirmation';

describe('BookingConfirmation', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<BookingConfirmation />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the success checkmark', () => {
        const { getAllByText } = render(<BookingConfirmation />);
        const checkmarks = getAllByText('\u2713');
        expect(checkmarks.length).toBeGreaterThan(0);
    });

    it('displays the doctor name', () => {
        const { getByText } = render(<BookingConfirmation />);
        expect(getByText('Dra. Maria Silva')).toBeTruthy();
    });
});
