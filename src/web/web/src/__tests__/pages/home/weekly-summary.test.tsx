import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import WeeklySummaryPage from '../../../pages/home/weekly-summary';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/home/weekly-summary',
        asPath: '/home/weekly-summary',
        isReady: true,
    }),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        refresh: jest.fn(),
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/layouts/MainLayout', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('WeeklySummaryPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<WeeklySummaryPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<WeeklySummaryPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
