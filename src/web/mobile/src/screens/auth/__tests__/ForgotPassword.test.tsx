import React from 'react';
import { render } from '@testing-library/react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  StackNavigationProp: {},
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
  }),
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(() => jest.fn()),
}));

jest.mock('styled-components/native', () => {
  const RN = require('react-native');
  const styled = (Component: any) => (strs: any) => (props: any) => <Component {...props} />;
  styled.View = (strs: any) => (props: any) => <RN.View {...props} />;
  styled.Text = (strs: any) => (props: any) => <RN.Text {...props} />;
  styled.SafeAreaView = (strs: any) => (props: any) => <RN.View {...props} />;
  styled.TouchableOpacity = (strs: any) => (props: any) => <RN.TouchableOpacity {...props} />;
  return { __esModule: true, default: styled, useTheme: () => ({ colors: { background: { default: '#fff' }, text: { default: '#000', muted: '#888' } } }) };
});

jest.mock('src/web/design-system/src/components/Button', () => ({
  Button: ({ children, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={props.testID || 'mock-button'} onPress={props.onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Input', () => {
  const { View } = require('react-native');
  return (props: any) => <View testID={props.testID || 'mock-input'} />;
});

jest.mock('src/web/mobile/src/hooks/useAuth', () => ({
  useAuth: () => ({
    forgotPassword: jest.fn(),
  }),
}));

jest.mock('src/web/mobile/src/utils', () => ({
  showToast: jest.fn(),
  validationSchema: { email: {} },
}));

jest.mock('src/web/shared/constants/routes', () => ({
  MOBILE_AUTH_ROUTES: {
    LOGIN: 'Login',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
  colors: { semantic: { error: '#f00' }, brand: { primary: '#00f' } },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
  typography: { fontSize: {}, fontWeight: {}, fontFamily: {} },
  fontSizeValues: { xs: 12, md: 14, xl: 20, '2xl': 24, '4xl': 32 },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
  spacing: {},
  spacingValues: { xs: 4, md: 16, lg: 24, xl: 32, '2xl': 40, '3xs': 2 },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
  borderRadius: {},
  borderRadiusValues: {},
}));

import ForgotPasswordScreen from '../ForgotPassword';

describe('ForgotPasswordScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <ForgotPasswordScreen navigation={{ navigate: mockNavigate } as any} />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('displays the forgot password title', () => {
    const { getByText } = render(
      <ForgotPasswordScreen navigation={{ navigate: mockNavigate } as any} />,
    );
    expect(getByText('auth.forgotPassword.title')).toBeTruthy();
  });

  it('renders the email input', () => {
    const { getByTestId } = render(
      <ForgotPasswordScreen navigation={{ navigate: mockNavigate } as any} />,
    );
    expect(getByTestId('email-input')).toBeTruthy();
  });
});
