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

jest.mock('@austa/design-system', () => ({
  Input: (props: any) => {
    const { View } = require('react-native');
    return <View testID={props.testID || 'mock-input'} />;
  },
  Button: ({ children, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={props.testID || 'mock-button'}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
  Text: ({ children, ...props }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={props.testID}>{children}</RNText>;
  },
}));

jest.mock('@austa/design-system/src/components/Stepper/Stepper', () => ({
  Stepper: () => {
    const { View } = require('react-native');
    return <View testID="mock-stepper" />;
  },
}));

jest.mock('../../../../constants/routes', () => ({
  ROUTES: {
    CARE_SYMPTOM_BODY_MAP: 'CareSymptomBodyMap',
    CARE_APPOINTMENT_BOOKING: 'CareAppointmentBooking',
  },
}));

jest.mock('../../../../api/care', () => ({
  checkSymptoms: jest.fn(),
}));

jest.mock('../../../../hooks/useJourney', () => ({
  useJourney: () => ({ journey: 'care' }),
}));

jest.mock('@austa/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { error: '#f00' },
    journeys: { care: { background: '#fff3e0' } },
  },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
  spacingValues: { md: 16, xl: 32, '3xl': 48 },
}));

import SymptomChecker from '../SymptomChecker';

describe('SymptomChecker', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SymptomChecker />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the symptom checker title', () => {
    const { getByTestId } = render(<SymptomChecker />);
    expect(getByTestId('symptom-checker-title')).toBeTruthy();
  });

  it('renders the symptom input field', () => {
    const { getByTestId } = render(<SymptomChecker />);
    expect(getByTestId('symptom-input')).toBeTruthy();
  });

  it('renders the continue button', () => {
    const { getByTestId } = render(<SymptomChecker />);
    expect(getByTestId('continue-button')).toBeTruthy();
  });
});
