import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Register from '../../../pages/auth/register';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/auth/register',
        asPath: '/auth/register',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@hookform/resolvers/yup', () => ({
    yupResolver: () => jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ register: jest.fn() }),
}));

jest.mock('@/layouts/AuthLayout', () => ({
    AuthLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-layout">{children}</div>,
}));

describe('Register', () => {
    it('renders without crashing', () => {
        const { container } = render(<Register />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<Register />);
        expect(container.firstChild).toBeTruthy();
    });
});
