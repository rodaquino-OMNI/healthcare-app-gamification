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
    t: (key: string) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {}, isValid: false, isSubmitting: false },
    register: jest.fn(() => ({})),
  }),
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(() => jest.fn()),
}));

jest.mock('styled-components/native', () => {
  const RN = require('react-native');
  const styled = (Component: any) => {
    const StyledComponent = (props: any) => <Component {...props} />;
    StyledComponent.attrs = () => StyledComponent;
    return StyledComponent;
  };
  const proxy = new Proxy(styled, {
    get: (_target, prop) => {
      if (prop === 'default') return styled;
      if (typeof prop === 'string' && RN[prop]) {
        const Comp = RN[prop];
        return (_strs: any) => (props: any) => <Comp {...props} />;
      }
      return (_strs: any) => (props: any) => <RN.View {...props} />;
    },
  });
  return { __esModule: true, default: proxy, useTheme: () => ({ colors: { background: { default: '#fff' }, text: { default: '#000', muted: '#888' } } }) };
});

jest.mock('src/web/shared/utils/validation', () => ({
  userValidationSchema: {},
}));

jest.mock('src/web/mobile/src/api/auth', () => ({
  register: jest.fn(),
}));

jest.mock('src/web/mobile/src/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
  Button: ({ children, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={props.testID || 'mock-button'}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Input/Input', () => ({
  Input: (props: any) => {
    const { View } = require('react-native');
    return <View testID={props.testID || 'mock-input'} />;
  },
}));

jest.mock('src/web/design-system/src/components/Checkbox/Checkbox', () => ({
  Checkbox: (props: any) => {
    const { View } = require('react-native');
    return <View testID={props.testID || 'mock-checkbox'} />;
  },
}));

jest.mock('src/web/shared/constants/routes', () => ({
  MOBILE_AUTH_ROUTES: {
    LOGIN: 'Login',
    REGISTER: 'Register',
  },
}));

jest.mock('../../../../../design-system/src/tokens/colors', () => ({
  colors: { semantic: { error: '#f00' }, brand: { primary: '#00f' } },
}));

jest.mock('../../../../../design-system/src/tokens/typography', () => ({
  typography: { fontSize: {}, fontWeight: {}, fontFamily: {} },
}));

jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
  spacing: {},
  spacingValues: { lg: 24, sm: 8, '3xs': 2 },
}));

jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
  borderRadius: {},
}));

import RegisterScreen from '../Register';

describe('RegisterScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RegisterScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the register title translation key', () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText('register.title')).toBeTruthy();
  });

  it('renders the submit button', () => {
    const { getByTestId } = render(<RegisterScreen />);
    expect(getByTestId('register-submit-button')).toBeTruthy();
  });
});
