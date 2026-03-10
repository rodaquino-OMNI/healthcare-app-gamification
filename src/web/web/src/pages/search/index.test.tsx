import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchPage from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/search',
    asPath: '/search',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/layouts/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('SearchPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<SearchPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<SearchPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
