import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExportPage from './export';

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

describe('ExportPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<ExportPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<ExportPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
