import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentsPage from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/care/appointments',
    asPath: '/care/appointments',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useJourney', () => ({
  useJourney: () => ({ setJourney: jest.fn(), journey: 'care' }),
}));

jest.mock('@/layouts/CareLayout', () => ({
  CareLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="care-layout">{children}</div>,
}));

describe('AppointmentsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<AppointmentsPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<AppointmentsPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
