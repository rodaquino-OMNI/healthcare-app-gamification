import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Home from '../../../pages/home/index';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/home',
        asPath: '/home',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/components', () => ({
    useAuth: jest.fn(),
    useHealthMetrics: () => ({ data: [], loading: false }),
    useAppointments: () => ({ data: [], loading: false }),
    useClaims: () => ({ data: [], loading: false }),
    useGamification: () => ({ gameProfile: { level: 1, xp: 0 } }),
    useJourney: jest.fn(),
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
    MetricsWidget: () => <div>Metrics</div>,
    AppointmentsWidget: () => <div>Appointments</div>,
    ClaimsWidget: () => <div>Claims</div>,
    RecentActivityWidget: () => <div>Activity</div>,
    AchievementsWidget: () => <div>Achievements</div>,
}));

describe('Home', () => {
    it('renders without crashing', () => {
        const { container } = render(<Home />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<Home />);
        expect(container.firstChild).toBeTruthy();
    });
});
