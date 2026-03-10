import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TelemedicinePage from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/care/telemedicine',
    asPath: '/care/telemedicine',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('TelemedicinePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<TelemedicinePage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<TelemedicinePage />);
    expect(container.firstChild).toBeTruthy();
  });
});
