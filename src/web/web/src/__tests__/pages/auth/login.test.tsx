import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('src/web/web/src/hooks/useAuth', () => ({
    useAuth: () => ({
        login: jest.fn(),
        isLoading: false,
        error: null,
    }),
}));

jest.mock('src/web/web/src/layouts/AuthLayout', () => {
    return function AuthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="auth-layout">{children}</div>;
    };
});

jest.mock('src/web/shared/utils/validation', () => ({
    loginValidationSchema: {
        parseAsync: jest.fn(),
    },
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
    Button: ({ children, onPress, disabled, loading }: any) => (
        <button onClick={onPress} disabled={disabled || loading} data-testid="button">
            {loading ? 'Loading...' : children}
        </button>
    ),
}));

jest.mock('src/web/design-system/src/components/Input/Input', () => ({
    Input: ({ placeholder, onChange, value, type, 'aria-label': ariaLabel }: any) => (
        <input
            type={type || 'text'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={ariaLabel}
        />
    ),
}));

jest.mock('src/web/design-system/src/primitives/Box/Box', () => ({
    default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
    default: ({ children, as: Tag = 'span', ...props }: any) => <Tag {...props}>{children}</Tag>,
}));

jest.mock('src/web/shared/constants/routes', () => ({
    WEB_AUTH_ROUTES: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
    },
}));

jest.mock('@hookform/resolvers/zod', () => ({
    zodResolver: () => jest.fn(),
}));

import Login from '../../../pages/auth/login';

describe('Login Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<Login />);
        expect(container).toBeTruthy();
    });

    it('renders the auth layout wrapper', () => {
        render(<Login />);
        expect(screen.getByTestId('auth-layout')).toBeTruthy();
    });

    it('renders email input field', () => {
        render(<Login />);
        expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy();
    });

    it('renders password input field', () => {
        render(<Login />);
        const passwordInput = document.querySelector('input[type="password"]');
        expect(passwordInput).toBeTruthy();
    });

    it('renders the sign in button', () => {
        render(<Login />);
        expect(screen.getByTestId('button')).toBeTruthy();
    });

    it('renders the register link text', () => {
        render(<Login />);
        expect(screen.getByText(/register/i)).toBeTruthy();
    });

    it('renders sign in heading', () => {
        render(<Login />);
        expect(screen.getByText(/sign in to austa/i)).toBeTruthy();
    });
});
