import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { appointmentId: 'appt-001' },
  }),
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

// WaitingRoom uses 'src/web/design-system/...' import paths
jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0', info: '#00f' },
    neutral: { white: '#fff', black: '#000', gray500: '#888', gray700: '#444' },
    journeys: {
      care: { primary: '#f90', background: '#fff3e0', text: '#333' },
    },
    gray: { 50: '#888', 70: '#444' },
  },
}));

jest.mock('src/web/design-system/src/themes/base.theme', () => ({}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
  Button: ({ children, testID, onPress, disabled }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={testID || 'mock-button'} onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
  Card: ({ children, onPress }: any) => {
    const { TouchableOpacity } = require('react-native');
    if (onPress) {
      return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
    }
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

jest.mock('src/web/design-system/src/components/ProgressBar/ProgressBar', () => ({
  ProgressBar: () => {
    const { View } = require('react-native');
    return <View testID="mock-progress-bar" />;
  },
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
  Text: ({ children, testID }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={testID}>{children}</RNText>;
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
    CARE_TELEMEDICINE: 'CareTelemedicine',
  },
}));

// Mock timers to prevent countdown from interfering with tests
jest.useFakeTimers();

import WaitingRoom from '../WaitingRoom';

describe('WaitingRoom', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<WaitingRoom />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the journey header', () => {
    const { getByTestId } = render(<WaitingRoom />);
    expect(getByTestId('journey-header')).toBeTruthy();
  });

  it('renders the progress bar for connection quality', () => {
    const { getByTestId } = render(<WaitingRoom />);
    expect(getByTestId('mock-progress-bar')).toBeTruthy();
  });
});
