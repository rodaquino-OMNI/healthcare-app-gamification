import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import NutritionInsightsPage from './insights';

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

describe('NutritionInsightsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<NutritionInsightsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<NutritionInsightsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
