import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/web/web/src/hooks/useAuth', () => ({
    useAuth: () => ({
        register: jest.fn(),
        isLoading: false,
        error: null,
    }),
}));

jest.mock('src/web/web/src/layouts/AuthLayout', () => {
    return function AuthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="auth-layout">{children}</div>;
    };
});

jest.mock('src/web/design-system/src/components/Button', () => ({
    Button: ({ children, onPress, disabled, loading }: any) => (
        <button onClick={onPress} disabled={disabled || loading} data-testid="submit-button">
            {children}
        </button>
    ),
}));

jest.mock('src/web/design-system/src/components/Input', () => {
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
