import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MedicationRemindersPage from './medication-reminders';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/home/medication-reminders',
    asPath: '/home/medication-reminders',
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

describe('MedicationRemindersPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<MedicationRemindersPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<MedicationRemindersPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
