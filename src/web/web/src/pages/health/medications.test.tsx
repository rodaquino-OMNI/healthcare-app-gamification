import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MedicationsPage from './medications';

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

describe('MedicationsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<MedicationsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<MedicationsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
