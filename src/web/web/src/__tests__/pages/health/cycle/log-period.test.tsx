import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import LogPeriodPage from '../../../../pages/health/cycle/log-period';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/test',
        asPath: '/test',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('LogPeriodPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<LogPeriodPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<LogPeriodPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
