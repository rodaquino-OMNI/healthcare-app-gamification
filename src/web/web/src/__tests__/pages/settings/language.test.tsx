import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import LanguagePage from '../../../pages/settings/language';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/settings/language',
        asPath: '/settings/language',
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
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en', changeLanguage: jest.fn() } }),
}));

jest.mock('../../../api/settings', () => ({
    saveLanguage: jest.fn().mockResolvedValue({}),
}));

describe('LanguagePage', () => {
    it('renders without crashing', () => {
        const { container } = render(<LanguagePage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<LanguagePage />);
        expect(container.firstChild).toBeTruthy();
    });
});
