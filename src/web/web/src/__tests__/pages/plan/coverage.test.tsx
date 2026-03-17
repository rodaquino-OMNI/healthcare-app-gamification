import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import CoveragePage from '../../../pages/plan/coverage';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/plan/coverage',
        asPath: '/plan/coverage',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('../../../api/client', () => ({
    restClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
    graphqlClient: {},
}));

jest.mock('../../../hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('../../../hooks/useCoverage', () => ({
    useCoverage: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('../../../components/shared/LoadingIndicator', () => ({
    LoadingIndicator: () => <div data-testid="loading">Loading</div>,
}));

jest.mock('../../../components/shared/ErrorState', () => ({
    ErrorState: () => <div data-testid="error">Error</div>,
}));

jest.mock('../../../layouts/PlanLayout', () => {
    return function MockPlanLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="plan-layout">{children}</div>;
    };
});

describe('CoveragePage', () => {
    it('renders without crashing', () => {
        const { container } = render(<CoveragePage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<CoveragePage />);
        expect(container.firstChild).toBeTruthy();
    });
});
