import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import CareNowPage from '../../../pages/care/index';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care',
        asPath: '/care',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

jest.mock('@/layouts/CareLayout', () => ({
    CareLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="care-layout">{children}</div>,
}));

describe('CareNowPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<CareNowPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<CareNowPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
