import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import Devices from '../../../pages/health/devices';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/health/devices',
        asPath: '/health/devices',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('@/layouts/HealthLayout', () => {
    return function MockHealthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="health-layout">{children}</div>;
    };
});

describe('Devices', () => {
    it('renders without crashing', () => {
        const { container } = render(<Devices />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<Devices />);
        expect(container.firstChild).toBeTruthy();
    });
});
