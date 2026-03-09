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

// The telemedicine index is empty (1 line), test the chat page instead
jest.mock('design-system/components/Card/Card', () => ({
    Card: ({ children }: MockChildrenProps) => <div data-testid="card">{children}</div>,
}));

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, onPress, disabled, accessibilityLabel }: MockButtonProps) => (
        <button onClick={onPress} disabled={disabled} aria-label={accessibilityLabel}>
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

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: MockTitleProps) => <h1>{title}</h1>,
}));

// Test the waiting room page since the telemedicine index is empty
import WaitingRoomPage from '../../../pages/care/appointments/waiting-room';

describe('Waiting Room Page (Telemedicine pre-consultation)', () => {
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

    it('renders the waiting room header', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/sala de espera/i)).toBeTruthy();
    });

    it('renders equipment check section', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/verificacao de equipamentos/i)).toBeTruthy();
    });

    it('renders internet connection check', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/conexao de internet/i)).toBeTruthy();
    });

    it('renders camera check', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/camera/i)).toBeTruthy();
    });

    it('renders microphone check', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/microfone/i)).toBeTruthy();
    });

    it('renders queue position info', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/posicao na fila/i)).toBeTruthy();
    });

    it('renders cancel button', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/cancelar/i)).toBeTruthy();
    });

    it('renders tips while waiting section', () => {
        render(<WaitingRoomPage />);
        expect(screen.getByText(/enquanto aguarda/i)).toBeTruthy();
    });
});
