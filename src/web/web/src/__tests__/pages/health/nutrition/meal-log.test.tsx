import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import MealLogPage from '../../../../pages/health/nutrition/meal-log';

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

describe('MealLogPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<MealLogPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<MealLogPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
