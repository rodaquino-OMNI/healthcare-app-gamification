import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentBookingPage from './book';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/care/appointments/book',
    asPath: '/care/appointments/book',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/layouts/CareLayout', () => ({
  CareLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="care-layout">{children}</div>,
}));

describe('AppointmentBookingPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<AppointmentBookingPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<AppointmentBookingPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
