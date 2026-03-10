import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './login';

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

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('shared/utils/validation', () => ({
  loginValidationSchema: {},
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: jest.fn(), isLoading: false, error: null }),
}));

jest.mock('@/layouts/AuthLayout', () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-layout">{children}</div>,
}));

describe('Login', () => {
  it('renders without crashing', () => {
    const { container } = render(<Login />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<Login />);
    expect(container.firstChild).toBeTruthy();
  });
});
