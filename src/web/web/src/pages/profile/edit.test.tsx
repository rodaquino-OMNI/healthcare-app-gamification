import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileEditPage from './edit';

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

jest.mock('../../api/auth', () => ({
  getProfile: jest.fn().mockResolvedValue({
    name: 'Test User',
    email: 'test@example.com',
    phone: '11999999999',
    cpf: '12345678900',
    dob: '1990-01-01',
  }),
}));

jest.mock('../../api/client', () => ({
  restClient: { put: jest.fn().mockResolvedValue({}) },
}));

jest.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('ProfileEditPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProfileEditPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<ProfileEditPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
