import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RewardsPage from './rewards';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/achievements/rewards',
    asPath: '/achievements/rewards',
    isReady: true,
  }),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useGamification', () => ({
  useGameProfile: () => ({
    data: { gameProfile: { xp: 3000 } },
    loading: false,
    error: null,
  }),
}));

describe('RewardsPage', () => {
  it('renders without crashing', () => {
    const { container } = render(<RewardsPage />);
    expect(container).toBeTruthy();
  });

  it('renders content in the document', () => {
    const { container } = render(<RewardsPage />);
    expect(container.firstChild).toBeTruthy();
  });
});
