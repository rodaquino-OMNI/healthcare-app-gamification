import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import QuestsPage from '../../../pages/achievements/quests';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/achievements/quests',
        asPath: '/achievements/quests',
        isReady: true,
    }),
}));

jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>;
});

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('QuestsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<QuestsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<QuestsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
