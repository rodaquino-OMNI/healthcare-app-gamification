import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { doctorId: 'doc-001' },
  }),
  RouteProp: {},
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

// DoctorProfile uses 'src/web/design-system/...' import paths
jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    neutral: {
      white: '#fff', black: '#000', gray500: '#888', gray700: '#444',
    },
    journeys: {
      care: { primary: '#f90', background: '#fff3e0', text: '#333' },
    },
  },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
  spacingValues: {
    '3xs': 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '3xl': 48,
  },
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
  Button: ({ children, testID, onPress }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={testID || 'mock-button'} onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('src/web/design-system/src/components/Badge/Badge', () => ({
  Badge: ({ children, testID }: any) => {
    const { Text } = require('react-native');
    return <Text testID={testID}>{children}</Text>;
  },
}));

jest.mock('src/web/design-system/src/components/Avatar/Avatar', () => ({
  Avatar: ({ name }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="mock-avatar">
        <Text>{name}</Text>
      </View>
    );
  },
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
  Text: ({ children, testID }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={testID}>{children}</RNText>;
  },
}));

jest.mock('src/web/design-system/src/primitives/Box/Box', () => ({
  Box: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('src/web/mobile/src/components/shared/JourneyHeader', () => ({
  JourneyHeader: ({ title }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="journey-header">
        <Text>{title}</Text>
      </View>
    );
  },
}));

jest.mock('src/web/mobile/src/constants/routes', () => ({
  ROUTES: {
    CARE_DOCTOR_AVAILABILITY: 'CareDoctorAvailability',
  },
}));

import DoctorProfile from '../DoctorProfile';

describe('DoctorProfile', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<DoctorProfile />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the journey header', () => {
    const { getByTestId } = render(<DoctorProfile />);
    expect(getByTestId('journey-header')).toBeTruthy();
  });

  it('displays the doctor name', () => {
    const { getByTestId } = render(<DoctorProfile />);
    expect(getByTestId('doctor-name')).toBeTruthy();
  });

  it('displays the about heading', () => {
    const { getByTestId } = render(<DoctorProfile />);
    expect(getByTestId('about-heading')).toBeTruthy();
  });

  it('displays the doctor bio', () => {
    const { getByTestId } = render(<DoctorProfile />);
    expect(getByTestId('doctor-bio')).toBeTruthy();
  });

  it('renders the avatar', () => {
    const { getByTestId } = render(<DoctorProfile />);
    expect(getByTestId('mock-avatar')).toBeTruthy();
  });
});
