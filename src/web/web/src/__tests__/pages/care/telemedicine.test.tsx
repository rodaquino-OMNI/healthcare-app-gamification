import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/web/web/src/layouts/CareLayout', () => ({
  CareLayout: ({ children }: any) => <div data-testid="care-layout">{children}</div>,
}));

// The telemedicine index is empty (1 line), test the chat page instead
jest.mock('src/web/design-system/src/components/Card/Card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));

jest.mock('src/web/design-system/src/components/Button/Button', () => ({
  Button: ({ children, onPress, disabled, accessibilityLabel }: any) => (
    <button onClick={onPress} disabled={disabled} aria-label={accessibilityLabel}>
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
    xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px',
  },
}));

jest.mock('src/web/web/src/components/shared/JourneyHeader', () => ({
  JourneyHeader: ({ title }: any) => <h1>{title}</h1>,
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
