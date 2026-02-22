import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  RouteProp: {},
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
    handleSubmit: (fn: any) => fn,
    formState: { errors: {} },
    setValue: jest.fn(),
    watch: jest.fn(),
  }),
  Controller: ({ render: renderFn, name }: any) => {
    const { View } = require('react-native');
    return <View testID={`controller-${name}`}>{renderFn({ field: { value: '', onChange: jest.fn(), onBlur: jest.fn() } })}</View>;
  },
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: () => jest.fn(),
}));

jest.mock('yup', () => ({
  object: () => ({
    shape: jest.fn().mockReturnThis(),
  }),
  string: () => ({
    required: jest.fn().mockReturnThis(),
    default: jest.fn().mockReturnThis(),
  }),
  date: () => ({
    nullable: jest.fn().mockReturnThis(),
    required: jest.fn().mockReturnThis(),
    typeError: jest.fn().mockReturnThis(),
    notRequired: jest.fn().mockReturnThis(),
  }),
  boolean: () => ({
    default: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('@austa/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    neutral: { white: '#fff', black: '#000', gray500: '#888', gray600: '#666', gray700: '#444' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8' },
      care: { primary: '#f90', background: '#fff3e0' },
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
  Touchable: ({ children, testID, onPress }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID={testID} onPress={onPress}>
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
  Button: ({ children, testID, onPress, disabled }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={testID || 'mock-button'} onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('@austa/design-system/src/components/Checkbox/Checkbox', () => ({
  Checkbox: ({ label, testID }: any) => {
    const { Text } = require('react-native');
    return <Text testID={testID}>{label}</Text>;
  },
}));

jest.mock('@austa/design-system/src/components/Input/Input', () => {
  const { View } = require('react-native');
  const MockInput = ({ testID }: any) => <View testID={testID || 'mock-input'} />;
  MockInput.displayName = 'Input';
  return MockInput;
});

jest.mock('@austa/design-system/src/components/Select/Select', () => ({
  Select: ({ label }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="mock-select">
        <Text>{label}</Text>
      </View>
    );
  },
}));

jest.mock('@austa/design-system/src/components/DatePicker/DatePicker', () => ({
  DatePicker: ({ testID }: any) => {
    const { View } = require('react-native');
    return <View testID={testID || 'mock-date-picker'} />;
  },
}));

jest.mock('../../constants/routes', () => ({
  ROUTES: {
    HEALTH_MEDICATION_SEARCH: 'HealthMedicationSearch',
    HEALTH_MEDICATION_ADD: 'HealthMedicationAdd',
  },
}));

import MedicationAdd from '../MedicationAdd';

describe('MedicationAdd', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<MedicationAdd />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders the back button', () => {
    const { getByTestId } = render(<MedicationAdd />);
    expect(getByTestId('back-button')).toBeTruthy();
  });
});
