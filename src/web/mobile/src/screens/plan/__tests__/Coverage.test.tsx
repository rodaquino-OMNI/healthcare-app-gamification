import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: { planId: 'plan-123' } }),
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

jest.mock('@web/design-system/src/tokens', () => ({
  colors: {
    neutral: { white: '#fff', black: '#000', gray700: '#444' },
    gray: { 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#888', 60: '#666' },
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8', text: '#1a5c1a' },
      care: { primary: '#f90', background: '#fff3e0', text: '#7a4000' },
      plan: { primary: '#90f', background: '#f3e0ff', text: '#4a007a' },
    },
    brand: { primary: '#00f' },
  },
  typography: {
    fontFamily: { heading: 'System', body: 'System' },
    fontWeight: { bold: '700', semiBold: '600', medium: '500', regular: '400' },
    fontSize: {},
  },
  spacing: {},
  borderRadius: {},
  sizing: {},
}));

jest.mock('@web/design-system/src/themes/base.theme', () => ({}));

jest.mock('src/web/shared/constants/journeys', () => ({
  JOURNEY_IDS: { PLAN: 'plan', HEALTH: 'health', CARE: 'care' },
}));

jest.mock('src/web/shared/types/plan.types', () => ({
  Coverage: {},
}));

jest.mock('src/web/mobile/src/hooks/useCoverage', () => ({
  useCoverage: () => ({ coverage: [], isLoading: false, error: null }),
}));

jest.mock('src/web/mobile/src/context/JourneyContext', () => ({
  JourneyContext: React.createContext({ setJourney: jest.fn() }),
}));

import Coverage from '../Coverage';

describe('Coverage', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Coverage />);
    expect(toJSON()).not.toBeNull();
  });

  it('shows empty state when no coverage items', () => {
    const { getByText } = render(<Coverage />);
    expect(getByText('journeys.plan.coverage.empty')).toBeTruthy();
  });

  it('renders loading state when isLoading is true', () => {
    const useCoverage = require('src/web/mobile/src/hooks/useCoverage').useCoverage;
    useCoverage.mockReturnValueOnce({ coverage: [], isLoading: true, error: null });
    const { getByText } = render(<Coverage />);
    expect(getByText('journeys.plan.coverage.loading')).toBeTruthy();
  });
});
