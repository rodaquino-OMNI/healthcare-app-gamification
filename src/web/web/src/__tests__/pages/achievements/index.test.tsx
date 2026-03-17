import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import AchievementsPage from '../../../pages/achievements/index';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/achievements',
        asPath: '/achievements',
        isReady: true,
    }),
}));

jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
});

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useGamification', () => ({
    useGameProfile: () => ({
        data: { gameProfile: { level: 5, xp: 2500, achievements: [], quests: [] } },
        loading: false,
        error: null,
    }),
}));

describe('AchievementsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<AchievementsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<AchievementsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
