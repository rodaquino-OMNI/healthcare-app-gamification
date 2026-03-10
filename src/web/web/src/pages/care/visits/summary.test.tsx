import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import VisitSummaryPage from './summary';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care/visits/summary',
        asPath: '/care/visits/summary',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('VisitSummaryPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<VisitSummaryPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<VisitSummaryPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
