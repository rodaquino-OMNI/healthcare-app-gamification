import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsightsPage from './insights';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/wellness/insights',
    asPath: '/wellness/insights',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('WellnessInsightsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<InsightsPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<InsightsPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
