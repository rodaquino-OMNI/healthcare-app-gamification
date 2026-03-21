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
        t: (key: string, _params?: any) => key,
        i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
    }),
}));

jest.mock('styled-components/native', () => ({
    useTheme: () => ({
        colors: {
            background: { default: '#fff', subtle: '#f5f5f5' },
            text: { default: '#000', muted: '#888', onBrand: '#fff' },
            border: { default: '#ddd' },
        },
    }),
}));

jest.mock('src/web/shared/types/gamification.types', () => ({
    Reward: {},
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        neutral: { gray500: '#888', gray700: '#444', black: '#000' },
        semantic: { error: '#f00' },
        journeys: { health: { primary: '#0f0' }, care: { primary: '#f90' }, plan: { primary: '#90f' } },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, lg: 24, '3xs': 2, '4xs': 1, '5xl': 80, '2xl': 32 },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
    borderRadiusValues: { md: 8, lg: 12, full: 9999 },
}));

jest.mock('src/web/design-system/src/tokens/sizing', () => ({
    sizingValues: { component: { sm: 32, xl: 64 } },
}));

jest.mock('../../../../design-system/src/themes/base.theme', () => ({}));

import RewardCatalog from '../RewardCatalog';

describe('RewardCatalog', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<RewardCatalog />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the screen title', () => {
        const { getByText } = render(<RewardCatalog />);
        expect(getByText('gamification.rewards.screenTitle')).toBeTruthy();
    });

    it('displays the user XP value', () => {
        const { getByText } = render(<RewardCatalog />);
        expect(getByText('1,250')).toBeTruthy();
    });

    it('displays reward items', () => {
        const { getByText } = render(<RewardCatalog />);
        expect(getByText('Priority Scheduling')).toBeTruthy();
        expect(getByText('Health Report')).toBeTruthy();
    });
});
