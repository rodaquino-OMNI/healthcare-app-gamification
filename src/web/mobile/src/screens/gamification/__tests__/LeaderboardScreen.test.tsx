import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => key,
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

jest.mock('../../../../design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f', secondary: '#00a' },
    gray: { 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#888' },
    semantic: { warning: '#fa0', success: '#0f0', error: '#f00' },
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

import LeaderboardScreen from '../LeaderboardScreen';

describe('LeaderboardScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<LeaderboardScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the leaderboard title', () => {
    const { getByText } = render(<LeaderboardScreen />);
    expect(getByText('gamification.leaderboard.title')).toBeTruthy();
  });

  it('displays the full ranking section header', () => {
    const { getByText } = render(<LeaderboardScreen />);
    expect(getByText('gamification.leaderboard.fullRanking')).toBeTruthy();
  });
});
