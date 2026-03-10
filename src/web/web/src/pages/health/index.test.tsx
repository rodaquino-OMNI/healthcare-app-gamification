import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthJourneyIndex from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/health',
    asPath: '/health',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('shared/constants/journeys', () => ({
  JOURNEY_IDS: { HEALTH: 'health' },
}));

jest.mock('../../hooks/useJourney', () => ({
  useJourney: () => ({ setJourney: jest.fn() }),
}));

jest.mock('../../layouts/HealthLayout', () => {
  return function MockHealthLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="health-layout">{children}</div>;
  };
});

describe('HealthJourneyIndex', () => {
  it('renders without crashing', () => {
    const { container } = render(<HealthJourneyIndex />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<HealthJourneyIndex />);
    expect(container.firstChild).toBeTruthy();
  });
});
