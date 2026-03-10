import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationSettingsPage from './settings';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/notifications/settings',
    asPath: '/notifications/settings',
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

jest.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('NotificationSettingsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotificationSettingsPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<NotificationSettingsPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
