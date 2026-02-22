import React from 'react';
import { render } from '@testing-library/react-native';

// Navigation mock
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  // FAQCategory uses useRoute to read the optional category param
  useRoute: () => ({ params: { category: undefined } }),
}));

// i18n mock
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pt-BR', changeLanguage: jest.fn() },
  }),
}));

// styled-components mock
jest.mock('styled-components/native', () => ({
  useTheme: () => ({
    colors: {
      background: { default: '#fff', subtle: '#f5f5f5', muted: '#eee' },
      text: { default: '#000', muted: '#888', onBrand: '#fff', subtle: '#ccc' },
      border: { default: '#ddd', muted: '#e0e0e0' },
    },
  }),
}));

// DS token mocks — exact paths used by FAQCategory.tsx
jest.mock('../../../../../design-system/src/tokens/colors', () => ({
  colors: {
    brand: { primary: '#00f' },
    semantic: { error: '#f00', success: '#0f0', warning: '#fa0' },
    neutral: { white: '#fff', black: '#000', gray900: '#111' },
    gray: { 10: '#f9f9f9', 20: '#eee', 30: '#ddd', 40: '#ccc', 50: '#aaa', 70: '#666' },
    journeys: {
      health: { primary: '#0f0', background: '#e8ffe8' },
      care: { primary: '#f90', background: '#fff3e0' },
      plan: { primary: '#90f', background: '#f3e0ff' },
    },
  },
}));
jest.mock('../../../../../design-system/src/tokens/typography', () => ({
  typography: {
    fontFamily: { body: 'System', heading: 'System', mono: 'System' },
    fontSize: { 'text-xs': '12px', 'text-sm': '14px', 'text-md': '16px', 'text-lg': '18px', 'text-2xl': '24px' },
    fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
    letterSpacing: { wide: '0.5px' },
  },
}));
jest.mock('../../../../../design-system/src/tokens/spacing', () => ({
  spacing: { '3xs': '2px', xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '40px', '4xl': '64px' },
  spacingValues: { '3xs': 2, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 40, '4xl': 64 },
}));
jest.mock('../../../../../design-system/src/tokens/borderRadius', () => ({
  borderRadius: { xs: '4px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
}));
jest.mock('../../../../../design-system/src/themes/base.theme', () => ({}));

// Routes mock
jest.mock('../../../constants/routes', () => ({
  ROUTES: {
    HELP_FAQ_CATEGORY: 'HelpFAQCategory',
    HELP_FAQ_DETAIL: 'HelpFAQDetail',
  },
}));

// SCREEN IMPORT — always after all mocks
import { FAQCategoryScreen } from '../FAQCategory';

describe('FAQCategoryScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<FAQCategoryScreen />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders the FAQ category title', () => {
    const { getByTestId } = render(<FAQCategoryScreen />);
    expect(getByTestId('faq-category-title')).toBeTruthy();
  });

  it('renders the first FAQ question', () => {
    const { getByTestId } = render(<FAQCategoryScreen />);
    expect(getByTestId('faq-question-1')).toBeTruthy();
  });

  it('renders all five FAQ questions', () => {
    const { getByTestId } = render(<FAQCategoryScreen />);
    expect(getByTestId('faq-question-1')).toBeTruthy();
    expect(getByTestId('faq-question-2')).toBeTruthy();
    expect(getByTestId('faq-question-3')).toBeTruthy();
    expect(getByTestId('faq-question-4')).toBeTruthy();
    expect(getByTestId('faq-question-5')).toBeTruthy();
  });
});
