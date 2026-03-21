import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import HistoryPage from '../../../pages/health/history';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/health/history',
        asPath: '/health/history',
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

jest.mock('@/hooks/useHealthMetrics', () => ({
    useHealthMetrics: () => ({ history: [], loading: false, error: null }),
}));

jest.mock('shared/utils/date', () => ({
    formatRelativeDate: (d: string) => d,
}));

jest.mock('shared/utils/format', () => ({
    truncateText: (t: string) => t,
}));

jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ session: { userId: 'test-user-id' } }),
}));

jest.mock('@/layouts/HealthLayout', () => {
    return function MockHealthLayout({ children }: { children: React.ReactNode }) {
        return <div data-testid="health-layout">{children}</div>;
    };
});

jest.mock('styled-components', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- jest.requireActual returns any; we cast it to the known type immediately
    const actual: typeof import('react') = jest.requireActual('react');
    function createStyledTag() {
        return function StyledComponent(props: Record<string, unknown>) {
            return actual.createElement('div', null, props.children as React.ReactNode);
        };
    }
    const handler = {
        get: function () {
            return function templateTag() {
                return createStyledTag();
            };
        },
        apply: function () {
            return function templateTag() {
                return createStyledTag();
            };
        },
    };
    const styled = new Proxy(createStyledTag, handler);
    return {
        __esModule: true,
        default: styled,
        ThemeProvider: function ThemeProvider(props: Record<string, unknown>) {
            return actual.createElement('div', null, props.children as React.ReactNode);
        },
        css: function () {
            return '';
        },
        keyframes: function () {
            return '';
        },
    };
});

jest.mock('design-system/components/Card/Card', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment -- dynamic require for test mock isolation; jest.mock factory cannot use ES import syntax
    const ReactMod: typeof import('react') = require('react');
    return {
        Card: (props: Record<string, unknown>) =>
            ReactMod.createElement('div', null, props.children as React.ReactNode),
    };
});

describe('HistoryPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<HistoryPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<HistoryPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
