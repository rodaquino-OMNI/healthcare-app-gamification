import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import SimulatorPage from '../../../pages/plan/simulator';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/plan/simulator',
        asPath: '/plan/simulator',
        isReady: true,
    }),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        refresh: jest.fn(),
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('@/layouts/PlanLayout', () => {
    return function MockPlanLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="plan-layout">{children}</div>;
    };
});

describe('SimulatorPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<SimulatorPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<SimulatorPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
