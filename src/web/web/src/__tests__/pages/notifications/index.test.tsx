import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import NotificationsPage from '../../../pages/notifications/index';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/notifications',
        asPath: '/notifications',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useNotifications', () => ({
    useNotifications: () => ({ notifications: [], isLoading: false }),
}));

jest.mock('@/components/shared', () => ({
    EmptyState: ({ title }: { title: string }) => <div>{title}</div>,
    LoadingIndicator: () => <div>Loading...</div>,
    JourneyHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('@/layouts/MainLayout', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('NotificationsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<NotificationsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<NotificationsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
