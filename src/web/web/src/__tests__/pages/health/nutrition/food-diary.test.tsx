import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import FoodDiaryPage from '../../../../pages/health/nutrition/food-diary';

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

describe('FoodDiaryPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<FoodDiaryPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<FoodDiaryPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
