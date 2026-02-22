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

jest.mock('../../constants/routes', () => ({
  ROUTES: {
    HEALTH_MEDICATION_DETAIL: 'HealthMedicationDetail',
    HEALTH_MEDICATION_ADD: 'HealthMedicationAdd',
  },
}));

jest.mock('@austa/design-system/src/primitives/Box/Box', () => ({
  Box: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('@austa/design-system/src/primitives/Text/Text', () => ({
  Text: ({ children, ...props }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText>{children}</RNText>;
  },
}));

jest.mock('@austa/design-system/src/primitives/Touchable/Touchable', () => ({
  Touchable: ({ children, ...props }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID={props.testID} style={props.style} onPress={props.onPress}>
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
  Button: ({ children }: any) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('@austa/design-system/src/components/Badge/Badge', () => ({
  Badge: ({ children }: any) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('@austa/design-system/src/components/Input/Input', () => {
  return (props: any) => {
    const { View } = require('react-native');
    return <View testID={props.testID || 'mock-input'} />;
  };
});

jest.mock('@austa/design-system/src/tokens/colors', () => ({
  colors: {
    semantic: { success: '#0f0', warning: '#fa0' },
    neutral: { gray500: '#888', gray600: '#666', gray300: '#ccc', white: '#fff', black: '#000' },
    journeys: { health: { primary: '#0f0', background: '#e8ffe8' } },
  },
}));

jest.mock('@austa/design-system/src/tokens/spacing', () => ({
  spacingValues: { xs: 4, sm: 8, md: 16, '3xs': 2, '3xl': 48, '5xl': 80 },
}));

import MedicationList from '../MedicationList';

describe('MedicationList', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<MedicationList />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders the medication search input', () => {
    const { getByTestId } = render(<MedicationList />);
    expect(getByTestId('medication-search-input')).toBeTruthy();
  });

  it('renders the active tab', () => {
    const { getByTestId } = render(<MedicationList />);
    expect(getByTestId('tab-active')).toBeTruthy();
  });

  it('renders the add medication FAB', () => {
    const { getByTestId } = render(<MedicationList />);
    expect(getByTestId('fab-add-medication')).toBeTruthy();
  });
});
