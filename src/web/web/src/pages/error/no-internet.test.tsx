import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoInternetPage from './no-internet';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/error/no-internet',
    asPath: '/error/no-internet',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('NoInternetPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<NoInternetPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<NoInternetPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
