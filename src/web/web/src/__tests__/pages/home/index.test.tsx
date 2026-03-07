import React from 'react';
import { render, screen } from '@testing-library/react';

const mockRouter = { push: jest.fn(), back: jest.fn(), pathname: '/home', query: {}, asPath: '/home' };

jest.mock('src/web/web/src/components/index', () => ({
    JourneyCard: ({ children }: any) => <div data-testid="journey-card">{children}</div>,
    useAuth: () => ({ isAuthenticated: true }),
    useHealthMetrics: () => ({ metrics: [] }),
    useAppointments: () => ({ appointments: [] }),
    useClaims: () => ({ claims: [] }),
    useGamification: () => ({ gameProfile: null }),
    useJourney: () => ({ journey: 'health' }),
    MainLayout: ({ children }: any) => <div data-testid="main-layout">{children}</div>,
    MetricsWidget: () => <div data-testid="metrics-widget" />,
    AppointmentsWidget: () => <div data-testid="appointments-widget" />,
    ClaimsWidget: () => <div data-testid="claims-widget" />,
    RecentActivityWidget: () => <div data-testid="recent-activity-widget" />,
    AchievementsWidget: () => <div data-testid="achievements-widget" />,
}));

jest.mock('src/web/design-system/src/tokens/colors', () => ({
    colors: {
        journeys: {
            health: { primary: '#1a9e6a', background: '#e8f7f0' },
            care: { primary: '#2e7cf6', background: '#e8f0fe' },
            plan: { primary: '#7c4dff', background: '#ede7f6' },
            community: { primary: '#f59e0b', background: '#fffbeb', secondary: '#d97706' },
        },
        neutral: { gray900: '#111827', gray600: '#4b5563', gray100: '#f3f4f6', gray700: '#374151' },
        brand: { primary: '#0066cc' },
    },
}));

jest.mock('src/web/design-system/src/tokens/spacing', () => ({
    spacing: { xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '4xs': '2px' },
}));

jest.mock('src/web/design-system/src/tokens/typography', () => ({
    typography: {
        fontFamily: { heading: 'sans-serif', body: 'sans-serif' },
        fontSize: {
            'heading-xl': '1.75rem',
            'heading-md': '1.25rem',
            'heading-sm': '1.1rem',
            'text-md': '1rem',
            'text-sm': '0.875rem',
            'text-xs': '0.75rem',
        },
        fontWeight: { bold: 700, semiBold: 600, medium: 500 },
    },
}));

jest.mock('src/web/design-system/src/tokens/borderRadius', () => ({
    borderRadius: { md: '8px' },
}));

jest.mock('src/web/design-system/src/tokens/shadows', () => ({
    shadows: { sm: '0 1px 3px rgba(0,0,0,0.1)' },
}));

import Home from '../../../pages/home/index';

describe('Home Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        const { container } = render(<Home />);
        expect(container).toBeTruthy();
    });

    it('renders the main layout', () => {
        render(<Home />);
        expect(screen.getByTestId('main-layout')).toBeTruthy();
    });

    it('renders the welcome heading', () => {
        render(<Home />);
        expect(screen.getByText(/bem-vindo de volta/i)).toBeTruthy();
    });

    it('renders the journeys section title', () => {
        render(<Home />);
        expect(screen.getByText(/suas jornadas/i)).toBeTruthy();
    });

    it('renders journey card for health', () => {
        render(<Home />);
        expect(screen.getByText(/minha saude/i)).toBeTruthy();
    });

    it('renders journey card for care', () => {
        render(<Home />);
        expect(screen.getByText(/cuidado agora/i)).toBeTruthy();
    });

    it('renders journey card for plan', () => {
        render(<Home />);
        expect(screen.getByText(/meu plano/i)).toBeTruthy();
    });

    it('renders metrics widget', () => {
        render(<Home />);
        expect(screen.getByTestId('metrics-widget')).toBeTruthy();
    });

    it('renders appointments widget', () => {
        render(<Home />);
        expect(screen.getByTestId('appointments-widget')).toBeTruthy();
    });

    it('renders quick actions section', () => {
        render(<Home />);
        expect(screen.getByText(/acoes rapidas/i)).toBeTruthy();
    });
});
