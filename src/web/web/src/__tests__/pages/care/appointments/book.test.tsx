import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import AppointmentBookingPage from '../../../../pages/care/appointments/book';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care/appointments/book',
        asPath: '/care/appointments/book',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/api/client', () => ({
    restClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
    graphqlClient: {},
}));

jest.mock('@/components/forms/AppointmentForm', () => ({
    AppointmentForm: () => <div data-testid="appointment-form">Form</div>,
}));

jest.mock('@/components/shared/JourneyHeader', () => ({
    JourneyHeader: ({ title }: { title: string }) => <div data-testid="journey-header">{title}</div>,
}));

jest.mock('@/layouts/CareLayout', () => ({
    CareLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="care-layout">{children}</div>,
}));

describe('AppointmentBookingPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<AppointmentBookingPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<AppointmentBookingPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
