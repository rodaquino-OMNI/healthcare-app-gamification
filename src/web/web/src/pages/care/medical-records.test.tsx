import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import MedicalRecordsPage from './medical-records';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care/medical-records',
        asPath: '/care/medical-records',
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

jest.mock('@/layouts/MainLayout', () => ({
    MainLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

describe('MedicalRecordsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<MedicalRecordsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<MedicalRecordsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
