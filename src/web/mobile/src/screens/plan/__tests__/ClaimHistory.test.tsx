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
      text: { default: '#000', muted: '#888' },
      border: { default: '#ddd' },
    },
  }),
}));

jest.mock('src/web/shared/types/plan.types', () => ({
  ClaimStatus: {},
  ClaimType: {},
}));

jest.mock('src/web/mobile/src/hooks/useJourney', () => ({
  useJourney: () => ({ journey: 'plan' }),
}));

jest.mock('src/web/shared/constants/routes', () => ({
  MOBILE_PLAN_ROUTES: {
    CLAIMS: 'Claims',
    CLAIM_SUBMISSION: 'ClaimSubmission',
  },
}));

jest.mock('@web/design-system/src/tokens', () => ({
  colors: {
    neutral: { white: '#fff', black: '#000' },
    gray: { 30: '#ddd', 40: '#ccc', 50: '#888' },
    semantic: { warningBg: '#fff3e0', successBg: '#e6ffe6', errorBg: '#ffe6e6', warning: '#fa0', success: '#0f0', error: '#f00' },
    journeys: { plan: { primary: '#90f', background: '#f3e0ff', text: '#333', accent: '#b060f0', secondary: '#d0a0ff' } },
  },
  typography: { fontFamily: { body: 'System', heading: 'System' }, fontWeight: { bold: '700', semiBold: '600', medium: '500' } },
  spacing: {},
  borderRadius: {},
}));

jest.mock('@web/design-system/src/themes/base.theme', () => ({}));

import ClaimHistory from '../ClaimHistory';

describe('ClaimHistory', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<ClaimHistory />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays filter tabs', () => {
    const { getByText } = render(<ClaimHistory />);
    expect(getByText('Todos')).toBeTruthy();
    expect(getByText('Pendentes')).toBeTruthy();
  });

  it('displays the new claim FAB', () => {
    const { getByText } = render(<ClaimHistory />);
    expect(getByText('journeys.plan.claims.newClaim')).toBeTruthy();
  });
});
