import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
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
      background: { default: '#fff', subtle: '#f5f5f5' },
      text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
      border: { default: '#ddd' },
    },
  }),
}));

jest.mock('../HomeHeader', () => ({
  HomeHeader: () => {
    const { View } = require('react-native');
    return <View testID="mock-home-header" />;
  },
}));

jest.mock('../HomeWidgets', () => ({
  ChartPreview: () => null,
  GoalsSection: () => null,
  JourneysSection: () => null,
}));

jest.mock('../HomeQuickActions', () => ({
  QuickActions: () => null,
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    session: { accessToken: 'mock-token' },
    getUserFromToken: () => ({ name: 'Test User', id: '1' }),
  }),
}));

jest.mock('../../../context/GamificationContext', () => ({
  useGamification: () => ({
    gameProfile: { level: 5, xp: 1200 },
  }),
}));

jest.mock('../../../constants/routes', () => ({
  ROUTES: {
    HEALTH_DASHBOARD: 'HealthDashboard',
    CARE_DASHBOARD: 'CareDashboard',
    PLAN_DASHBOARD: 'PlanDashboard',
    HEALTH_METRIC_DETAIL: 'HealthMetricDetail',
    PROFILE: 'Profile',
    HEALTH_ADD_METRIC: 'HealthAddMetric',
  },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8' },
      care: { primary: '#f90', background: '#fff3e0' },
      plan: { primary: '#90f', background: '#f3e0ff' },
    },
    neutral: { black: '#000' },
  },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
  spacingValues: { xs: 4, sm: 8, md: 16, lg: 24, '3xs': 2, '3xl': 48 },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
  fontSizeValues: { xs: 12, sm: 14, lg: 18, xl: 20 },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
  borderRadiusValues: { md: 8, lg: 12 },
}));

jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

import HomeScreen from '../Home';

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the HomeHeader component', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('mock-home-header')).toBeTruthy();
  });

  it('displays gamification XP text', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('1200 XP')).toBeTruthy();
  });
});
