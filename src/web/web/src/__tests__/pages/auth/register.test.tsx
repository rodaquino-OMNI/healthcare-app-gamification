import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        register: jest.fn(),
        isLoading: false,
        error: null,
    }),
}));

jest.mock('@/layouts/AuthLayout', () => ({
    AuthLayout: function AuthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="auth-layout">{children}</div>;
    },
}));

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

jest.mock('design-system/components/Button', () => ({
    Button: ({ children, onPress, disabled, loading }: MockButtonProps) => (
        <button onClick={onPress} disabled={disabled || loading} data-testid="submit-button">
            {children}
        </button>
    ),
}));

interface MockInputProps {
    placeholder?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
    type?: string;
    'aria-label'?: string;
    label?: string;
    error?: string;
}

jest.mock('design-system/components/Input', () => {
    const MockInput = ({
        placeholder,
        onChange,
        value,
        type,
        'aria-label': ariaLabel,
        label,
        error,
    }: MockInputProps) => (
        <div>
            {label && <label>{label}</label>}
            <input
                type={type || 'text'}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                aria-label={ariaLabel}
            />
            {error && <span role="alert">{error}</span>}
        </div>
    );
    MockInput.displayName = 'Input';
    return {
        Input: MockInput,
    };
});

interface MockBoxProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

jest.mock('design-system/primitives/Box/Box', () => ({
    Box: ({ children, ...props }: MockBoxProps) => <div {...props}>{children}</div>,
}));

interface MockTextProps {
    children?: React.ReactNode;
    as?: React.ElementType;
    [key: string]: unknown;
}

jest.mock('design-system/primitives/Text/Text', () => ({
    Text: ({ children, as: Tag = 'span', ...props }: MockTextProps) => {
        const Component = Tag;
        return <Component {...props}>{children}</Component>;
    },
}));

jest.mock('shared/constants/routes', () => ({
    WEB_AUTH_ROUTES: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
    },
}));

jest.mock('@hookform/resolvers/yup', () => ({
    yupResolver: () => jest.fn(),
}));

import Register from '../../../pages/auth/register';

describe('Register Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<Register />);
        expect(container).toBeTruthy();
    });

    it('renders the auth layout wrapper', () => {
        render(<Register />);
        expect(screen.getByTestId('auth-layout')).toBeTruthy();
    });

    it('renders the create account heading', () => {
        render(<Register />);
        expect(screen.getByText(/criar nova conta/i)).toBeTruthy();
    });

    it('renders name input field', () => {
        render(<Register />);
        expect(screen.getByLabelText(/nome/i)).toBeTruthy();
    });

    it('renders email input field', () => {
        render(<Register />);
        expect(screen.getByLabelText(/e-mail/i)).toBeTruthy();
    });

    it('renders password input field', () => {
        render(<Register />);
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it('renders the submit button', () => {
        render(<Register />);
        expect(screen.getByTestId('submit-button')).toBeTruthy();
    });

    it('renders login link text', () => {
        render(<Register />);
        expect(screen.getByText(/já tem uma conta/i)).toBeTruthy();
    });
});
