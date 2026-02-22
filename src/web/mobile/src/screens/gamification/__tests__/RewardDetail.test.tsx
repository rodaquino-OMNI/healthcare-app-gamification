import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
    push: jest.fn(),
  }),
  useRoute: () => ({ params: { rewardId: 'r-001' } }),
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

jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f' },
    gray: { 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#888' },
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8', text: '#1a5c1a' },
      care: { primary: '#f90', background: '#fff3e0', text: '#7a4000' },
      plan: { primary: '#90f', background: '#f3e0ff', text: '#4a007a' },
    },
    neutral: { white: '#fff', black: '#000', gray400: '#aaa' },
  },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
  spacingValues: {
    '4xs': 1, '3xs': 2, '2xs': 4, xs: 4, sm: 8, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64, '5xl': 80,
  },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
  borderRadiusValues: { xs: 4, sm: 4, md: 8, lg: 12, full: 9999 },
}));

jest.mock('src/web/design-system/src/tokens/sizing', () => ({
  sizingValues: { component: { xs: 20, sm: 32, md: 40, lg: 48, xl: 64 } },
}));

jest.mock('src/web/shared/types/gamification.types', () => ({
  Reward: {},
}));

jest.mock('../../../../design-system/src/themes/base.theme', () => ({}));

import RewardDetail from '../RewardDetail';

describe('RewardDetail', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RewardDetail />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the reward title', () => {
    const { getByText } = render(<RewardDetail />);
    expect(getByText('Priority Scheduling')).toBeTruthy();
  });

  it('displays the reward description', () => {
    const { getByText } = render(<RewardDetail />);
    expect(getByText('Get priority access when booking your next appointment within 30 days.')).toBeTruthy();
  });
});
