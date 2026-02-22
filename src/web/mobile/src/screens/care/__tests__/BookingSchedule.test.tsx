import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { doctorId: 'doc-001', date: '2026-03-05', time: '09:00' },
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

// BookingSchedule uses 'src/web/design-system/...' import paths
jest.mock('src/web/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    neutral: { white: '#fff', black: '#000', gray500: '#888', gray700: '#444' },
    journeys: {
      care: { primary: '#f90', background: '#fff3e0', text: '#333' },
    },
    gray: { 50: '#888', 70: '#444' },
  },
}));

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
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('src/web/design-system/src/components/Input/Input', () => ({
  Input: ({ label, testID }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={testID || 'mock-input'}>
        <Text>{label}</Text>
      </View>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Select/Select', () => ({
  Select: ({ label }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="mock-select">
        <Text>{label}</Text>
      </View>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Checkbox/Checkbox', () => ({
  Checkbox: ({ label, testID }: any) => {
    const { Text } = require('react-native');
    return <Text testID={testID}>{label}</Text>;
  },
}));

jest.mock('src/web/design-system/src/components/Badge/Badge', () => ({
  Badge: ({ children, testID }: any) => {
    const { Text } = require('react-native');
    return <Text testID={testID}>{children}</Text>;
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
    CARE_BOOKING_CONFIRMATION: 'CareBookingConfirmation',
  },
}));

import BookingSchedule from '../BookingSchedule';

describe('BookingSchedule', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<BookingSchedule />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the journey header', () => {
    const { getByTestId } = render(<BookingSchedule />);
    expect(getByTestId('journey-header')).toBeTruthy();
  });

  it('renders input fields', () => {
    const { getAllByTestId } = render(<BookingSchedule />);
    expect(getAllByTestId('mock-input').length).toBeGreaterThan(0);
  });

  it('renders select for appointment type', () => {
    const { getByTestId } = render(<BookingSchedule />);
    expect(getByTestId('mock-select')).toBeTruthy();
  });
});
