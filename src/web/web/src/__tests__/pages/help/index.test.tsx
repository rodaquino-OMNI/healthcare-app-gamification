import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import HelpHomePage from '../../../pages/help/index';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/help',
        asPath: '/help',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('HelpHomePage', () => {
    it('renders without crashing', () => {
        const { container } = render(<HelpHomePage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<HelpHomePage />);
        expect(container.firstChild).toBeTruthy();
    });
});
