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

jest.mock('styled-components/native', () => ({
    useTheme: () => ({
        colors: {
            background: { default: '#fff', muted: '#f5f5f5' },
            text: { default: '#000', muted: '#888', onBrand: '#fff' },
            border: { default: '#ddd' },
        },
    }),
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
    colors: {
        semantic: { error: '#f00', warning: '#fa0', info: '#0af' },
        journeys: { health: { primary: '#0f0' } },
        neutral: { black: '#000' },
    },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, xl: 24, '3xs': 2, '3xl': 48, '4xl': 64 },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadiusValues: { xs: 4, md: 8, full: 9999 },
}));

jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

import { HomeAlertScreen } from '../HomeAlert';

describe('HomeAlertScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<HomeAlertScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the alert header title', () => {
        const { getByText } = render(<HomeAlertScreen />);
        expect(getByText('home.alert.title')).toBeTruthy();
    });

    it('displays mock alert titles', () => {
        const { getByText } = render(<HomeAlertScreen />);
        expect(getByText('Pressao arterial elevada')).toBeTruthy();
        expect(getByText('Medicamento pendente')).toBeTruthy();
    });
});
