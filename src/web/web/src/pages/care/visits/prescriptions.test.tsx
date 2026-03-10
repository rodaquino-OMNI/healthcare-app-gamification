import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import PrescriptionsPage from './prescriptions';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/care/visits/prescriptions',
        asPath: '/care/visits/prescriptions',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('PrescriptionsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<PrescriptionsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<PrescriptionsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
