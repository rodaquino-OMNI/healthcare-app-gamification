import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import LeaderboardPage from '../../../pages/achievements/leaderboard';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/achievements/leaderboard',
        asPath: '/achievements/leaderboard',
        isReady: true,
    }),
}));

jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
});

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('LeaderboardPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<LeaderboardPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<LeaderboardPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
