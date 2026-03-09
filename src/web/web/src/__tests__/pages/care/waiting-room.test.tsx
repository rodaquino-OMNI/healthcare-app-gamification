import { render, screen } from '@testing-library/react';
import React from 'react';

interface MockChildrenProps {
    children: React.ReactNode;
}

interface MockTitleProps {
    title: string;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
}

interface MockSpreadProps {
    children?: React.ReactNode;
    [key: string]: unknown;
}

jest.mock('@/layouts/CareLayout', () => ({
    CareLayout: ({ children }: MockChildrenProps) => <div data-testid="care-layout">{children}</div>,
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: MockTitleProps) => <h1 data-testid="journey-header">{title}</h1>,
}));

jest.mock('design-system/components/Card/Card', () => ({
    Card: ({ children, ...props }: MockSpreadProps) => (
        <div data-testid="card" {...props}>
            {children}
        </div>
    ),
}));

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, onPress, disabled, accessibilityLabel }: MockButtonProps) => (
        <button onClick={onPress} disabled={disabled} aria-label={accessibilityLabel} data-testid="care-button">
            {children}
        </button>
    ),
}));

jest.mock('design-system/primitives/Text/Text', () => ({
    Text: ({ children, ...props }: MockSpreadProps) => <span {...props}>{children}</span>,
}));

jest.mock('design-system/primitives/Box/Box', () => ({
    Box: ({ children, ...props }: MockSpreadProps) => <div {...props}>{children}</div>,
}));

jest.mock('design-system/tokens/colors', () => ({
    colors: {
        journeys: { care: { primary: '#2e7cf6', text: '#1e3a5f' } },
        gray: { 50: '#888' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
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
