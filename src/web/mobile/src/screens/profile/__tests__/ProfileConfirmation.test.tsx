import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

jest.mock('../../../../../../design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f' },
    semantic: { error: '#f00', success: '#0f0', successBg: '#e6ffe6' },
    neutral: { white: '#fff', black: '#000', gray700: '#555' },
    gray: { 10: '#f9f9f9', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#aaa' },
    journeys: { plan: { primary: '#90f', background: '#f3e0ff' } },
  },
}));
jest.mock('../../../../../../design-system/src/tokens/spacing', () => ({
  spacing: { '3xs': '2px', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '40px', '3xl': '48px', '4xl': '64px' },
}));
jest.mock('../../../../../../design-system/src/tokens/typography', () => ({
  typography: {
    fontFamily: { body: 'System', heading: 'System' },
    fontSize: { xs: '12px', sm: '14px', md: '16px', 'text-xs': '12px', 'text-sm': '14px', 'text-md': '16px', 'heading-2xl': '34px' },
    fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
  },
}));
jest.mock('../../../../../../design-system/src/tokens/borderRadius', () => ({
  borderRadius: { sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));
jest.mock('../../../../../../design-system/src/tokens/sizing', () => ({
  sizing: { component: { sm: '32px', md: '44px', lg: '56px' } },
}));
jest.mock('../../../../../../design-system/src/tokens/shadows', () => ({
  shadows: {},
}));
jest.mock('../../../../../../design-system/src/themes/base.theme', () => ({}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    session: { accessToken: 'mock-token' },
  }),
}));

jest.mock('../../../api/auth', () => ({
  getProfile: jest.fn().mockResolvedValue({
    name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '+5511999990000',
  }),
}));

const mockTheme = {
  colors: {
    background: { default: '#fff', muted: '#f5f5f5' },
    text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
    border: { default: '#ddd' },
  },
};

import ProfileConfirmation from '../ProfileConfirmation';

describe('ProfileConfirmation', () => {
  const renderComponent = () =>
    render(
      <ThemeProvider theme={mockTheme}>
        <ProfileConfirmation />
      </ThemeProvider>,
    );

  it('renders without crashing', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).not.toBeNull();
  });

  it('displays the continue button', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('profile-confirm-continue')).toBeTruthy();
  });

  it('displays profile summary fields', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('profile-confirm-name')).toBeTruthy();
    expect(getByTestId('profile-confirm-email')).toBeTruthy();
    expect(getByTestId('profile-confirm-phone')).toBeTruthy();
  });
});
