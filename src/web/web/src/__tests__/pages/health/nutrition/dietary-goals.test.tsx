import { render } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import DietaryGoalsPage from '../../../../pages/health/nutrition/dietary-goals';

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

describe('DietaryGoalsPage', () => {
    it('renders without crashing', () => {
        const { container } = render(<DietaryGoalsPage />);
        expect(container).toBeTruthy();
    });

    it('renders content in the document', () => {
        const { container } = render(<DietaryGoalsPage />);
        expect(container.firstChild).toBeTruthy();
    });
});
