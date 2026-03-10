import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MFAPage from './mfa';

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

jest.mock('@/layouts/AuthLayout', () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-layout">{children}</div>,
}));

describe('MFAPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<MFAPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<MFAPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
