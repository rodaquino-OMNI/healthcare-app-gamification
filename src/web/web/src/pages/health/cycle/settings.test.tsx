import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from './settings';

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

describe('SettingsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<SettingsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<SettingsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
