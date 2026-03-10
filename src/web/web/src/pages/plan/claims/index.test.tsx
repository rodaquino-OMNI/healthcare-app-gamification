import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Claims from './index';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/test',
    asPath: '/test',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/api/client', () => ({
  restClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
  graphqlClient: {},
}));

jest.mock('@/hooks/useClaims', () => ({
  useClaims: () => ({ data: [], isLoading: false, error: null }),
}));

describe('Claims', () => {
  it('renders without crashing', () => {
    const { container } = render(<Claims />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<Claims />);
    expect(container.firstChild).toBeTruthy();
  });
});
