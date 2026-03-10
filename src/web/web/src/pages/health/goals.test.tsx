import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthGoalsPage from './goals';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/health/goals',
    asPath: '/health/goals',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@apollo/client', () => ({
  useQuery: () => ({ loading: false, error: null, data: null }),
  useMutation: () => [jest.fn(), { loading: false }],
  gql: (s: TemplateStringsArray) => s,
}));

jest.mock('shared/graphql/queries/health.queries', () => ({
  GET_HEALTH_GOALS: 'mock-query',
}));

jest.mock('shared/graphql/mutations/health.mutations', () => ({
  CREATE_HEALTH_GOAL: 'mock-mutation',
  UPDATE_HEALTH_GOAL: 'mock-mutation',
  DELETE_HEALTH_GOAL: 'mock-mutation',
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

describe('HealthGoalsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<HealthGoalsPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<HealthGoalsPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
