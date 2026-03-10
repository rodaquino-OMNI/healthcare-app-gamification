import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HistoryPage from './history';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/health/history',
    asPath: '/health/history',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@apollo/client', () => ({
  useQuery: () => ({ loading: false, error: null, data: { getMedicalHistory: [] } }),
  gql: (s: TemplateStringsArray) => s,
}));

jest.mock('shared/graphql/queries/health.queries', () => ({
  GET_MEDICAL_HISTORY: 'mock-query',
}));

jest.mock('shared/utils/date', () => ({
  formatRelativeDate: (d: string) => d,
}));

jest.mock('shared/utils/format', () => ({
  truncateText: (t: string) => t,
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('@/layouts/HealthLayout', () => {
  return function MockHealthLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="health-layout">{children}</div>;
  };
});

jest.mock('styled-components', () => {
  const actual = jest.requireActual('react');
  const styled = new Proxy(
    (tag: string) => {
      return ({ children, ...props }: Record<string, unknown>) =>
        actual.createElement(tag, props, children as React.ReactNode);
    },
    {
      get: (_target: unknown, prop: string) => {
        return ({ children, ...props }: Record<string, unknown>) =>
          actual.createElement(prop, props, children as React.ReactNode);
      },
    },
  );
  return {
    __esModule: true,
    default: styled,
    ThemeProvider: ({ children }: { children: React.ReactNode }) => actual.createElement('div', null, children),
  };
});

describe('HistoryPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<HistoryPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<HistoryPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
