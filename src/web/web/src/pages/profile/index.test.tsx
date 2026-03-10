import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from './index';

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
  useAuth: () => ({
    isLoading: false,
    isAuthenticated: true,
    error: null,
    session: { userId: 'test-user', accessToken: 'token' },
  }),
}));

jest.mock('@/api/client', () => ({
  restClient: { delete: jest.fn(), get: jest.fn(), put: jest.fn() },
}));

jest.mock('@/components/forms/ProfileForm', () => ({
  ProfileForm: () => <div data-testid="profile-form">ProfileForm</div>,
}));

jest.mock('@/components/modals/ConfirmationModal', () => ({
  ConfirmationModal: () => null,
}));

jest.mock('@/components/shared/EmptyState', () => ({
  EmptyState: () => <div>Empty</div>,
}));

jest.mock('@/components/shared/ErrorState', () => ({
  ErrorState: () => <div>Error</div>,
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
  JourneyHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('@/components/shared/LoadingIndicator', () => ({
  LoadingIndicator: () => <div>Loading...</div>,
}));

jest.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('ProfilePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProfilePage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<ProfilePage />);
    expect(container.firstChild).toBeTruthy();
  });
});
