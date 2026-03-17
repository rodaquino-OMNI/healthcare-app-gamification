import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import ForgotPasswordPage from '../../../pages/auth/forgot-password';

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

jest.mock('@/layouts/AuthLayout', () => ({
    AuthLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-layout">{children}</div>,
}));

describe('ForgotPasswordPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<ForgotPasswordPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<ForgotPasswordPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
