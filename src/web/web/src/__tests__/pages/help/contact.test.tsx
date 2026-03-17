import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import ContactPage from '../../../pages/help/contact';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/help/contact',
        asPath: '/help/contact',
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

describe('ContactPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<ContactPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<ContactPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
