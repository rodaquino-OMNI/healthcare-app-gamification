import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoodCheckInPage from './mood';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/wellness/mood',
    asPath: '/wellness/mood',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('MoodCheckInPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<MoodCheckInPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<MoodCheckInPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
