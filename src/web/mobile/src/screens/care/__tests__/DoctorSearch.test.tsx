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

jest.mock('src/web/design-system/src/components/Input/Input', () => ({
    Input: (props: any) => {
        const { View } = require('react-native');
        return <View testID={props.testID || 'mock-input'} />;
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

jest.mock('src/web/mobile/src/components/shared/LoadingIndicator', () => ({
    LoadingIndicator: () => null,
}));

jest.mock('src/web/mobile/src/constants/routes', () => ({
    ROUTES: {
        CARE_DOCTOR_PROFILE: 'CareDoctorProfile',
        CARE_DOCTOR_FILTERS: 'CareDoctorFilters',
    },
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        neutral: { white: '#fff', gray500: '#888' },
        journeys: { care: { background: '#fff3e0' } },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, '3xs': 2, '3xl': 48 },
}));

jest.mock('./DoctorSearchFilters', () => ({
    SPECIALTIES: ['Todos', 'Clinica Geral', 'Cardiologia'],
    SpecialtyTabs: () => null,
    ControlsRow: () => null,
}));

jest.mock('./DoctorSearchList', () => ({
    MOCK_DOCTORS: [
        {
            id: '1',
            name: 'Dra. Maria Silva',
            specialty: 'Clinica Geral',
            rating: 4.8,
            distance: '0.5km',
            price: 'R$ 200',
        },
    ],
    DoctorItem: () => null,
    MapPlaceholder: () => null,
}));

import DoctorSearch from '../DoctorSearch';

describe('DoctorSearch', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<DoctorSearch />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the journey header', () => {
        const { getByTestId } = render(<DoctorSearch />);
        expect(getByTestId('mock-journey-header')).toBeTruthy();
    });

    it('renders the search input', () => {
        const { getByTestId } = render(<DoctorSearch />);
        expect(getByTestId('doctor-search-input')).toBeTruthy();
    });
});
