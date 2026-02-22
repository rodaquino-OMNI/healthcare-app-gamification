import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      symptoms: [],
      description: '',
      regions: [],
      details: [],
      answers: {},
      overallSeverity: 5,
    },
  }),
  RouteProp: {},
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
      white: '#fff', black: '#000', gray300: '#ccc', gray500: '#888', gray600: '#666', gray700: '#444',
    },
    journeys: {
      care: { primary: '#f90', background: '#fff3e0', secondary: '#fa0', text: '#333' },
    },
  },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
  spacingValues: {
    '3xs': 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '3xl': 48,
  },
}));

jest.mock('@austa/design-system/src/components/Stepper/Stepper', () => ({
  Stepper: () => {
    const { View } = require('react-native');
    return <View testID="mock-stepper" />;
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

jest.mock('@austa/design-system/src/components/Card/Card', () => ({
  Card: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('@austa/design-system/src/components/Badge/Badge', () => ({
  Badge: ({ children, testID }: any) => {
    const { Text } = require('react-native');
    return <Text testID={testID}>{children}</Text>;
  },
}));

jest.mock('@austa/design-system/src/components/ProgressBar/ProgressBar', () => ({
  ProgressBar: ({ testId }: any) => {
    const { View } = require('react-native');
    return <View testID={testId || 'mock-progress-bar'} />;
  },
}));

jest.mock('@austa/design-system/src/primitives/Text/Text', () => ({
  Text: ({ children, testID }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText testID={testID}>{children}</RNText>;
  },
}));

jest.mock('../../../../constants/routes', () => ({
  ROUTES: {
    CARE_SYMPTOM_RECOMMENDATION: 'CareSymptomRecommendation',
    CARE_SYMPTOM_CHECKER: 'CareSymptomChecker',
  },
}));

import SymptomResult from '../SymptomResult';

describe('SymptomResult', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<SymptomResult />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the result title', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('result-title')).toBeTruthy();
  });

  it('displays the risk badge', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('risk-badge')).toBeTruthy();
  });

  it('displays the conditions heading', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('conditions-heading')).toBeTruthy();
  });

  it('renders the stepper', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('mock-stepper')).toBeTruthy();
  });

  it('renders the start-over button', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('start-over-button')).toBeTruthy();
  });

  it('renders the recommendations button', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('recommendations-button')).toBeTruthy();
  });

  it('displays the first condition name', () => {
    const { getByTestId } = render(<SymptomResult />);
    expect(getByTestId('condition-name-0')).toBeTruthy();
  });
});
