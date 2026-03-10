import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanDashboard from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/plan',
    asPath: '/plan',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('@/layouts/PlanLayout', () => {
  return function MockPlanLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="plan-layout">{children}</div>;
  };
});

describe('PlanDashboard', () => {
  it('renders without crashing', () => {
    const { container } = render(<PlanDashboard />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<PlanDashboard />);
    expect(container.firstChild).toBeTruthy();
  });
});
