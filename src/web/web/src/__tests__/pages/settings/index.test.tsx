import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        logout: jest.fn(),
        session: { accessToken: 'mock-token' },
    }),
}));

jest.mock('@/context/AuthContext', () => ({
    AuthContext: require('react').createContext({ session: { accessToken: 'mock-token' } }),
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: { title: string }) => <h1 data-testid="journey-header">{title}</h1>,
}));

// Single combined mock for all design-system component paths.
// All these paths resolve to the same module via moduleNameMapper, so only
// one jest.mock registration is needed — multiple calls overwrite each other.
jest.mock('design-system/components/Button/Button', () => {
    const React = require('react');
    return {
        Button: ({
            children,
            onPress,
            disabled,
        }: {
            children: React.ReactNode;
            onPress?: () => void;
            disabled?: boolean;
        }) => React.createElement('button', { onClick: onPress, disabled, 'data-testid': 'settings-button' }, children),
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
        }) =>
            React.createElement(
                'div',
                null,
                label ? React.createElement('label', null, label) : null,
                React.createElement('input', { value, onChange, disabled, 'aria-label': ariaLabel })
            ),
    };
});

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
