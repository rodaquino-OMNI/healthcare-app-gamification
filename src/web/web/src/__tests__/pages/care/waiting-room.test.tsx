import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/CareLayout', () => ({
    CareLayout: ({ children }: any) => <div data-testid="care-layout">{children}</div>,
}));

jest.mock('src/web/web/src/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: any) => <h1 data-testid="journey-header">{title}</h1>,
}));

jest.mock('src/web/design-system/src/components/Card/Card', () => ({
    Card: ({ children, ...props }: any) => (
        <div data-testid="card" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
    Button: ({ children, onPress, disabled, accessibilityLabel }: any) => (
        <button onClick={onPress} disabled={disabled} aria-label={accessibilityLabel} data-testid="care-button">
            {children}
        </button>
    ),
}));

jest.mock('src/web/design-system/src/primitives/Text/Text', () => ({
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('src/web/design-system/src/primitives/Box/Box', () => ({
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        journeys: { care: { primary: '#2e7cf6', text: '#1e3a5f' } },
        gray: { 50: '#888' },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
    },
}));

import WaitingRoomPage from '../../../pages/care/appointments/waiting-room';

describe('Waiting Room Page', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders without crashing', () => {
        const { container } = render(<WaitingRoomPage />);
        expect(container).toBeTruthy();
    });

    it('renders the care layout', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByTestId('care-layout')).toBeTruthy();
    });

    it('renders the sala de espera title', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/sala de espera/i)).toBeTruthy();
    });

    it('renders doctor name', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/dra. ana silva/i)).toBeTruthy();
    });

    it('renders the queue position section', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/posicao na fila/i)).toBeTruthy();
    });

    it('renders equipment checks', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/conexao de internet/i)).toBeTruthy();
        expect(screen.getByText(/microfone/i)).toBeTruthy();
    });

    it('renders status indicators with role=status', () => {
        render(<WaitingRoomPage />);
        const statusEls = screen.getAllByRole('status');
        expect(statusEls.length).toBeGreaterThan(0);
    });

    it('renders wait tips section', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/enquanto aguarda/i)).toBeTruthy();
    });

    it('renders cancel button', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/cancelar/i)).toBeTruthy();
    });

    it('entry button is initially disabled', () => {
        render(<WaitingRoomPage />);
        const waitingButton = screen.getByRole('button', { name: /aguardando sua vez/i });
        expect(waitingButton).toBeDisabled();
    });
});
