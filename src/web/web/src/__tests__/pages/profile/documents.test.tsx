import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import DocumentsPage from '../../../pages/profile/documents';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/profile/documents',
        asPath: '/profile/documents',
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

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user' } }),
}));

jest.mock('@/layouts/MainLayout', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('DocumentsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<DocumentsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<DocumentsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
