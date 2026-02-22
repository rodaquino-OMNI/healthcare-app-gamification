import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: { planId: 'plan-abc-123' } }),
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

jest.mock('@web/design-system/src/tokens/colors', () => ({
  colors: {
    neutral: { white: '#fff', black: '#000' },
    gray: { 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#888', 60: '#666' },
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8', text: '#1a5c1a' },
      care: { primary: '#f90', background: '#fff3e0', text: '#7a4000' },
      plan: { primary: '#90f', background: '#f3e0ff', text: '#4a007a' },
    },
    brand: { primary: '#00f' },
  },
}));

jest.mock('@web/design-system/src/tokens/spacing', () => ({
  spacingValues: {
    '4xs': 1, '3xs': 2, '2xs': 4, xs: 4, sm: 8, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64, '5xl': 80,
  },
}));

jest.mock('@web/design-system/src/tokens/typography', () => ({
  fontSizeValues: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24 },
}));

jest.mock('@web/design-system/src/tokens/borderRadius', () => ({
  borderRadiusValues: { xs: 4, sm: 4, md: 8, lg: 12, full: 9999 },
}));

jest.mock('@web/design-system/src/themes/base.theme', () => ({}));

jest.mock('src/web/mobile/src/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    session: null,
    getUserFromToken: jest.fn(),
  }),
}));

jest.mock('src/web/mobile/src/api/plan', () => ({
  getDigitalCard: jest.fn().mockResolvedValue({
    cardImageUrl: '',
    cardData: {
      planName: 'AUSTA Care Plan',
      planType: 'HMO',
      memberName: 'Test User',
      cpf: '000.000.000-00',
      planNumber: '12345',
      validityStart: '2024-01-01',
      validityEnd: '2024-12-31',
    },
  }),
}));

import DigitalCardScreen from '../DigitalCard';

describe('DigitalCardScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<DigitalCardScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the AUSTA logo text', () => {
    const { getByText } = render(<DigitalCardScreen />);
    expect(getByText('AUSTA')).toBeTruthy();
  });

  it('displays default plan name when no card data loaded', () => {
    const { getByText } = render(<DigitalCardScreen />);
    expect(getByText('AUSTA Care Plan')).toBeTruthy();
  });
});
