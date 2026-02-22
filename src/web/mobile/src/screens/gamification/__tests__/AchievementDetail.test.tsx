import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useRoute: () => ({ params: { achievementId: 'a1' } }),
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
      background: { default: '#fff', subtle: '#f5f5f5', muted: '#eee' },
      text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
      border: { default: '#ddd' },
    },
  }),
}));

jest.mock('../../hooks/useGamification', () => ({
  useAchievements: () => [
    {
      id: 'a1',
      title: 'First Steps',
      description: 'Complete your first health action',
      journey: 'health',
      icon: '🏅',
      progress: 5,
      total: 5,
      unlocked: true,
    },
    {
      id: 'a2',
      title: 'Care Pioneer',
      description: 'Complete care actions',
      journey: 'care',
      icon: '🩺',
      progress: 2,
      total: 5,
      unlocked: false,
    },
  ],
}));

jest.mock('../../../../shared/types/gamification.types', () => ({
  Achievement: {},
}));

jest.mock('../../../../design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f' },
    gray: { 5: '#fafafa', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#888' },
    semantic: { errorBg: '#ffe6e6', successBg: '#e6ffe6', error: '#f00', success: '#0f0', warning: '#fa0' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8', text: '#1a5c1a' },
      care: { primary: '#f90', background: '#fff3e0', text: '#7a4000' },
      plan: { primary: '#90f', background: '#f3e0ff', text: '#4a007a' },
    },
    neutral: { white: '#fff', black: '#000' },
  },
}));

jest.mock('../../../../design-system/src/tokens/spacing', () => ({
  spacingValues: {
    '4xs': 1, '3xs': 2, '2xs': 4, xs: 4, sm: 8, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64, '5xl': 80,
  },
}));

jest.mock('../../../../design-system/src/tokens/typography', () => ({
  fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24 },
}));

jest.mock('../../../../design-system/src/tokens/borderRadius', () => ({
  borderRadiusValues: { xs: 4, sm: 4, md: 8, lg: 12, full: 9999 },
}));

jest.mock('../../../../design-system/src/tokens/sizing', () => ({
  sizingValues: { component: { xs: 20, sm: 32, md: 40, lg: 48, xl: 64 } },
}));

jest.mock('../../../../design-system/src/themes/base.theme', () => ({}));

import AchievementDetailScreen from '../AchievementDetail';

describe('AchievementDetailScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AchievementDetailScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays achievement title', () => {
    const { getByText } = render(<AchievementDetailScreen />);
    expect(getByText('First Steps')).toBeTruthy();
  });

  it('displays achievement description', () => {
    const { getByText } = render(<AchievementDetailScreen />);
    expect(getByText('Complete your first health action')).toBeTruthy();
  });
});
