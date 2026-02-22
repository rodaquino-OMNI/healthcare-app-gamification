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

jest.mock('@austa/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    neutral: {
      white: '#fff', black: '#000', gray500: '#888', gray600: '#666', gray700: '#444',
    },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8' },
    },
  },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
  spacingValues: {
    '3xs': 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '3xl': 48,
  },
}));

jest.mock('@austa/design-system/src/primitives/Text/Text', () => ({
  Text: ({ children, testID }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={testID}>{children}</RNText>;
  },
}));

jest.mock('@austa/design-system/src/primitives/Touchable/Touchable', () => ({
  Touchable: ({ children, testID, onPress, style }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID={testID} onPress={onPress} style={style}>
        {children}
      </TouchableOpacity>
    );
  },
}));

jest.mock('@austa/design-system/src/components/Card/Card', () => ({
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('@austa/design-system/src/components/Button/Button', () => ({
  Button: ({ children, testID, onPress }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={testID || 'mock-button'} onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('../../constants/routes', () => ({
  ROUTES: {
    HEALTH_MEDICATION_LIST: 'HealthMedicationList',
  },
}));

import { MedicationAdherence } from '../MedicationAdherence';

describe('MedicationAdherence', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<MedicationAdherence />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders the back button', () => {
    const { getByTestId } = render(<MedicationAdherence />);
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('renders the daily tab', () => {
    const { getByTestId } = render(<MedicationAdherence />);
    expect(getByTestId('tab-daily')).toBeTruthy();
  });

  it('renders the weekly tab', () => {
    const { getByTestId } = render(<MedicationAdherence />);
    expect(getByTestId('tab-weekly')).toBeTruthy();
  });

  it('renders the monthly tab', () => {
    const { getByTestId } = render(<MedicationAdherence />);
    expect(getByTestId('tab-monthly')).toBeTruthy();
  });
});
