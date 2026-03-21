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
            background: { default: '#fff', subtle: '#f5f5f5', muted: '#eee' },
            text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
            border: { default: '#ddd' },
        },
    }),
}));

jest.mock('../../hooks/useGamification', () => ({
    useGameProfile: () => ({ level: 5, xp: 1200 }),
    useAchievements: () => [
        { id: 'a1', title: 'First Steps', journey: 'health', icon: '🏅', progress: 5, total: 5, unlocked: true },
        { id: 'a2', title: 'Care Pioneer', journey: 'care', icon: '🩺', progress: 2, total: 5, unlocked: false },
    ],
}));

jest.mock('../../../../shared/types/gamification.types', () => ({
    Achievement: {},
}));

jest.mock('../../../../design-system/src/tokens/colors', () => ({
    colors: {
        brand: { primary: '#00f' },
        gray: { 20: '#eee', 30: '#ddd' },
        semantic: { successBg: '#e6ffe6', success: '#0f0' },
        journeys: { health: { primary: '#0f0' }, care: { primary: '#f90' }, plan: { primary: '#90f' } },
    },
}));

jest.mock('../../../../design-system/src/tokens/spacing', () => ({
    spacingValues: { xs: 4, sm: 8, md: 16, lg: 24, '2xl': 32, '3xs': 2, '4xs': 1, '4xl': 64, '5xl': 80, xl: 24 },
}));

jest.mock('../../../../design-system/src/tokens/typography', () => ({
    fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24 },
}));

jest.mock('../../../../design-system/src/tokens/borderRadius', () => ({
    borderRadiusValues: { xs: 4, sm: 4, lg: 12, full: 9999 },
}));

jest.mock('../../../../design-system/src/tokens/sizing', () => ({
    sizingValues: { component: { lg: 48, xl: 64 } },
}));

jest.mock('../../../../design-system/src/themes/base.theme', () => ({}));

import AchievementsScreen from '../Achievements';

describe('AchievementsScreen', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<AchievementsScreen />);
        expect(toJSON()).not.toBeNull();
    });

    it('displays the level number', () => {
        const { getByText } = render(<AchievementsScreen />);
        expect(getByText('5')).toBeTruthy();
    });

    it('displays achievement titles', () => {
        const { getByText } = render(<AchievementsScreen />);
        expect(getByText('First Steps')).toBeTruthy();
        expect(getByText('Care Pioneer')).toBeTruthy();
    });
});
