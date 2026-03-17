import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import AppointmentsPage from '../../../../pages/care/appointments/index';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care/appointments',
        asPath: '/care/appointments',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useJourney', () => ({
    useJourney: () => ({ setJourney: jest.fn(), journey: 'care' }),
}));

jest.mock('@/api/client', () => ({
    restClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
    graphqlClient: {},
}));

jest.mock('@/hooks/useAppointments', () => ({
    useAppointments: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('@/components/shared/LoadingIndicator', () => ({
    LoadingIndicator: () => <div data-testid="loading">Loading</div>,
}));

jest.mock('@/components/shared/EmptyState', () => ({
    EmptyState: () => <div data-testid="empty">Empty</div>,
}));

jest.mock('@/components/shared/ErrorState', () => ({
    ErrorState: () => <div data-testid="error">Error</div>,
}));

jest.mock('@/layouts/CareLayout', () => ({
    CareLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="care-layout">{children}</div>,
}));

describe('AppointmentsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<AppointmentsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<AppointmentsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
