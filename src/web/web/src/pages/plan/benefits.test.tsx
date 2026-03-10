import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import BenefitsPage from './benefits';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/plan/benefits',
    asPath: '/plan/benefits',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('../../hooks/useJourney', () => ({
  useJourney: () => ({ setJourney: jest.fn(), journey: 'plan' }),
}));

jest.mock('../../layouts/PlanLayout', () => {
  return function MockPlanLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="plan-layout">{children}</div>;
  };
});

describe('BenefitsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<BenefitsPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<BenefitsPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
