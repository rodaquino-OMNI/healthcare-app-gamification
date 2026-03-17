import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import PlanCardPage from '../../../pages/plan/card';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/plan/card',
        asPath: '/plan/card',
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

jest.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('../../../api/plan', () => ({
    getDigitalCard: jest.fn().mockResolvedValue({ cardNumber: '1234', planName: 'Test' }),
}));

jest.mock('../../../hooks/usePlan', () => ({
    usePlan: () => ({ plan: null, digitalCard: null, isLoading: false, error: null }),
}));

jest.mock('../../../layouts/PlanLayout', () => {
    return function MockPlanLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="plan-layout">{children}</div>;
    };
});

describe('PlanCardPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<PlanCardPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<PlanCardPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
