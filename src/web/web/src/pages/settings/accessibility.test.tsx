import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccessibilityPage from './accessibility';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/settings/accessibility',
    asPath: '/settings/accessibility',
    isReady: true,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('../../api/settings', () => ({
  saveAccessibility: jest.fn().mockResolvedValue({}),
}));

describe('AccessibilityPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<AccessibilityPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<AccessibilityPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
