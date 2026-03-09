import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

interface MockChildrenProps {
    children: React.ReactNode;
}

interface MockTitleProps {
    title: string;
}

interface MockCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
}

interface MockButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: string;
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
    Card: ({ children, onPress, accessibilityLabel }: MockCardProps) => (
        <div
            data-testid="card"
            onClick={onPress}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && onPress) {
                    onPress();
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={accessibilityLabel}
        >
            {children}
        </div>
    ),
}));

jest.mock('design-system/components/Button/Button', () => ({
    Button: ({ children, onPress, variant }: MockButtonProps) => (
        <button onClick={onPress} data-variant={variant}>
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
        journeys: {
            care: { primary: '#2e7cf6', background: '#e8f0fe', text: '#1e3a5f' },
        },
        neutral: { gray300: '#d1d5db' },
    },
}));

jest.mock('design-system/tokens/spacing', () => ({
    spacing: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px' },
}));

jest.mock('shared/constants/routes', () => ({
    WEB_CARE_ROUTES: {
        DOCTOR_FILTERS: '/care/appointments/filters',
    },
}));

import DoctorSearchPage from '../../../pages/care/appointments/search';

describe('Doctor Search Page', () => {
    it('renders without crashing', () => {
        const { container } = render(<DoctorSearchPage />);
        expect(container).toBeTruthy();
    });

    it('renders the care layout', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByTestId('care-layout')).toBeTruthy();
    });

    it('renders the journey header with correct title', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/buscar medico/i)).toBeTruthy();
    });

    it('renders the search input', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByLabelText(/buscar medico/i)).toBeTruthy();
    });

    it('renders specialty filter buttons', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/cardiologia/i)).toBeTruthy();
        expect(screen.getByText(/dermatologia/i)).toBeTruthy();
    });

    it('renders doctor results', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/dra. ana silva/i)).toBeTruthy();
        expect(screen.getByText(/dr. carlos santos/i)).toBeTruthy();
    });

    it('renders result count', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/resultado/i)).toBeTruthy();
    });

    it('filters results on search query change', () => {
        render(<DoctorSearchPage />);
        const searchInput = screen.getByLabelText(/buscar medico/i);
        fireEvent.change(searchInput, { target: { value: 'Ana' } });
        expect(screen.getByText(/dra. ana silva/i)).toBeTruthy();
    });

    it('renders filters button', () => {
        render(<DoctorSearchPage />);
        expect(screen.getByText(/filtros/i)).toBeTruthy();
    });
});
