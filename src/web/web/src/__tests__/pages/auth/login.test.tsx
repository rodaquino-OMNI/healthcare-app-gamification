import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        login: jest.fn(),
        isLoading: false,
        error: null,
    }),
}));

jest.mock('@/layouts/AuthLayout', () => {
    return function AuthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="auth-layout">{children}</div>;
    };
});

jest.mock('shared/utils/validation', () => ({
    loginValidationSchema: {
        parseAsync: jest.fn(),
    },
}));

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, onPress, disabled, loading }: MockButtonProps) => (
        <button onClick={onPress} disabled={disabled || loading} data-testid="button">
            {loading ? 'Loading...' : children}
        </button>
    ),
}));

interface MockInputProps {
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
    type?: string;
    'aria-label'?: string;
}

jest.mock('design-system/components/Input/Input', () => ({
    Input: ({ placeholder, onChange, value, type, 'aria-label': ariaLabel }: MockInputProps) => (
        <input
            type={type || 'text'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            aria-label={ariaLabel}
        />
    ),
}));

interface MockBoxProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

jest.mock('design-system/primitives/Box/Box', () => ({
    default: ({ children, ...props }: MockBoxProps) => <div {...props}>{children}</div>,
}));

interface MockTextProps {
    children?: React.ReactNode;
    as?: React.ElementType;
    [key: string]: unknown;
}

jest.mock('design-system/primitives/Text/Text', () => ({
    default: ({ children, as: Tag = 'span', ...props }: MockTextProps) => {
        const Component = Tag;
        return <Component {...props}>{children}</Component>;
    },
}));

jest.mock('shared/constants/routes', () => ({
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
