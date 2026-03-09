import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        logout: jest.fn(),
        session: { accessToken: 'mock-token' },
    }),
}));

jest.mock('@/context/AuthContext', () => ({
    AuthContext: React.createContext({ session: { accessToken: 'mock-token' } }),
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: { title: string }) => <h1 data-testid="journey-header">{title}</h1>,
}));

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({
        children,
        onPress,
        disabled,
    }: {
        children: React.ReactNode;
        onPress?: () => void;
        disabled?: boolean;
    }) => (
        <button onClick={onPress} disabled={disabled} data-testid="settings-button">
            {children}
        </button>
    ),
}));

jest.mock('design-system/components/Input/Input', () => ({
    Input: ({
        label,
        value,
        onChange,
        disabled,
        'aria-label': ariaLabel,
    }: {
        label?: string;
        value?: string;
        onChange?: React.ChangeEventHandler;
        disabled?: boolean;
        'aria-label'?: string;
    }) => (
        <div>
            {label && <label>{label}</label>}
            <input value={value} onChange={onChange} disabled={disabled} aria-label={ariaLabel} />
        </div>
    ),
}));

jest.mock('shared/constants/routes', () => ({
    WEB_AUTH_ROUTES: { LOGIN: '/auth/login' },
}));

import Settings from '../../../pages/profile/settings';

describe('Settings Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<Settings />);
        expect(container).toBeTruthy();
    });

    it('renders the journey header with Configurações', () => {
        render(<Settings />);
        expect(screen.getByText(/configura/i)).toBeTruthy();
    });

    it('renders nome input', () => {
        render(<Settings />);
        expect(screen.getByLabelText(/nome/i)).toBeTruthy();
    });

    it('renders email input', () => {
        render(<Settings />);
        expect(screen.getByLabelText(/email/i)).toBeTruthy();
    });

    it('renders telefone input', () => {
        render(<Settings />);
        expect(screen.getByLabelText(/telefone/i)).toBeTruthy();
    });

    it('renders save button', () => {
        render(<Settings />);
        expect(screen.getByText(/salvar/i)).toBeTruthy();
    });

    it('renders change password button', () => {
        render(<Settings />);
        expect(screen.getByText(/alterar senha/i)).toBeTruthy();
    });

    it('renders notifications button', () => {
        render(<Settings />);
        expect(screen.getByText(/notificações/i)).toBeTruthy();
    });

    it('renders logout button', () => {
        render(<Settings />);
        expect(screen.getByText(/sair/i)).toBeTruthy();
    });
});
