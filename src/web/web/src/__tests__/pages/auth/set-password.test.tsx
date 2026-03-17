import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import SetPasswordPage from '../../../pages/auth/set-password';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        refresh: jest.fn(),
    }),
}));

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/auth/set-password',
        asPath: '/auth/set-password',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user' } }),
}));

jest.mock('@/layouts/AuthLayout', () => ({
    AuthLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-layout">{children}</div>,
}));

describe('SetPasswordPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<SetPasswordPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<SetPasswordPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
