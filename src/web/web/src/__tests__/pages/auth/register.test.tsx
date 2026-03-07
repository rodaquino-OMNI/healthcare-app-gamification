import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        register: jest.fn(),
        isLoading: false,
        error: null,
    }),
}));

jest.mock('@/layouts/AuthLayout', () => {
    return function AuthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="auth-layout">{children}</div>;
    };
});

jest.mock('design-system/components/Button', () => ({
    Button: ({ children, onPress, disabled, loading }: any) => (
        <button onClick={onPress} disabled={disabled || loading} data-testid="submit-button">
            {children}
        </button>
    ),
}));

jest.mock('design-system/components/Input', () => {
    const MockInput = ({ placeholder, onChange, value, type, 'aria-label': ariaLabel, label, error }: any) => (
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
        default: MockInput,
    };
});

jest.mock('design-system/primitives/Box/Box', () => ({
    default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('design-system/primitives/Text/Text', () => ({
    default: ({ children, as: Tag = 'span', ...props }: any) => <Tag {...props}>{children}</Tag>,
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
