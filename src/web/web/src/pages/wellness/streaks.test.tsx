import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreaksPage from './streaks';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/wellness/streaks',
    asPath: '/wellness/streaks',
    isReady: true,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('StreaksPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<StreaksPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<StreaksPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
