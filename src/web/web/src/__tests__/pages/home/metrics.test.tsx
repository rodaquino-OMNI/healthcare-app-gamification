import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import MetricsPage from '../../../pages/home/metrics';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/home/metrics',
        asPath: '/home/metrics',
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

jest.mock('@/components/index', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
    useHealthMetrics: () => ({ data: [], loading: false }),
}));

describe('MetricsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<MetricsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<MetricsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
