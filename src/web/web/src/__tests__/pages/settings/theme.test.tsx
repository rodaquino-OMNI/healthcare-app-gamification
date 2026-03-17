import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import ThemePage from '../../../pages/settings/theme';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/settings/theme',
        asPath: '/settings/theme',
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

jest.mock('../../../api/settings', () => ({
    saveTheme: jest.fn().mockResolvedValue({}),
}));

describe('ThemePage', () => {
    it('renders without crashing', () => {
        const { container } = render(<ThemePage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<ThemePage />);
        expect(container.firstChild).toBeTruthy();
    });
});
