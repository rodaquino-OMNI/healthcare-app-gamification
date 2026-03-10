import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyPage from './privacy';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/profile/privacy',
    asPath: '/profile/privacy',
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

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ session: { userId: 'test-user' } }),
}));

jest.mock('@/api/client', () => ({
  restClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

jest.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('PrivacyPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<PrivacyPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<PrivacyPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
