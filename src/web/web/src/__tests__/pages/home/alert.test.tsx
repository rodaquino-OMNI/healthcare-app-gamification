import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import AlertPage from '../../../pages/home/alert';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/home/alert',
        asPath: '/home/alert',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/components/index', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('AlertPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<AlertPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<AlertPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
