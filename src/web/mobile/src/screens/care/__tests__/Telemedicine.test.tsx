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
    t: (key: string, params?: any) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

jest.mock('src/web/mobile/src/hooks/useTelemedicine.ts', () => ({
  useTelemedicineSession: () => ({
    session: null,
    loading: false,
    error: null,
    createSession: jest.fn(),
  }),
}));

jest.mock('src/web/mobile/src/components/shared/JourneyHeader.tsx', () => ({
  JourneyHeader: ({ title }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="mock-journey-header">
        <Text>{title}</Text>
      </View>
    );
  },
}));

jest.mock('src/web/design-system/src/components/Button/Button.tsx', () => ({
  Button: ({ children, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={props.testID || 'mock-button'} onPress={props.onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('src/web/shared/constants/routes.ts', () => ({
  MOBILE_CARE_ROUTES: {},
}));

jest.mock('src/web/mobile/src/components/shared/LoadingIndicator.tsx', () => {
  return () => null;
});

jest.mock('src/web/mobile/src/components/shared/ErrorState.tsx', () => {
  return () => null;
});

import { Telemedicine } from '../Telemedicine';

describe('Telemedicine', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<Telemedicine />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the journey header', () => {
    const { getByTestId } = render(<Telemedicine />);
    expect(getByTestId('mock-journey-header')).toBeTruthy();
  });

  it('shows start session button when no session exists', () => {
    const { getByText } = render(<Telemedicine />);
    expect(getByText('journeys.care.telemedicine.startSession')).toBeTruthy();
  });
});
