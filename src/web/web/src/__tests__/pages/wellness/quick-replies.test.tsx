import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import QuickRepliesPage from '../../../pages/wellness/quick-replies';

jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        query: {},
        pathname: '/wellness/quick-replies',
        asPath: '/wellness/quick-replies',
        isReady: true,
    }),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'en' } }),
}));

describe('QuickRepliesPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<QuickRepliesPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<QuickRepliesPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
